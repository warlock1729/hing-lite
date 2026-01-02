'use client'

import { HeroUIProvider } from '@heroui/react'
import React, { ReactNode } from 'react'
import {ToastContainer} from 'react-toastify'
import { SessionProvider } from "next-auth/react"

import 'react-toastify/ReactToastify.css'

export default function Providers({children}:{children:ReactNode}) {
  return (
    <SessionProvider>
    <HeroUIProvider>
      <ToastContainer position='top-right' className={'z-50'}/>
        {children}
    </HeroUIProvider>
    </SessionProvider>
  )
}
