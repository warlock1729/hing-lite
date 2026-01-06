// src/server/tasks/getTasksBySpace.ts
"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { editTaskSchema } from "@/lib/schemas/editTaskSchema";
import { revalidatePath } from "next/cache";
import z from "zod";

type GetTasksBySpaceArgs = {
  spaceId: number;
  page?: number; // 1-based
  pageSize?: number; // items per page
};

export async function getTasksBySpace({
  spaceId,
  page = 1,
  pageSize = 10,
}: GetTasksBySpaceArgs) {
  const skip = (page - 1) * pageSize;

  const [tasks, total] = await Promise.all([
    prisma.task.findMany({
      where: {
        spaceId,
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: pageSize,
      include: {
        assignedTo: {
          select: {
            id: true,
            name: true,
            image: true,
            email: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            image: true,
            email: true,
          },
        },
      },
    }),
    prisma.task.count({
      where: {
        spaceId,
      },
    }),
  ]);

  return {
    data: tasks,
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
      hasNextPage: skip + tasks.length < total,
      hasPrevPage: page > 1,
    },
  };
}

export async function getTaskById({ taskId }: { taskId: number }) {
  // check authorization and task access to user
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    select: {
      id: true,
      createdAt: true,
      description: true,
      dueDate: true,
      // space:
      priority: true,
      status: true,
      title: true,
      updatedAt: true,
      spaceId:true,
      assignedTo: {
        select: { name: true, id: true, image: true, email: true },
      },
      createdBy: { select: { name: true, id: true, image: true, email: true } },
    },
  });
  if (!task) return { status: "error", message: "Task not found" };
  return { status: "success", message: "Task found", data: task };
}

export async function createOrEditTask({
  taskId,
  spaceId,
  data,
}: {
  taskId?: number;
  spaceId: number;
  data: z.infer<typeof editTaskSchema>;
}) 
{
  const parsed = editTaskSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error("Invalid task data");
  }

  const session = await auth();
  if (!session?.user?.id) return { status: "error" };
  const { title, description, status, dueDate, priority, assigneeId } =
    parsed.data;

  if (taskId) {
    // EDIT
  revalidatePath("workspace/[id]/space/[spaceId]/task/[taskId]")

    return prisma.task.update({
      where: { id: taskId },
      data: {
        // title,
        description,
        status,
        dueDate,
        priority,
      },
    });
  }

  // CREATE
  return prisma.task.create({
    data: {
      title,
      description,
      status,
      dueDate,
      priority,
      createdById: session?.user?.id,
      assignedToId: assigneeId,
      spaceId: spaceId,
    },
  });
}
