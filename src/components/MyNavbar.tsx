import { Navbar, NavbarItem } from '@heroui/navbar'
import React from 'react'
import Logo from './Logo'

export default function MyNavbar() {
  return (
    <Navbar className='bg-indigo-600 h-12'>
      <NavbarItem><Logo width={19} alt="Logo"/></NavbarItem>
    </Navbar>
  )
}
