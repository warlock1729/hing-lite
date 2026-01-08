"use client"

import { Chip, Spinner, Tab, Tabs } from "@heroui/react";
import { Suspense, useState } from "react";
import { UsersTable } from "./UsersTable";
const tabs = [
  {
    key: "full",
    label: "Full Members",
    component:(workspaceId:number)=><UsersTable
        key={new Date().toISOString()}
          workspaceId={workspaceId}
        />
  },
   {
    key: "active",
    label: "Active Members",
    component:(workspaceId:number)=><UsersTable
        key={new Date().toISOString()}
          workspaceId={workspaceId}
          isRemoved={false}
        />
  },
    {
    key: "removed",
    label: "Removed Members",
    component:(workspaceId:number)=><UsersTable
        key={new Date().toISOString()}
          workspaceId={workspaceId}
          isRemoved={true}

        />
  },
];

export function MembersTabs({tabsCount,workspaceId}:{tabsCount:{key:string,count:number}[],workspaceId:number}) {
  const [selected, setSelected] = useState<string | null>(null);
  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      <Tabs
        aria-label="Members tabs"
        variant="underlined"
        selectedKey={selected}
        onSelectionChange={(key) => setSelected(key as string)}
        classNames={{
          tabList: "gap-8",
          cursor: "bg-secondary ",
          tab: " pb-4 text-sm",
          tabContent: "group-data-[selected=true]:text-secondary font-medium",
        }}
      >
        {tabs.map((tab) => (
          <Tab
            key={tab.key}
            title={
              <div className="flex items-center gap-1.5">
                <span
                  className={
                    tab.key === selected
                      ? "font-semibold"
                      : "text-gray-500 dark:text-gray-400"
                  }
                >
                  {tab.label}
                </span>

                <Chip
                  size="sm"
                  radius="sm"
                  className={
                    tab.key === selected
                      ? "bg-secondary/10 text-secondary"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                  }
                >
                  {tabsCount.find(t=>t.key===tab.key)?.count}
                </Chip>
              </div>
            }
          >
             <div className="  mt-2">
        {tab.component(workspaceId)}
      </div>
          </Tab>
        ))}
      </Tabs>
    </div>
  );
}