'use client'


import Image from 'next/image';
import React from 'react'

const Avatar = () => {
    const size = 27;
  return (
    <Image className='rounded-full' alt='User Profile Pic' src="/assets/images/logo.svg" height={size} width={size}></Image>
  )
}

export default Avatar;