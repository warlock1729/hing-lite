import { getTaskById } from "@/app/actions/taskActions";
import EditTaskForm from "./EditTaskForm";
import { Suspense } from "react";
import { Spinner } from "@heroui/react";

export default async function TaskPage({
  params,
}: {
  params: Promise<{ taskId: string }>;
}) {
  const taskId = Number((await params).taskId);
  const { data: task } = await getTaskById({ taskId: taskId });

  if(task)
  return (
    <>
    {taskId}
   <EditTaskForm key={(new Date().getTime())} taskId={taskId} task={task}/>
   </>
  );
}
