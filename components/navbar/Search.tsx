import React from 'react'

const Search = () => {
  return (
    <div>
        {/**Search Icon */}
        <button type="button" className="hover:text-sky-500 dark:hover:text-sky-400 ml-auto text-slate-500 w-8 h-8 -my-1 flex items-center justify-center dark:text-slate-400"><span className="sr-only">Search</span><svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m19 19-3.5-3.5"></path><circle cx="11" cy="11" r="6"></circle></svg>
              </button>
    </div>
  )
}

export default Search;