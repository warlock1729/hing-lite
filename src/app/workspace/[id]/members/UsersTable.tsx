"use client";

import {
  Avatar,
  Chip,
  Button,
  Code,
  Select,
  SelectItem,
  Spinner,
  user,
} from "@heroui/react";
import {
  DataTable,
  Column,
} from "@/components/ReusableDataTable/ReusableDataTable";
import { IoClipboardOutline, IoRemoveCircle } from "react-icons/io5";
import {
  mapWorkspaceMembersToTableUsers,
  TableUser as User,
} from "@/lib/mappers/workspaceMemberMapper";
import { useEffect, useState } from "react";
import {
  editMemberRole,
  getWorkspaceMembers,
} from "@/app/actions/membersActions";
import { TableFooter } from "@/components/ReusableDataTable/TableFooter";
import { useSession } from "next-auth/react";
import { PaginationType } from "@/types";
import AlertBox from "@/components/Alert/Alert";
import { removeWorkspaceMember } from "@/app/actions/workspaceActions";
import { toast } from "react-toastify";
const roleColorMap = {
  Owner: "primary",
  Admin: "secondary",
  Member: "default",
} as const;

const statusColorMap = {
  Active: "success",
  Removed: "warning",
} as const;

export function UsersTable({ workspaceId ,isRemoved}: { workspaceId: number,isRemoved?:boolean}) {
  // { users }: { users: User[] }
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showAlertBox, setShowAlertBox] = useState(false);
  const [userToRemove, setUserToRemove] = useState<User | null>(null);
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
        const canEdit = canEditRole && user.email !== session.data?.user?.email && user.status==='Active';

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
      render: (user) =>
        user.status==='Active' && user.email !== session.data?.user?.email &&
        ["Owner", "Admin"].includes(currentUserRole || "") &&
        user.role !== "Owner" ? (
          <div className="flex justify-end opacity-0 group-hover:opacity-100 transition">
            <Button
              onPress={() => {
                setShowAlertBox(true);
                setUserToRemove(user);
              }}
              isIconOnly
              size="md"
              variant="light"
            >
              <IoRemoveCircle size={20} color="red" />
            </Button>
          </div>
        ) : (
          <></>
        ),
    },
  ];
  const [users, setUsers] = useState<User[]>([]);
  const currentUserRole = users?.find(
    (u) => u.id === session.data?.user?.id
  )?.role;

  const [pagination, setPagination] = useState<
    PaginationType<typeof getWorkspaceMembers>
  >({
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
      isRemoved:isRemoved
    }).then((result) => {
      const data = mapWorkspaceMembersToTableUsers(result.data);
      setPagination(result.pagination);
      setUsers(data);
      setCanEditRole(result.canEditRole);
    });
  }, [workspaceId, pagination.page, pagination.pageSize,isRemoved]);

  const handleRemoveUser = async () => {
    setIsLoading(true)
    if (userToRemove) {
      const result = await removeWorkspaceMember({
        workspaceId: workspaceId,
        userId: userToRemove?.id,
      });
      if(result?.status==='success'){
        // setUsers(users=>users.filter(u=>u.id!==userToRemove.id))
        setUserToRemove(null)
        setShowAlertBox(false)
        toast.success("User removed successfully")

      }
    }
    setIsLoading(false)
  };
  return (
    <>
      <DataTable columns={columns} data={users} isLoading={isLoading} />
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
      {showAlertBox && (
        <AlertBox
          title="Are you sure you want to delete ?"
          description={`${userToRemove?.name} will be removed from this workspace`}
          onClose={() => {
            setShowAlertBox(false);
          }}
          rightBtnAction={handleRemoveUser}
        />
      )}
    </>
  );
}
