import { Heading2, Heading5 } from "@/components/typography";
import { TableUser as User } from "@/lib/mappers/workspaceMemberMapper";
import { MembersTabs } from "./MembersTabs";
import { fetchWorkspaceById } from "@/lib/helpers/workspace";
import InviteMemberModal from "@/components/InviteLinkModalWrapper";
import { Suspense } from "react";
import { Spinner } from "@heroui/spinner";

export const users: User[] = [];

export default async function page({ params }: { params: { id: string } }) {
  const workspaceId = Number((await params).id);
  const workspaceResult = await fetchWorkspaceById(workspaceId);
  if (workspaceResult.status === "error") {
    return "Workspace not found";
  }
  const workspace = workspaceResult.data;

  return (
    <div className="">
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
                {`${workspace.members.filter((u) => !u.isRemoved).length}/${
                  workspace.people
                } Seats Used`}
              </span>
              <div className="w-24 h-1.5 rounded-full mt-1 overflow-hidden">
                <progress value={workspace.members.filter((u) => !u.isRemoved).length.toString()} max={workspace.people.toString()} color="blue">32%</progress>
              </div>
            </div>
            <InviteMemberModal workspaceId={workspaceId} />
          </div>
        </div>
      </div>

      <MembersTabs
        workspaceId={workspaceId}
        tabsCount={[
          { key: "full", count: workspace.members.length },
          { key: "active", count: workspace.members.filter(u=>u.isRemoved===false).length },
          { key: "removed", count: workspace.members.filter(u=>u.isRemoved===true).length },
        ]}
      />
      <Suspense fallback={<Spinner />}></Suspense>
    </div>
  );
}
