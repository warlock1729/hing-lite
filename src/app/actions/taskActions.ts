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

const getPaginationObject = (
  page: number,
  pageSize: number,
  total: number,
  skip: number,
  dataLength: number
) => ({
  page,
  pageSize,
  total,
  totalPages: Math.ceil(total / pageSize),
  hasNextPage: skip + dataLength < total,
  hasPrevPage: page > 1,
});

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
    pagination: getPaginationObject(page, pageSize, total, skip, tasks.length),
  };
}

type GetTasksByWorkpaceArgs = {
  workspaceId: number;
  page?: number; // 1-based
  pageSize?: number; // items per page
};
export async function getTasksByWorkspace({
  workspaceId,
  page = 1,
  pageSize = 10,
}: GetTasksByWorkpaceArgs) {
  const skip = (page - 1) * pageSize;

  const [tasks, total] = await Promise.all([
    prisma.task.findMany({
      where: {
        space: { project: { workspaceId: workspaceId } },
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
        space: { project: { workspaceId: workspaceId } },
      },
    }),
  ]);

  return {
    data: tasks,
    pagination: getPaginationObject(page, pageSize, total, skip, tasks.length),
  };
}

export async function getUserTasks({
  page = 1,
  pageSize = 10,
}: {
  page: number;
  pageSize: number;
}) {
  const session = await auth();
  const userId = session?.user?.id;

  const skip = (page - 1) * pageSize;

  const [tasks, total] = await Promise.all([
    prisma.task.findMany({
      where: {
        assignedToId: userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: pageSize,
      include: {
        space: {
          select: { project: true, id: true, description: true, name: true },
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
        assignedToId: userId,
      },
    }),
  ]);

  return {
    data: tasks,
    pagination: getPaginationObject(page, pageSize, total, skip, tasks.length),
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
      spaceId: true,
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
}) {
  try {
    const parsed = editTaskSchema.safeParse(data);
    console.log("===========================",parsed.success)
    if (!parsed.success) {
      return { status: "error", error: "Invalid task data" };
    }

    const session = await auth();
    if (!session?.user?.id) return { status: "error" };
    const {
      title,
      description,
      status,
      dueDate: dueDateStringDate,
      priority,
      assigneeId,
    } = parsed.data;
    const dueDate = new Date(dueDateStringDate);

      revalidatePath("workspace/[id]/task/[taskId]","page");
    if (taskId) {
      // EDIT
      revalidatePath("workspace/[id]/task/[taskId]","page");

      const updatedTask = await prisma.task.update({
        where: { id: taskId },
        data: {
          // title,
          description,
          status,
          dueDate,
          priority,assignedToId:assigneeId
        },
      });

      return { status: "success", return: updatedTask };
    }

    // CREATE
    const newTask = await prisma.task.create({
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

    return { status: "success", data: newTask };
  } catch (error: any) {
    return {status:"error",error:error?.message || error  }
  }
}
