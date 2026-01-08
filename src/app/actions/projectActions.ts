"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export type CreateProjectInput = {
  name: string;
  description?: string;
  workspaceId: number;
};

export async function createProjectAction(input: CreateProjectInput) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return { status: "error", error: "Unauthorized" };
    }

    if (!input.name?.trim()) {
      return { status: "error", error: "Project name is required" };
    }

    const project = await prisma.project.create({
      data: {
        name: input.name.trim(),
        description: input.description?.trim() || null,
        workspaceId: input.workspaceId,
      },
    });

    revalidatePath("/projects");

    return { status: "success", data: project };
  } catch (error: any) {
    return { status: "error", error: error?.message || error };
  }
}
