
import { getUserWorkspaces } from "@/app/actions/workspaceActions";
import WorkspaceDropdown from "./WorkspaceDropdown";
import WorkspaceActions from "./WorkspaceActions";


type Props = {
      currentWorkspaceId:number

};

export default async function SideNavlist({ currentWorkspaceId }: Props) {
  const rawWorkspaces =  (await getUserWorkspaces()) || []
  const workspaces = rawWorkspaces.map(w=>({label:w?.name,key:w?.id,id:w?.id}))
  const currentWorkspace = workspaces.find(w=>w.id===currentWorkspaceId); 
  if(!currentWorkspace) return "No workspace found"
  return (
    <div id="w" className=" flex w-full items-center justify-between">
    <WorkspaceDropdown currentWorkspace={currentWorkspace} workspaces={workspaces} />
    <WorkspaceActions  workspace ={rawWorkspaces.find(w=>w.id===currentWorkspaceId)!} />
    </div>
  );
}
