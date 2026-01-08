// "use client";


import React, { Key, ReactNode } from "react";
import { Divider } from "@heroui/divider";
import { Listbox, ListboxItem } from "@heroui/listbox";
import {
  IoAlbumsOutline,
  IoChatboxOutline,
  IoHomeOutline,
  IoPeopleOutline,
} from "react-icons/io5";
import { IoMdArrowDropright, IoMdArrowDropdown, IoMdAdd } from "react-icons/io";
import ProjectsListbox from "./ProjectsListbox";
import SideNavlist from "./SideNavlist";
import { notFound } from "next/navigation";
import { Workspace } from "@/types";
import SideNavtButtons from "./SideNavtButtons";
import CreateWorkspaceModal from "./WorkspaceActionModal";
import { Button } from "@heroui/button";
import CreateProjectForm from "./CreateProjectForm";

function Sidebar({workspace}:{workspace:Workspace}) {
  const rawProjects = workspace.projects

  // const projects = rawProjects.map(p=>{})
  return (
    <aside className=" w-[20%]  sticky top-[48px] min-h-[calc(100vh-48px)]">
      <div className=" p-1 w-full h-[60px] flex gap-2 items-center ">
       <SideNavlist
        currentWorkspaceId={workspace?.id }
        />
      </div>
      <Divider orientation="horizontal" />
      <SideNavtButtons workspaceId={workspace.id}/>
      <Divider orientation="horizontal" />

      <div className=" py-4 w-full h-[60px]  gap-2 items-center ">
        <div className="text-neutral-400 text-sm font-semibold ml-4 flex justify-between pr-2">
          <span>
            PROJECTS
            </span>
            
            <div className="p-1  rounded-full hover:bg-primary-50">
            <CreateProjectForm />
            </div>
        </div>
          
        <ProjectsListbox workspaceId={workspace.id} projects={rawProjects}/>

        <Divider orientation="horizontal" className="mt-4 self-center" />
      </div>

    </aside>
  );
}

export default Sidebar;
