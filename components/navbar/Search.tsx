

'use client'
import React from 'react'
import {BiSearch} from "react-icons/bi"

const Search = () => {
  const iconSize =22;
  return (
    <div>
        {/**Search Icon */}
        <div className="hover:text-sky-500 dark:hover:text-sky-400 ml-auto text-slate-500 w-8 h-8 -my-1 flex items-center justify-center dark:text-slate-400">
          <span className="sr-only">Search</span>
          <BiSearch size={iconSize}/>
        </div>
    </div>
  )
}

export default Search;