import MyTaskTable from '@/components/MyTasksTable'
import React from 'react'

export default async function page({params}:{params:Promise<{id:string}>}) {
  const p = await params
  const workspaceId = Number(p.id)
  return (
    <div>
        <MyTaskTable key={new Date().toISOString()} workspaceId={workspaceId}/>
    </div>
  )
}
