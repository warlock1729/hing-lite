import {  getUserTasks } from "@/app/actions/taskActions";
import { TaskStatus, TaskPriority } from "@/generated/prisma";



export type Task = {
  id: number;
  name: string;
  createdBy: string;
  dueDate: string;
  status: TaskStatus;
  priority: TaskPriority;
  project:string;
  space:string
};

type ResponseTasks = Pick<Awaited<ReturnType<typeof getUserTasks>>, "data">['data']

export function mapTaskToFrontend(task: ResponseTasks[number]): Task {
  console.log(task.priority)
  return {
    id: task.id,
    name: task.title,
    project: task.space?.project?.name ?? "",
    space: task.space?.name ?? "",
    createdBy: task.createdBy.name ?? "" ,
    dueDate: task.dueDate.toISOString(),
    status: task.status,
    priority: task.priority,
  };
}

export function mapTasksToFrontend(tasks: ResponseTasks): Task[] {
  return tasks.map(mapTaskToFrontend);
}
