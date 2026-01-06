"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export type CreateProjectInput = {
  name: string;
  description?: string;
  workspaceId:number
};

export async function createProjectAction(input: CreateProjectInput) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  if (!input.name?.trim()) {
    throw new Error("Project name is required");
  }

  await prisma.project.create({
    data: {
      name: input.name.trim(),
      description: input.description?.trim() || null,
      workspaceId:input.workspaceId
    },
  });

  revalidatePath("/projects");
}
