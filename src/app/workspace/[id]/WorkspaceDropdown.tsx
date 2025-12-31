"use client"
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";
import { Button } from "@heroui/button";
import { Workspace } from '@/types';
import { useRouter } from "next/navigation";

type currentWorkspace = {
    label: string | undefined;
    key: number | undefined;
    id: number | undefined;
} 

export default function WorkspaceDropdown({currentWorkspace,workspaces}:{currentWorkspace:currentWorkspace,workspaces:currentWorkspace[]}) {
    const router = useRouter()
    
  
  if(currentWorkspace)
  return (
    <Dropdown>
      <DropdownTrigger>
        <Button variant="light" className="flex gap-2 items-center">
          <div className="bg-green-300 px-2 py-1 rounded-sm font-bold">
            {currentWorkspace?.label?.charAt(0).toUpperCase()}
          </div>
          <div className="font-bold">{currentWorkspace.label}</div>
        </Button>
      </DropdownTrigger>

      <DropdownMenu
        aria-label="Select Workspace"
        items={workspaces}
        // onSelect={(a)=>alert("a")}
        onAction={(a)=>{router.push(`/workspace/${a}`)}}
        // sele
      >
        {(item) => (
          <DropdownItem key={item.key!}>
            {item.label}
          </DropdownItem>
        )}
      </DropdownMenu>
    </Dropdown>
  )
}
