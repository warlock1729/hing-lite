"use client"

import CreateProjectModal from '@/components/CreateProjectModal'
import React, { useState } from 'react'
import { IoMdAdd } from 'react-icons/io'

export default function CreateProjectForm() {
  
  const [isOpen,setIsOpen] = useState<boolean>(false)

  return (
    <>
    <IoMdAdd onClick={()=>setIsOpen(p=>!p)} className=""/>
    <CreateProjectModal isOpen={isOpen} onClose={()=>setIsOpen(p=>!p)} />
      
      </>
  )
}
