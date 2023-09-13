
'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Logo from './Logo';
import Search from './Search';
import DarkModeToggleIcon from './DarkModeToggleIcon';
import UserMenu from './UserMenu';

const Navbar = () => {
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add('dark');
      window.localStorage.setItem('isDarkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      window.localStorage.removeItem('isDarkMode');
    }
  };

  return (
    <div className="dark:bg-slate-700/70  bg-opacity-0 backdrop-filter backdrop-blur-sm flex flex-row justify-between w-full p-2 py-4 z-10 lg:px-8 shadow-sm border-b-[1px] border-slate-900/10 lg:border-0 dark:border-slate-300/10">
      <div className="px-2 flex items-center gap-3">
        <Logo />
      </div>

      <div className="ml-auto flex items-center">
        <div className="hidden mr-2 md:mr-6 sm:flex space-x-8 text-sm leading-6 font-semibold text-slate-700 dark:text-slate-200">
          {/* <Link className="hover:text-sky-500 dark:hover:text-sky-400" href="/">
            Components
          </Link>
          <Link className="hover:text-sky-500 dark:hover:text-sky-400" href="/">
            Docs
          </Link> */}
        </div>
        <Search />
        <DarkModeToggleIcon onClick={toggleDarkMode}/>
        <UserMenu openLoginModel/>
          
        
      </div>
    </div>
  );
};

export default Navbar;
