import { getAnalytics } from "@/app/actions/analyticsActions";
import { AnalyticsStats } from "@/types";

type Scope =
  | { type: "workspace"; workspaceId: number }
  | { type: "space"; spaceId: number };

export async function getAnalyticsStats(scope: Scope): Promise<AnalyticsStats> {
  const res = await getAnalytics(scope);

  return {
    totalTasks: res.totalTasks,
    completedTasks: res.completedTasks,
    overdueTasks: res.overdueTasks,
    tasksAssignedToMe: res.tasksAssignedToMe,
    totalProjects: res.totalProjects,
    totalSpaces: res.totalSpaces,
    totalUsers: res.totalUsers,
  };
}
