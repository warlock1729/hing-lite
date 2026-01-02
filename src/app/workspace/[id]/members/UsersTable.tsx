"use client";

import { Avatar, Chip, Button, Code, Select, SelectItem, Spinner } from "@heroui/react";
import { DataTable, Column } from "./ReusableDataTable";
import { IoClipboardOutline } from "react-icons/io5";
import {
  mapWorkspaceMembersToTableUsers,
  TableUser as User,
} from "@/lib/mappers/workspaceMemberMapper";
import { useEffect, useState } from "react";
import {
  editMemberRole,
  getWorkspaceMembers,
} from "@/app/actions/membersActions";
import { TableFooter } from "./TableFooter";
import { useSession } from "next-auth/react";
const roleColorMap = {
  Owner: "primary",
  Admin: "secondary",
  Member: "default",
} as const;

const statusColorMap = {
  Active: "success",
  Removed: "warning",
} as const;

type paginationType = Pick<
  Awaited<ReturnType<typeof getWorkspaceMembers>>,
  "pagination"
>["pagination"];

export function UsersTable({ workspaceId }: { workspaceId: number }) {
  // { users }: { users: User[] }
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const handleRoleChange = async (userId: number, role: "Admin" | "Member") => {
    setIsLoading(true);
    await editMemberRole({ workspaceId: workspaceId, role, memberId: userId });
       getWorkspaceMembers({
      workspaceId: Number(workspaceId),
      page: pagination?.page,
      pageSize: pagination?.pageSize,
    }).then((result) => {
      const data = mapWorkspaceMembersToTableUsers(result.data);
      setPagination(result.pagination);
      setUsers(data);
      setCanEditRole(result.canEditRole);
          setIsLoading(false);
    });
  };
  const session = useSession();
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
      render: (user) => {
        const canEdit = canEditRole && user.email !== session.data?.user?.email;

        if (!canEdit) {
          return (
            <Chip size="sm" variant="flat" color={roleColorMap[user.role]}>
              {user.role}
            </Chip>
          );
        }

        return (
          <Select
            size="sm"
            selectedKeys={[user.role]}
            className="w-28"
            selectionMode="single"
            onSelectionChange={(keys) =>
              handleRoleChange(user.id, [...keys][0] as "Admin" | "Member")
            }
          >
            <SelectItem key="Admin">Admin</SelectItem>
            <SelectItem key="Member">Member</SelectItem>
          </Select>
        );
      },
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
        <Chip size="sm" color={statusColorMap[user.status]} variant="flat">
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
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState<paginationType>({
    hasNextPage: false,
    hasPreviousPage: false,
    page: 1,
    pageSize: 100,
    total: 0,
    totalPages: 0,
  });
  const [canEditRole, setCanEditRole] = useState<boolean>(false);
  useEffect(() => {
    getWorkspaceMembers({
      workspaceId: Number(workspaceId),
      page: pagination?.page,
      pageSize: pagination?.pageSize,
    }).then((result) => {
      const data = mapWorkspaceMembersToTableUsers(result.data);
      setPagination(result.pagination);
      setUsers(data);
      setCanEditRole(result.canEditRole);
    });
  }, [workspaceId, pagination.page, pagination.pageSize]);


    return (
      <>
        <DataTable columns={columns} data={users} isLoading={isLoading}/>
        <TableFooter
          from={(pagination.page - 1) * pagination.pageSize + 1}
          to={Math.min(
            pagination.page * pagination.pageSize - 1,
            pagination.total
          )}
          total={pagination?.total}
          disablePrev={!pagination.hasPreviousPage}
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
      </>
    );
}
