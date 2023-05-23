'use client'


import Image from 'next/image';
import React from 'react'

import {RxAvatar} from 'react-icons/rx'

interface AvatarProps{
  avatarSize?: number;
}
const Avatar:React.FC<AvatarProps> = ({
  avatarSize
}) => {
    
  return (
   <RxAvatar size={avatarSize}/>
  )
}

export default Avatar;