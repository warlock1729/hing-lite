"use client"

import { ListboxWrapper } from "@/components/ListBoxWrapper";
import { prisma } from "@/lib/prisma";
import { Listbox, ListboxItem } from "@heroui/listbox";
import { Key, ReactNode, useState } from "react";
import { IoMdArrowDropright, IoMdArrowDropdown } from "react-icons/io";




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

export default  function ProjectsListbox({workspaceId}:{workspaceId:number}) {
    const [selectedProjectKey, setSelectedProjectKey] = useState<Key | null>(
      null
    );
    const data = []
  return (
     <ListboxWrapper>
          {
            <Listbox
              aria-label="Projects"
              onAction={(key) => {
                if (key === selectedProjectKey) setSelectedProjectKey(null);
                else setSelectedProjectKey(key);
              }}
            >
              {projectsWithSpaces.flatMap((project) => [
                /* Parent */
                <ListboxItem
                  key={project.key}
                  textValue={project.label}
                  startContent={
                    <>
                      {project.key === selectedProjectKey ? (
                        <IoMdArrowDropdown />
                      ) : (
                        <IoMdArrowDropright />
                      )}
                      {project.startIcon}
                    </>
                  }
                  className="font-medium"
                >
                  {project.label}
                </ListboxItem>,

                ...// project.spaces.length > 0
                (selectedProjectKey === project.key
                  ? [
                      <ListboxItem
                        key={`csjb-${project.key}`}
                        className="border-l-1 border-neutral-300 rounded-none ml-3.5  text-neutral-400 hover:bg-white! hover:text-neutral-400!"
                      >
                        <Listbox>
                          {project.spaces.map((space) => (
                            <ListboxItem key={space.key}>
                              {space.label}
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
  )
}
