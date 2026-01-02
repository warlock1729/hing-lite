import { z } from "zod";

const createWorkspaceSchema = z.object({
  mode: z.literal("Create"),
  name: z.string(),
  description: z.string().min(10).max(1000),
  people: z.coerce.number<number>().min(1).max(100),
});

 const editWorkspaceSchema = z.object({
  mode: z.literal("Edit"),
  workspaceId: z.number().positive().nonoptional().readonly(),
  name: z.string(),
  description: z.string().min(10).max(1000),
  people: z.coerce.number<number>().int().min(1).max(100),
});

// export type CreateWorkspaceSchema = z.infer<typeof createWorkspaceSchema>;

// export type EditWorkspaceSchema = z.infer<typeof editWorkspaceSchema>;

export const formSchema = z.discriminatedUnion("mode", [
  createWorkspaceSchema,
  editWorkspaceSchema,
]);

export type FormSchema = z.infer<typeof formSchema>