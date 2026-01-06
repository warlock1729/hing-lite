import { auth } from '@/auth'
import { Spinner } from '@heroui/spinner'
import React from 'react'
import { getDefaultWorkspaceId } from '../actions/workspaceActions'
import { redirect } from 'next/navigation'

export default async function page() {
    const session = await auth()
    const email = session?.user.email 
    const defaultWorkspaceId = await getDefaultWorkspaceId(email)
    
    redirect(`/workspace/${defaultWorkspaceId}/home `)
  return (
    <div className='w-full h-screen flex justify-center items-center '>
        <Spinner size={"lg"}></Spinner>
    </div>
  )
}
