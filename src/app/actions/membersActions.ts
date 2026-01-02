"use server";
import { auth } from "@/auth";
import { WorkspaceRole } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import { v4 as uuidv4 } from "uuid";

export async function regenerateWorkspaceInviteLink({
  workspaceId,
}: {
  workspaceId: string | number;
}) {
  const wid = Number(workspaceId);
  await prisma.workspace.update({
    where: { id: wid },
    data: { inviteCode: uuidv4() },
  });

  return { status: "success", data: { inviteCode: wid } };
}

export async function removeMemberFromWorkspace({
  workspaceId,
  memberId,
}: {
  workspaceId: string;
  memberId: string;
}) {
  const wid = Number(workspaceId);
  const session = await auth();
  const email = session?.user?.email;
  if (!email) return;

  const workspaceMember = await prisma.workspaceMember.findFirst({
    where: { workspaceId: wid, user: { email: email } },
  });

  if (!workspaceMember || workspaceMember.role !== "OWNER") {
    return { status: "error", message: "Unauthorized" };
  }

  const workspaceMemberToBeRemoved = await prisma.workspaceMember.findFirst({
    where: { workspaceId: wid, user: { id: Number(memberId) } },
  });
  const data = await prisma.workspaceMember.update({
    where: {
      userId_workspaceId: {
        userId: workspaceMemberToBeRemoved!.userId,
        workspaceId: workspaceMember.workspaceId,
      },
    },
    data: { isRemoved: true },
  });

  return { statsu: "success", message: "Member removed successfully" };
}

type GetWorkspaceMembersParams = {
  workspaceId: number;
  page?: number;
  pageSize?: number;
  includeRemoved?: boolean;
};

export async function getWorkspaceMembers({
  workspaceId,
  page = 1,
  pageSize = 10,
  includeRemoved = false,
}: GetWorkspaceMembersParams) {
  if (page < 1) page = 1;
  if (pageSize < 1) pageSize = 10;

  const skip = (page - 1) * pageSize;

  const whereClause = {
    workspaceId,
    ...(includeRemoved ? {} : { isRemoved: false }),
  };

  const [owner,members, total] = await Promise.all([prisma.workspaceMember.findFirst({
    where:{role:'OWNER',workspaceId:workspaceId,},select:{user:true}
  }),
    prisma.workspaceMember.findMany({
      where: whereClause,
      skip,
      take: pageSize,
      orderBy: {
        user: {
          createdAt: "asc",
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            createdAt: true,
          },
        },
      },
    }),

    prisma.workspaceMember.count({
      where: whereClause,
    }),
  ]);

  const session = await auth()
  const canEditRole = session?.user?.email === owner?.user.email
  return {
    data: members,
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
      hasNextPage: skip + pageSize < total,
      hasPreviousPage: page > 1,
    },
      canEditRole

  };
}



export async function editMemberRole({
  workspaceId,
  memberId,
  role,
}: {
  workspaceId: number;
  memberId: number;
  role: "Admin" | "Member";
}) {
  const roleUpperCase:WorkspaceRole =(role.toUpperCase() ) as WorkspaceRole
  const session = await auth();
  // console.log(session?.user)
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  // requester must be OWNER of this workspace
  const requester = await prisma.workspaceMember.findUnique({
    where: {
      userId_workspaceId: {
        userId: session.user.id,
        workspaceId,
      },
    },
  });

  if (requester?.role !== "OWNER") {
    throw new Error("Forbidden");
  }

  // owner cannot change own role
  if (requester.userId === memberId) {
    throw new Error("Owner cannot change own role");
  }

  if (![ "ADMIN", "MEMBER"].includes(roleUpperCase)) {
    throw new Error("Invalid role");
  }

  // target member must exist in workspace
  const target = await prisma.workspaceMember.findUnique({
    where: {
      userId_workspaceId: {
        userId: memberId,
        workspaceId,
      },
    },
  });

  if (!target) {
    throw new Error("Member not found in workspace");
  }

  const updated = await prisma.workspaceMember.update({
    where: {
      userId_workspaceId: {
        userId: memberId,
        workspaceId,
      },
    },
    data: { role:roleUpperCase },
  });

  return updated;
}

