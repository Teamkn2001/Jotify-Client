import React from 'react'
import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <div className='sticky top-0 z-50 w-4/5 h-[5rem] m-auto '>
      <div className=' w-3/5 h-full flex items-center my-3 border-2 rounded-xl backdrop-blur-md m-auto'>
        <nav className='w-full flex justify-around top-0 z-30 '>
          <Link to='#' className='text-2xl font-bold text-white hover:text-3xl'>What Jotify can do?</Link>
          <Link to='#' className='text-2xl font-bold text-white hover:text-3xl'>Dev</Link>
          <Link to='#' className='text-2xl font-bold text-white hover:text-3xl'>Contact</Link>
          <Link to='#' className='text-2xl font-bold text-white hover:text-3xl'>Back</Link>
        </nav>
      </div>
    </div>
  )
}
