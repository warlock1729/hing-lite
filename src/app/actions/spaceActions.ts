"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getSpaceDetailsById(spaceId: number) {
  const space = await prisma.space.findUnique({
    where: { id: spaceId },
    select: {
      id: true,
      name: true,
      _count: true,
      createdAt: true,
      project: true,
      updatedAt: true,
    },
  });

  return space
}

export type CreateSpaceInput = {
  name: string;
  description: string;
  projectId:number
};

export async function createSpaceAction(input: CreateSpaceInput) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  if (!input.name?.trim()) {
    throw new Error("Space name is required");
  }

  await prisma.space.create({
    data: {
      name: input.name.trim(),
      description: input.description?.trim(),
      projectId:input.projectId
    },
  });

  revalidatePath("/spaces");
}
