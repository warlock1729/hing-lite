"use client";

import { Avatar, Chip, Button, Code } from "@heroui/react";
import { DataTable, Column } from "./ReusableDataTable";
import { IoClipboardOutline } from "react-icons/io5";
import { TableUser as User } from "@/lib/mappers/workspaceMemberMapper";


const roleColorMap = {
  Owner: "primary",
  Admin: "secondary",
  Member: "default",
} as const;

const statusColorMap = {
  Active: "success",
  Removed: "warning",
} as const;

export function UsersTable({ users }: { users: User[] }) {
  const columns: Column<User>[] = [
    {
      key: "id",
      label: "User",
      width: 200,
      render: (user) => (
        <div className="flex items-center gap-3">
          <Avatar
            src={user.avatar}
            name={user.initials || user.name}
            size="sm"
          />
          <div>
            <p className="text-sm font-medium">{user.name}</p>
            {/* <p classN ame="text-xs text-default-500">{user.email}</p> */}
          </div>
        </div>
      ),
    },
    {
      key: "role",
      label: "Role",
      render: (user) => (
        <Chip
          size="sm"
          variant="flat"
          color={roleColorMap[user.role]}
        >
          {user.role}
        </Chip>
      ),
    },
    {
      key: "email",
      label: "EMAIL ADDRESS",
      render: (user) => (
        <span className="text-sm text-default-600 inline cursor-pointer">
         <Code>{user.email} </Code>
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (user) => (
        <Chip
          size="sm"
          color={statusColorMap[user.status]}
          variant="flat"
        >
          {user.status}
        </Chip>
      ),
    },
    {
      key: "actions",
      label: "",
      render: () => (
        <div className="flex justify-end opacity-0 group-hover:opacity-100 transition">
          <Button isIconOnly size="sm" variant="light">
            {/* <MoreHorizontal size={18} /> */}
          </Button>
        </div>
      ),
    },
  ];

  return     <DataTable columns={columns} data={users} />
}
