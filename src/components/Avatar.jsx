import React from 'react'
import defaultAvatar from '../assets/defaultAvatar.svg'

export default function Avatar(props) {
    const { imgSrc ,
      className
      , ...restProps} = props


  return (
    <div className='flex items-center justify-center cursor-pointer'>
        <div className={className}>
        < img src={imgSrc ? imgSrc : defaultAvatar} />
        </div>
    </div>
  )
}
