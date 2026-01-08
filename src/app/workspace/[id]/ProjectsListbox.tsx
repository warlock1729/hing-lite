"use client";


import { ListboxWrapper } from "@/components/ListBoxWrapper";
import { Project } from "@/types";
import { Listbox, ListboxItem } from "@heroui/listbox";
import Link from "next/link";
import { Key, useState } from "react";
import { IoMdArrowDropright, IoMdArrowDropdown } from "react-icons/io";
import ProjectActions from "./ProjectActions";


export default function ProjectsListbox({
  workspaceId,
  projects,
}: {
  workspaceId: number;
  projects: Project[];
}) {
  const [selectedProjectKey, setSelectedProjectKey] = useState<Key | null>(
    null
  );
 

  return (<>
    <ListboxWrapper>
      {
        <Listbox
          aria-label="Projects"
          onAction={(key) => {
            if (key === selectedProjectKey) setSelectedProjectKey(null);
            else setSelectedProjectKey(key);
          }}
        >

          {projects?.flatMap((project) => [
            /* Parent */
            <ListboxItem
              key={project.id}
              textValue={project.name}
              startContent={
                <>
                  {project.id.toString() === selectedProjectKey ? (
                    <IoMdArrowDropdown />
                  ) : (
                    <IoMdArrowDropright />
                  )}
                  {<div className="w-2 h-2 rounded-full bg-blue-400"></div>}
                </>
              }
              endContent={<ProjectActions projectId={project.id}/>}
              className="font-medium"
            >
              {project.name}
            </ListboxItem>,

            ...// project.spaces.length > 0
            (selectedProjectKey === project.id.toString()
              ? [
                  <ListboxItem
                    aria-label="project_spaces"
                    key={`csjb-${project.id}`}
                    className="border-l-1 border-neutral-300 rounded-none ml-3.5  text-neutral-400 hover:bg-white! hover:text-neutral-400!"
                  >
                    <Listbox aria-label="spaces">
                      {project.spaces.map((space) => (
                        <ListboxItem key={space.name} as={Link} href={`/workspace/${workspaceId}/space/${space.id}`} >
                          <span>
                            {space.name}
                          </span>
                        </ListboxItem>
                      ))}
                    </Listbox>
                  </ListboxItem>,
                ]
              : []),
               
              
          ])}
        </Listbox>
      }
    </ListboxWrapper>
    </>
  );
}
