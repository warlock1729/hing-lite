"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { Workspace } from "@/types";
import {  FormSchema } from "@/lib/schemas/createWorkspaceSchema";

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
       description:true,
      people:true,
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
       description:true,
      people:true,
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
      description:true,
      people:true,
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


// TypeScript interfaces to define expected data structures


// Create Workspace
export async function createWorkspace(data: Extract<FormSchema, { mode: "Create" }>) {

  const session = await auth()
  const userId = session?.user.id
  if(!userId) throw Error("Unauthorized")
  try {
    const { name, description, people } = data;
    const newWorkspace = await prisma.$transaction(async(p)=>{
      const newWorkspace = await prisma.workspace.create({
      data: {
        name,
        description,
        people,
      },
    });
    await prisma.workspaceMember.create({data:{workspaceId:newWorkspace.id,role:'OWNER',userId:userId}})
    return newWorkspace
    })
    

    return newWorkspace;
  } catch (error) {
    console.error('Error creating workspace:', error);
    throw new Error('Workspace creation failed');
  }
}

// Update Workspace
export async function updateWorkspace(data: Extract<FormSchema, { mode: "Edit" }>) {
  try {
    
    const { workspaceId:id, name, description, people } = data;

    const updatedWorkspace = await prisma.workspace.update({
      where: { id },
      data: {
        name,
        description,
        people,
      },
    });

    return updatedWorkspace;
  } catch (error) {
    console.error('Error updating workspace:', error);
    throw new Error('Workspace update failed');
  }
}

// Delete Workspace
export async function deleteWorkspace(id: number) {
  try {
    const deletedWorkspace = await prisma.workspace.delete({
      where: { id },
    });

    return deletedWorkspace;
  } catch (error) {
    console.error('Error deleting workspace:', error);
    throw new Error('Workspace deletion failed');
  }
}
