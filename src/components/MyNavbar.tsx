import { Navbar, NavbarItem } from '@heroui/navbar'
import React from 'react'
import Logo from './Logo'

export default function MyNavbar() {
  return (
    <Navbar maxWidth='full' className='bg-slate-800 h-12 '>
      <NavbarItem className='flex gap-2 font-extrabold  text-white '><Logo width={29} alt="Logo" className='-mr-1.5'/></NavbarItem>
    </Navbar>
  )
}
