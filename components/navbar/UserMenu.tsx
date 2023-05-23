'use client'

import Avatar from '@components/Avatar';
import React, { useCallback, useState } from 'react'
import MenuItem from './MenuItem';

const UserMenu = () => {

    const [menuIsOpen, setMenuIsOpen] = useState(true);

    //Function to toggle open the UserMenu

    const toggleUserMenu= useCallback(() => {
        //Return the opposite of the current state
        setMenuIsOpen((value)=>!value);
    },[]);
    const iconSize= 27;
  return (
    <div className='relative'>
        <div className='flex flex-row items-center gap-3'>
            <div className='p-1 md:py-1 md:px-2 border-b-[1px] border-neutral-100 flex flex-row items-center gap-3 rounded-full hover:shadow-md transition cursor-pointer' onClick={toggleUserMenu}>
                {/**Add the Menu Hamburger Icon */}
                <svg width={iconSize} height={iconSize} viewBox="0 0 100 100">
                <path d="M20 20H80V80H20z" stroke="black" stroke-width="2" fill="none"/>
                <path d="M20 40H80V60H20z" stroke="black" stroke-width="2" fill="none"/>
                <path d="M40 20H60V80H40z" stroke="black" stroke-width="2" fill="none"/>
                </svg>
                <Avatar></Avatar>
            </div>

        </div>
        {menuIsOpen && (
            <div className='absolute rounded-xl shadow-md bg-white overflow-hidden right-0 top-12 text-sm'>
                <div className='flex flex-col cursor-pointer'>
                    <>
                    <MenuItem onClick={()=>{}} label='Login'/>
                    <MenuItem onClick={()=>{}} label='Register'/>
                    </>
                </div>
            </div>
        )}
    </div>
  )
}

export default UserMenu;