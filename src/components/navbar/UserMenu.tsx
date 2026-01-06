"use client";
import React from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import { signOut } from "next-auth/react";

export default function UserMenu() {
  return (
    <>
      <DropdownMenu
        items={[{ key: "logout", label: "Log out" }]}
        aria-label="User menu"
        onAction={(key) => {
          if (key === "logout") {
            signOut({ redirectTo: "/login" });
          }
        }}
      >
          {(item) => (
            <DropdownItem key={item.key} className="text-danger">
              {" "}
              <span>{item.label}</span>
            </DropdownItem>
          )}
      </DropdownMenu>
    </>
  );
}
