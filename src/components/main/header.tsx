import React from 'react'
import { ModeToggle } from '@/components/toggle/mode-toggle'

const Header = () => {
  return (
    <div className='flex justify-between items-center py-4 border-b-[1px] px-20 font-sans'>
        <span className='text-3xl font-bold tracking-tighter'>
            Phantom
        </span>
        <ModeToggle />
    </div>
  )
}

export default Header