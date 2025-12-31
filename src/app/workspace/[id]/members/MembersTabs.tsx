"use client"

import { Chip, Tab, Tabs } from "@heroui/react";
import { useState } from "react";
const tabs = [
  {
    key: "full",
    label: "Full Members",
    count: 12,
    // active: true,
  },
  {
    key: "guests",
    label: "Guests",
    count: 4,
  },
  {
    key: "pending",
    label: "Pending Invites",
    count: 1,
  },
];

export function MembersTabs() {
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
                  {tab.count}
                </Chip>
              </div>
            }
          />
        ))}
      </Tabs>
    </div>
  );
}