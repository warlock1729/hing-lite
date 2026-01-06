"use client"
import { Button } from '@heroui/react'
import React, { useState } from 'react'
import CreateTaskModal from './CreateTaskModal'

export default function CreateTaskForm() {
    const [isOpen,setOpen] = useState<boolean>(false)
  return (
    <>
          <Button onPress={()=>setOpen(true)} color="primary" className="mb-2">+ Add task</Button>
        <CreateTaskModal isOpen={isOpen} onClose={()=>setOpen(false)}/>
    </>
  )
}
