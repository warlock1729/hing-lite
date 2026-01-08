// TaskTable.tsx
"use client";
import { Button, Chip } from "@heroui/react";
import {
  DataTable,
  Column,
} from "@/components/ReusableDataTable/ReusableDataTable";
import {
  getDaysLeftToDuedate,
  getStatusLabelColor,
  labelToStatus,
  statusToLabel,
} from "@/lib/utils";
import { RiFlagFill } from "react-icons/ri";
import { TaskPriority, TaskStatus } from "@/generated/prisma";
import { useEffect, useState } from "react";
import { getTasksBySpace } from "@/app/actions/taskActions";
import { PaginationType } from "@/types";
import CreateTaskForm from "./CreateTaskForm";
import {
  mapTasksToFrontend,
  Task,
} from "@/lib/mappers/SpaceTaskResponseMapper";
import { TableFooter } from "./ReusableDataTable/TableFooter";
import Link from "next/link";

const priorityConfig = {
  [TaskPriority.HIGH]: {
    label: "High",
    icon: () => <RiFlagFill size={20} color="red" />,
    className: "text-red-500",
  },
  [TaskPriority.MEDIUM]: {
    label: "Medium",
    icon: () => <RiFlagFill size={20} color="yellow" />,
    className: "text-yellow-500",
  },
  [TaskPriority.LOW]: {
    label: "Low",
    icon: () => <RiFlagFill size={20} color="blue" />,
  },
};



export default function TaskTable({ spaceId,workspaceId }: { spaceId: number,workspaceId:number }) {
  const columns: Column<Task>[] = [
  {
    key: "name",
    label: "Task Name",
    render: (item) => <Link href={`/workspace/${workspaceId}/task/${item.id.toString()}`}><span className="font-medium hover:underline">{item.name}</span></Link>,
  },
  {
    key: "priority",
    label: "Priority",
    render: (item) => {
      const { icon: Icon, label } = priorityConfig[item.priority];

      return <Icon />;
    },
  },

  {
    key: "assignee",
    label: "Assignee",
    render: (item) => (
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-full bg-gray-300 text-sm flex items-center justify-center">
          {item.assignee[0]}
        </div>
        <span>{item.assignee}</span>
      </div>
    ),
  },
  {
    key: "dueDate",
    label: "Days left",
    render: (item) => {
      const days = getDaysLeftToDuedate(item.dueDate);
    if(item.status==='DONE' && days<0) return <span>NA</span>
      const color = days < 0 ? "text-red-500" : "text-green-500";
      return <span className={`${color}`}>{days}</span>;
    },
  },
  {
    key: "status",
    label: "Status",
    render: (item) => (
      <Chip size="sm" variant="flat" color={getStatusLabelColor(item.status)}>
        {statusToLabel(item.status)}
      </Chip>
    ),
  },
];
  const [pagination, setPagination] = useState<
    PaginationType<typeof getTasksBySpace>
  >({
    page: 1,
    pageSize: 5,
    hasNextPage: false,
    hasPrevPage: false,
    total: 5,
    totalPages: 1,
  });
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    getTasksBySpace({
      spaceId,
      page: pagination?.page,
      pageSize: pagination?.pageSize,
    }).then((result) => {
      setTasks(mapTasksToFrontend(result.data));
      setPagination(result.pagination);
    });
  }, [pagination?.page, pagination?.pageSize, spaceId]);

  return (
    <div className=" bg-white rounded-xl ">
      <DataTable columns={columns} data={tasks} />
      <TableFooter
        from={(pagination.page - 1) * pagination.pageSize + 1}
        to={Math.min(
          pagination.page * pagination.pageSize - 1,
          pagination.total
        )}
        total={pagination?.total}
        disablePrev={!pagination.hasPrevPage}
        disableNext={!pagination.hasNextPage}
        onPrev={() =>
          setPagination((p) => ({
            ...p,
            page: p.page - 1,
          }))
        }
        onNext={() =>
          setPagination((p) => ({
            ...p,
            page: p.page + 1,
          }))
        }
      />
    </div>
  );
}
