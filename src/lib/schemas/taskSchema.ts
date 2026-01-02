// schemas/task.schema.ts
import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string().min(1, "Task name is required").max(100),
  dueDate: z.string(),
  assigneeId: z.coerce.number<number>().int(),
  priority: z.enum(["high", "medium", "low"]),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
