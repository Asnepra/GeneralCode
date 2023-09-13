import Avatar from '@components/Avatar';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import MenuItem from './MenuItem';
import { AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';
import useRegisterModal from '@hooks/useRegisterModal';
import useLoginModal from '@hooks/useLoginModal';
interface UserMenuProps{
  openLoginModel?: boolean;
}
const UserMenu:React.FC<UserMenuProps> = ({
  openLoginModel
}) => {
  const loginModal = useLoginModal();
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const [iconState, setIconState] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
 
  const handleOutsideClick = useCallback(
    (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setMenuIsOpen(false);
        setIconState(false);
      }
    },
    []
  );
  

  const toggleUserMenu = useCallback(() => {
    setMenuIsOpen((value) => !value);
    setIconState((state) => !state);
  }, []);

  const handleMenuLoginItemClick = useCallback(() => {
    setMenuIsOpen(false);
    setIconState(false);
    loginModal.onOpen();
  }, []);
  

  useEffect(() => {
    //uncomment to load the loginModal on Home Page
    //loginModal.onOpen();
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [handleOutsideClick]);

  const iconSize = 22;
  const avatarSize = 27;

  return (
    <div className='relative'>
      <div className='flex flex-row items-center gap-3'>
        <div
          className='p-1 md:py-1 md:px-2 border-b-[1px] border-neutral-100 flex flex-row items-center gap-3 rounded-full hover:shadow-md transition cursor-pointer'
          >
          {iconState ? (
            <AiOutlineClose onClick={toggleUserMenu} size={iconSize} />
          ) : (
            <AiOutlineMenu onClick={toggleUserMenu} size={iconSize} />
          )}
          <Avatar avatarSize={avatarSize} />
        </div>
      </div>
      {menuIsOpen && (
        <div
          ref={ref}
          className='absolute rounded-xl shadow-md bg-white overflow-hidden right-0 top-12 text-sm'
        >
          <div className='flex flex-col cursor-pointer'>
            <>
              <MenuItem onClick={handleMenuLoginItemClick} label='Login' />
              {/* <MenuItem onClick={handleMenuRegisterItemClick} label='Register' /> */}
            </>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
