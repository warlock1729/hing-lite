import { getTasksBySpace } from "@/app/actions/taskActions";
import { TaskStatus, TaskPriority } from "@/generated/prisma";
import { TableTask as Task } from "@/types";



type ResponseTasks = Pick<Awaited<ReturnType<typeof getTasksBySpace>>, "data">['data']

export function mapTaskToFrontend(task: ResponseTasks[number]): Task {
  console.log(task.priority)
  return {
    id: task.id,
    name: task.title,
    // project: task.space?.project?.name ?? "",
    assignee: task.assignedTo?.name ?? "Unassigned",
    dueDate: task.dueDate.toISOString(),
    status: task.status,
    priority: task.priority,
  };
}

export function mapTasksToFrontend(tasks: ResponseTasks): Task[] {
  return tasks.map(mapTaskToFrontend);
}
