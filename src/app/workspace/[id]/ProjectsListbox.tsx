"use client";

import { ListboxWrapper } from "@/components/ListBoxWrapper";
import { prisma } from "@/lib/prisma";
import { Project, Workspace } from "@/types";
import { Listbox, ListboxItem } from "@heroui/listbox";
import { Key, ReactNode, useState } from "react";
import { IoMdArrowDropright, IoMdArrowDropdown } from "react-icons/io";

// const projectsWithSpaces = [
//   {
//     key: "home",
//     label: "Home",
//     color: "bg-green-400",
//     startIcon: RandomColorDiv(),
//     spaces: [
//       {
//         key: "testing",
//         label: "Testing",
//       },
//       {
//         key: "frontend",
//         label: "Frontend",
//       },
//       {
//         key: "backend",
//         label: "Backend",
//       },
//     ],
//   },
//   {
//     key: "inbox",
//     label: "Inbox",
//     color: "bg-pink-400",
//     startIcon: RandomColorDiv(),

//     spaces: [],
//   },
//   {
//     key: "notifications",
//     label: "Notifications",
//     color: "bg-blue-400",
//     startIcon: RandomColorDiv(),

//     spaces: [],
//   },
// ];

type Props = {
  children: ReactNode;
};

export default function ProjectsListbox({ projects }: { projects: Project[] }) {
  const [selectedProjectKey, setSelectedProjectKey] = useState<Key | null>(
    null
  );
  const colors = [
    "green-400",
    "blue-400",
    "red-400",
    "yellow-400",
    "purple-400",
    "pink-400",
    "indigo-400",
    "teal-400",
    "orange-400",
    "gray-400",
  ];

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
          {projects.flatMap((project) => [
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
                        <ListboxItem key={space.name}>{space.name}</ListboxItem>
                      ))}
                    </Listbox>
                  </ListboxItem>,
                ]
              : []),
          ])}
        </Listbox>
      }
    </ListboxWrapper>
  );
}
