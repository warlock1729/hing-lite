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
import { IoMdArrowDropright, IoMdArrowDropdown } from "react-icons/io";
import ProjectsListbox from "./ProjectsListbox";
import SideNavlist from "./SideNavlist";
import { notFound } from "next/navigation";
import { Workspace } from "@/types";
import SideNavtButtons from "./SideNavtButtons";
import CreateWorkspaceModal from "./WorkspaceActionModal";
import CreateTaskModal from "@/components/CreateTaskForm";
type SidebarItemType = {
  label: string;
  key: string;
};


// const projects = [
//   { key: "Home", label: "Home", startContent: <IoHomeOutline size={16} /> },
//   {
//     key: "Members",
//     label: "Members",
//     startContent: <IoPeopleOutline size={16} />,
//   },
//   {
//     key: "My Tasks",
//     label: "My Tasks",
//     startContent: <IoAlbumsOutline size={16} />,
//   },
// ];

const projectsWithSpaces = [
  {
    key: "home",
    label: "Home",
    color: "bg-green-400",
    startIcon: <circle className="h-2 w-2 bg-green-400 rounded-full" />,
    spaces: [
      {
        key: "testing",
        label: "Testing",
      },
      {
        key: "frontend",
        label: "Frontend",
      },
      {
        key: "backend",
        label: "Backend",
      },
    ],
  },
  {
    key: "inbox",
    label: "Inbox",
    color: "bg-pink-400",
    startIcon: <circle className="h-2 w-2 bg-blue-400 rounded-full" />,

    spaces: [],
  },
  {
    key: "notifications",
    label: "Notifications",
    color: "bg-blue-400",
    startIcon: <circle className="h-2 w-2 bg-purple-400 rounded-full" />,

    spaces: [],
  },
];


type Props = {
  children: ReactNode;
};



function Sidebar({workspace}:{workspace:Workspace}) {
  const rawProjects = workspace.projects
  // const projects = rawProjects.map(p=>{})
  return (
    <aside className=" w-[20%]">
      <div className=" p-1 w-full h-[60px] flex gap-2 items-center ">
       <SideNavlist
        currentWorkspaceId={workspace?.id }
        />
      </div>
      <Divider orientation="horizontal" />
      <SideNavtButtons />
      <Divider orientation="horizontal" />

      <div className=" py-4 w-full h-[60px]  gap-2 items-center ">
        <div className="text-neutral-400 text-sm font-semibold ml-4">
          PROJECTS
        </div>
          
        <ProjectsListbox projects={rawProjects}/>

        <Divider orientation="horizontal" className="mt-4 self-center" />
      </div>

    </aside>
  );
}

export default Sidebar;
