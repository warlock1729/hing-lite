// "use client";

import { Heading2, Heading5 } from "@/components/typography";
import { Button } from "@heroui/button";
import { IoAddCircleOutline } from "react-icons/io5";
import { UsersTable } from "./UsersTable";




import { mapWorkspaceMembersToTableUsers, TableUser as User } from "@/lib/mappers/workspaceMemberMapper";
import { TableFooter } from "./TableFooter";
import { getWorkspaceMembers } from "@/app/actions/membersActions";
import { MembersTabs } from "./MembersTabs";

export const users: User[] = []

export default  async function page({params}:{params:{id:string}}) {
const workspaceId = Number((await params).id)
  // const result = await getWorkspaceMembers({
  //   workspaceId: Number(workspaceId),
  //   page: 1,
  //   pageSize: 20,
  // });
  //   const users = mapWorkspaceMembersToTableUsers(result.data);

  return (
    <div>
      <div className="mb-8 flex justify-between items-center">
        <div className="flex flex-col gap-4">
          <Heading2>Members</Heading2>
          <Heading5 className="font-light text-neutral-500">
            Manage who has access to this workspace and their roles
          </Heading5>
        </div>

        <div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col items-end mr-2">
              <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                12/20 Seats Used
              </span>
              <div className="w-24 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mt-1 overflow-hidden">
                <div className="h-full bg-green-500 w-[60%] rounded-full"></div>
              </div>
            </div>
            <Button className="flex items-center justify-center gap-2 bg-secondary hover:bg-secondary-hover text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow-lg shadow-primary/20 transition-all active:scale-95">
              <span className="material-symbols-outlined text-[20px]">
                <IoAddCircleOutline />
              </span>
              Invite Member
            </Button>
          </div>
        </div>
      </div>

      <MembersTabs />

      <div className="mx-4 mt-2">
        <UsersTable 
        workspaceId={workspaceId}
        // users={users} 
        />
      </div>
    </div>
  );
}
