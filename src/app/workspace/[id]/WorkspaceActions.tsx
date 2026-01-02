"use client";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";
import { Button } from "@heroui/button";
import { Workspace } from "@/types";
import { useRouter } from "next/navigation";
import { AiOutlineEdit, AiOutlinePlus, AiOutlineDelete } from "react-icons/ai";

import { BsThreeDotsVertical } from "react-icons/bs";
import { useState } from "react";
import CreateWorkspaceModal from "./WorkspaceActionModal";



type Props = { workspace: Workspace };

export default function WorkspaceActions({ workspace: w }: Props) {
  const [isVisible, setIsVisible] = useState(false);
  const [mode, setMode] = useState<"Create" | "Edit">("Create");
  const actions = [
    {
      key: "edit",
      label: "Edit ",
      icon: <AiOutlineEdit size={20} className="text-blue-500" />,
      action: () => {
        setMode("Edit");
        setIsVisible(true);
      },
    },
    {
      key: "create",
      label: "Create New ",
      icon: <AiOutlinePlus size={20} />,
      action: () => {
        setMode("Create");
        setIsVisible(true);
      },
    },
    {
      key: "delete",
      label: "Delete ",
      icon: <AiOutlineDelete color="red" size={20} className="text-red-500" />,
      action: () => console.log("Workspace deleted"),
    },
  ];

  return (
    <>
      <CreateWorkspaceModal
        name={w.name}
        description={w.description}
        people={w.people}
    id={w.id}
        isVisible={isVisible}
        setIsVisible={setIsVisible}
        mode={mode}
      />
      <Dropdown placement="bottom-start">
        <DropdownTrigger>
          <Button
            variant="light"
            className="p-0 min-w-1 min-h-0 bg-transparent"
          >
            <BsThreeDotsVertical />
          </Button>
        </DropdownTrigger>

        <DropdownMenu
          aria-label="Select Workspace"
          items={actions}
          onAction={(key) => actions.find((a) => a.key === key)?.action()}
        >
          {(item) => (
            <DropdownItem key={item.key!} startContent={item.icon}>
              {item.label}
            </DropdownItem>
          )}
        </DropdownMenu>
      </Dropdown>
    </>
  );
}
