"use client"

import { ReactNode } from "react";

export const SideNavWrapper = ({ children }: {children:ReactNode}) => (
  <div className="w-full max-w-[260px]  px-1 py-2 ">{children}</div>
);
