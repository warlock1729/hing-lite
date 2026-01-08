import { TaskStatus } from "@/generated/prisma";
import { AnalyticsCard, AnalyticsStats } from "@/types";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
;
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const TaskStatusColorMap: Record<
  string,
  "default" | "primary" | "success" | "warning" | "danger"
> = {
  BACKLOG: "danger",
  "IN_REVIEW": "primary",
  TODO: "danger",
  "IN_PROGRESS": "warning",
  DONE: "success",
};

const statusLabels: Record<TaskStatus, string> = {
  BACKLOG: "Backlog",
  IN_REVIEW: "In Review",
  TODO: "Todo",
  IN_PROGRESS: "In Progress",
  DONE: "Done",
};

export function statusToLabel(status: TaskStatus): string {
  return statusLabels[status];
}
export function labelToStatus(label: string): TaskStatus {
  return labelToStatusMap[label];
}

export function getStatusLabelColor(status:TaskStatus){
  return TaskStatusColorMap[status]
}
const labelToStatusMap: Record<string, TaskStatus> = {
  "Backlog": TaskStatus.BACKLOG,
  "In Review": TaskStatus.IN_REVIEW,
  "Todo": TaskStatus.TODO,
  "In Progress": TaskStatus.TODO,
  "Done": TaskStatus.DONE,
};

export const getDaysLeftToDuedate = (dueDate: string) => {
  const today = new Date();
  const due = new Date(dueDate);

  // Clear time to avoid off-by-one errors
  today.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);

  const diffTime = due.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};


export function mapAnalyticsCards(ANALYTICS_CARDS:Omit<AnalyticsCard, "value">[],stats: AnalyticsStats): AnalyticsCard[] {
  return ANALYTICS_CARDS.map((card) => ({
    ...card,
    value: stats[card.key],
  }));
}



