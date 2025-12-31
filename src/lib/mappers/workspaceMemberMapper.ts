import { getWorkspaceMembers } from "@/app/actions/membersActions";
import { Prisma } from "@/generated/prisma";

export type TableUser = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  initials?: string;
  role: "Owner" | "Admin" | "Member";
  status: "Active" | "Removed";
  joinedAt: string;
};


export function mapWorkspaceMemberToTableUser(member: {
  role: "OWNER" | "ADMIN" | "MEMBER";
  isRemoved: boolean;
  user: {
    id: number;
    name: string | null;
    email: string;
    image?: string | null;
    createdAt: Date;
  };
}): TableUser {
  const user = member.user;

  const initials =
    user.name
      ? user.name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
      : user.email[0].toUpperCase();

  return {
    id: user.id.toString(),
    name: user.name || user.email,
    email: user.email,
    avatar: user.image || undefined,
    initials,
    role:
      member.role === "OWNER"
        ? "Owner"
        : member.role === "ADMIN"
        ? "Admin"
        : "Member",
    status: member.isRemoved ? "Removed" : "Active",
    joinedAt: user.createdAt.toISOString(),
  };
}

export function mapWorkspaceMembersToTableUsers(
  members: Awaited<ReturnType<typeof getWorkspaceMembers>>["data"]
): TableUser[] {
  return members.map(mapWorkspaceMemberToTableUser);
}
