
import { TaskPriority, TaskStatus } from "@/generated/prisma";
import { z } from "zod";

export const editTaskSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(10),
  status: z.enum(TaskStatus),
  dueDate: z.iso.date().nonoptional(),
  priority: z.enum(TaskPriority),
  assigneeId:z.coerce.number<number>().int().positive().nonoptional()
});


export type EditTaskFormValues = z.infer<typeof editTaskSchema>;
