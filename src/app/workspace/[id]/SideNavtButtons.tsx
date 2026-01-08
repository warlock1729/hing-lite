"use client";
import { ListboxWrapper } from "@/components/ListBoxWrapper";
import { Listbox, ListboxItem } from "@heroui/listbox";
import { Button } from "@heroui/button";
import Link from "next/link";
import React, { ReactNode } from "react";
import {
  IoAlbumsOutline,
  IoHomeOutline,
  IoPeopleOutline,
} from "react-icons/io5";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function SideNavButtons({
  workspaceId,
}: {
  workspaceId: number;
}) {
  const projects = [
    {
      key: "Home",
      label: "Home",
      startContent: <IoHomeOutline className="mr-1" size={16} />,
      path: `/workspace/${workspaceId}/home`,
    },
    {
      key: "Members",
      label: "Members",
      startContent: <IoPeopleOutline className="mr-1" size={16} />,
      path: `/workspace/${workspaceId}/members`,
    },
    {
      key: "My Tasks",
      label: "My Tasks",
      startContent: <IoAlbumsOutline className="mr-1" size={16} />,
      path: `/workspace/${workspaceId}/my-tasks`,
    },
  ];

  const path = usePathname();
  const isActive = (linkPath: string) => {
    if (path === linkPath) return "text-secondary-400 bg-secondary-50";
    return "";
  };

  return (
    <div className="w-full max-w-[260px]  px-1 py-2 pl-2">
      {projects.map((p) => (
        <Link key={p.key} href={p.path} passHref>
          <Button
            className={cn(
              "w-full my-[1px] justify-start bg-transparent h-fit py-1.5 text-black hover:text-secondary-400  ",
              isActive(p.path)
            )}
            disabled={p.path===path}
            radius="sm"
            color="secondary"
            startContent={p.startContent}
          >
            {p.label}
          </Button>
        </Link>
      ))}
    </div>
  );
}
