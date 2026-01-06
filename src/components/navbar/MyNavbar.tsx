import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@heroui/navbar";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import React from "react";
import Logo from "../Logo";
import { Avatar } from "@heroui/avatar";
import { auth, signOut } from "@/auth";
import UserMenu from "./UserMenu";

export default async function MyNavbar() {
  const session = await auth();
  const user = session?.user;
  return (
    <Navbar maxWidth="full" className="bg-slate-800 h-12">
      <NavbarBrand className="flex gap-2 font-extrabold text-white">
        <Logo width={29} alt="Logo" className="-mr-1.5" />
      </NavbarBrand>

      <NavbarContent justify="end">
        <NavbarItem>
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Avatar
                size="sm"
                className="cursor-pointer"
                src={user?.image || ""}
                name={user?.name?.at(0)}
              />
            </DropdownTrigger>
            <UserMenu />
          </Dropdown>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
