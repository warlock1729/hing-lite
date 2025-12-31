"use client"
import { ListboxWrapper } from '@/components/ListBoxWrapper';
import { Listbox, ListboxItem } from '@heroui/react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { ReactNode } from 'react'
import { IoAlbumsOutline, IoHomeOutline, IoPeopleOutline } from 'react-icons/io5';



const projects = [
  { key: "Home", label: "Home", startContent: <IoHomeOutline size={16} />,path:'home' },
  {
    key: "Members",
    label: "Members",
    startContent: <IoPeopleOutline size={16} />,
    path:'members'
  },
  {
    key: "My Tasks",
    label: "My Tasks",
    startContent: <IoAlbumsOutline size={16} />,
    path:'tasks'
  },
];


export default function SideNavtButtons() {
  const path = usePathname()
  return (
   <ListboxWrapper>
        
        <Listbox
          items={projects}
          aria-label="Actions"
          onAction={(key) => {
          
          }}
          selectionMode='single'
          
        >
          {(item) => (
            <ListboxItem
              key={item.key}
              startContent={item.startContent}
            
            >
              
              {item.label}
            </ListboxItem>
          )}
        </Listbox>
      </ListboxWrapper>
  )
}
