
import { getUserWorkspaces } from "@/app/actions/workspaceActions";
import WorkspaceDropdown from "./WorkspaceDropdown";


type Props = {
      currentWorkspaceId:number

};

export default async function SideNavlist({ currentWorkspaceId }: Props) {
  const rawWorkspaces =  (await getUserWorkspaces()) || []
  const workspaces = rawWorkspaces.map(w=>({label:w?.name,key:w?.id,id:w?.id}))
  const currentWorkspace = workspaces.find(w=>w.id===currentWorkspaceId); 
  if(!currentWorkspace) return "No workspace found"
  return (
    <WorkspaceDropdown currentWorkspace={currentWorkspace} workspaces={workspaces} />
  );
}
