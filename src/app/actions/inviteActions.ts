// app/actions/invite.ts
"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { ActionResult } from "@/types";


export async function getInviteInfo(
  inviteCode: string
): Promise<ActionResult<{
  workspaceId: number;
  workspaceName: string;
  isMember: boolean;
}>> {
  const session = await auth();

  if (!session?.user?.id) {
    return { status: "error", error: "UNAUTHENTICATED" };
  }

  const workspace = await prisma.workspace.findUnique({
    where: { inviteCode },
    select: {
      id: true,
      name: true,
      members: { where: { userId: session.user.id } },
    },
  });

  if (!workspace) {
    return { status: "error", error: "INVALID_INVITE" };
  }

  return {
    status: "success",
    data: {
      workspaceId: workspace.id,
      workspaceName: workspace.name,
      isMember: workspace.members.length > 0,
    },
  };
}

export async function acceptInvite(
  inviteCode: string,isAlreadyMember:boolean
): Promise<ActionResult<{ workspaceId: number }>> {
  const session = await auth();

  if (!session?.user?.id) {
    return { status: "error", error: "UNAUTHENTICATED" };
  }

  const workspace = await prisma.workspace.findUnique({
    where: { inviteCode },
    select:{id:true,members:{where:{isRemoved:false},},people:true}
  });

  if(workspace?.people===workspace?.members.length){
    return {status:"error",error:"Workspace is full you cannot join"}
  }
  if (!workspace) {
    return { status: "error", error: "INVALID_INVITE" };
  }

  if(!isAlreadyMember)
  await prisma.workspaceMember.create({
    data: {
      userId: session?.user?.id,
      workspaceId: workspace.id,
      role: "MEMBER",
    },
  });

  return {
    status: "success",
    data: { workspaceId: workspace.id },
  };
}
