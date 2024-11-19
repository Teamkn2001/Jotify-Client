import React from 'react'
import Header from '../../components/guest/Header'
import { Outlet } from 'react-router-dom'

export default function GuestLayout() {
  return (
    <div className='w-screen h-screen overflow-hidden' style={{
      backgroundImage: `url(https://res.cloudinary.com/djudr1vzc/image/upload/v1731830229/bg-sunflower4k_xhbsvp.jpg)`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
  }}>
    <Header />
    <Outlet />
    </div>
  )
}
