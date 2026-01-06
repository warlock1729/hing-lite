import { $ZodIssue } from "zod/v4/core";

type ActionResult<T> = {status:'success',data:T} | {status:'error',error:string|$ZodIssue[]}

// Enum for the WorkspaceRole (Assuming this is predefined elsewhere)
enum WorkspaceRole {
  OWNER='OWNER',
  ADMIN="ADMIN",
  MEMBER="MEMBER"
}


// Type for the Space within a Project
type Space = {
    name: string;
    id: number;
    createdAt: Date;
    updatedAt: Date;
    projectId: number;
};

// Type for the Project within the Workspace
type Project = {
    name: string;
    id: number;
    createdAt: Date;
    updatedAt: Date;
    spaces: Space[];
};

// Type for the Member of the Workspace
type Member = {
    userId: number;
    workspaceId: number;
    role: $Enums.WorkspaceRole;
};

// Main Workspace type
type Workspace = {
    name: string;
    id: number;
    people:number;
    description:string,
    createdAt: Date;
    _count?: {
        projects: number;
        members: number;
    };
    projects: Project[];
    members: Member[];
} ;

export type PaginationType<T> = Pick<Awaited<ReturnType<T>>, "pagination">["pagination"];

type ArrayElement<T> = T extends readonly (infer U)[] ? U : never;

type TableTask = {
  id: number;
  name: string;
  assignee: string;
  dueDate: string;
  status: TaskStatus;
  priority: TaskPriority;
};