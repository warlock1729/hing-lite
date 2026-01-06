"use client";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";
import { Button } from "@heroui/button";
import { BsThreeDotsVertical } from "react-icons/bs";
import CreateSpaceModal from "@/components/CreateSpaceModal";
import { useState } from "react";
export default function ProjectActions({projectId}:{projectId:number}) {
  const [isOpen,setOpen] = useState<boolean>(false)
  const actions = [
    {
      key: "add-space",
      label: "Add space",
      icon: <></>,
      action: () => {setOpen(true)},
    },

  ];

  return (
    <>
    <CreateSpaceModal isOpen={isOpen} onClose={()=>setOpen(false)} projectId={projectId} />
      <Dropdown placement="bottom-end">
        <DropdownTrigger>
          {/* <Button
            variant="light"
            className="p-0 min-w-0 min-h-0 bg-transparent"
          > */}
            <BsThreeDotsVertical />
          {/* </Button> */}
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
