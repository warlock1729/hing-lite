"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { TaskStatus } from "@/generated/prisma";

type AnalyticsScope =
  | { type: "workspace"; workspaceId: number }
  | { type: "space"; spaceId: number };

export async function getAnalytics(scope: AnalyticsScope) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const userId = Number(session.user.id);
  const now = new Date();

  const baseTaskWhere =
    scope.type === "workspace"
      ? { space: { project: { workspaceId: scope.workspaceId } } }
      : { spaceId: scope.spaceId };

  const baseProjectWhere =
    scope.type === "workspace"
      ? { workspaceId: scope.workspaceId }
      : { spaceId: scope.spaceId };

  const [
    totalTasks,
    completedTasks,
    overdueTasks,
    tasksAssignedToMe,
    totalProjects,
    totalSpaces,
    totalUsers,
  ] = await Promise.all([
    prisma.task.count({
      where: baseTaskWhere,
    }),

    prisma.task.count({
      where: {
        ...baseTaskWhere,
        status: TaskStatus.DONE,
      },
    }),

    prisma.task.count({
      where: {
        ...baseTaskWhere,
        dueDate: { lt: now },
        status: { not: TaskStatus.DONE },
      },
    }),

    prisma.task.count({
      where: {
        ...baseTaskWhere,
        assignedToId: userId,
      },
    }),

    scope.type === "workspace"
      ? prisma.project.count({
          where: baseProjectWhere,
        })
      : Promise.resolve(0),

    // spaces only make sense at workspace level
    scope.type === "workspace"
      ? prisma.space.count({
          where: {
            project: {
              workspaceId: scope.workspaceId,
            },
          },
        })
      : Promise.resolve(0),

    // users only make sense at workspace level
    scope.type === "workspace"
      ? prisma.workspaceMember.count({
          where: { workspaceId: scope.workspaceId },
        })
      : Promise.resolve(0),
  ]);

  return {
    scope: scope.type,
    totalTasks,
    completedTasks,
    overdueTasks,
    tasksAssignedToMe,
    totalProjects,
    totalSpaces,
    totalUsers,
  };
}
