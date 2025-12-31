"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { Workspace } from "@/types";

export async function getUserWorkspaceByIdOrDefaultWorkspace(
  workspaceId: number | null
):Promise<Workspace> {
  const email = (await auth())?.user?.email;
  const user = await prisma.user.findUnique({ where: { email: email! } });
  const id = user?.id;
  if (!id) throw new Error("Unauthorized");

  if (workspaceId) {
    const workspace = await prisma.workspace.findFirst({
      where: {
        id: workspaceId,
        members: {
          some: {
            userId: Number(id),
          },
        },
      },
    select: {
      id: true,
      name: true,
      createdAt: true,
      _count: true,
      members: true,
      projects: {
        select: { id: true, createdAt: true, name: true, updatedAt: true,spaces:true },
      },
    },
    });

    if(workspace) return workspace
  }

  const defaultWorkspace = await prisma.workspace.findFirst({
    where: {
      members: {
        some: {
          userId: Number(id),
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
     select: {
      id: true,
      name: true,
      createdAt: true,
      _count: true,
      members: true,
      projects: {
        select: { id: true, createdAt: true, name: true, updatedAt: true,spaces:true },
      },
    },
  });

  return defaultWorkspace!;
}

export async function getUserWorkspaces():Promise<Workspace[]> {
  const email = (await auth())?.user?.email;
  const user = await prisma.user.findUnique({ where: { email: email! } });
  const id = user?.id;
  if (!id) throw new Error("Unauthorized");

  const workspaces = await prisma.workspace.findMany({
    select: {
      id: true,
      name: true,
      createdAt: true,
      _count: true,
      members: true,
      projects: {
        select: { id: true, createdAt: true, name: true, updatedAt: true,spaces:true },
      },
    },
    where: {
      members: {
        some: {
          userId: Number(id),
        },
      },
    },
  });
  return workspaces;
}
