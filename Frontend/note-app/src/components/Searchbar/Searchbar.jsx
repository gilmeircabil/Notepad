import React from "react";
import { FaSearch, FaTimes } from "react-icons/fa";

const Searchbar = ({
  value,
  onChange,
  handleSearch,
  onClearSearch,
  inputRef,
}) => {
  return (
    <div className="relative flex items-center w-full px-3.5 py-1.5 bg-slate-100/80 dark:bg-zinc-800/80 hover:bg-slate-100 dark:hover:bg-zinc-800 border border-slate-200/80 dark:border-zinc-700/60 rounded-xl group focus-within:bg-white dark:focus-within:bg-zinc-900 focus-within:border-blue-500/60 dark:focus-within:border-blue-400/60 focus-within:ring-2 focus-within:ring-blue-500/10 dark:focus-within:ring-blue-400/10 focus-within:shadow-sm transition-all duration-200">
      <FaSearch className="text-slate-400 dark:text-zinc-500 text-sm mr-2.5 shrink-0 transition-colors group-focus-within:text-blue-500 dark:group-focus-within:text-blue-400" />

      <input
        ref={inputRef}
        type="text"
        placeholder="Search notes, tags, ideas..."
        className="w-full text-xs md:text-sm bg-transparent py-1 outline-none text-slate-800 dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-500 font-normal"
        value={value}
        onChange={onChange}
        onKeyDown={(e) => {
          if (e.key === "Enter" && handleSearch) handleSearch();
          if (e.key === "Escape" && onClearSearch) onClearSearch();
        }}
      />

      <div className="flex items-center gap-1.5 shrink-0 ml-1">
        {value ? (
          <button
            type="button"
            onClick={onClearSearch}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 hover:bg-slate-200/60 dark:hover:bg-zinc-700 transition-colors"
            title="Clear search (Esc)"
          >
            <FaTimes className="text-xs" />
          </button>
        ) : (
          <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-medium text-slate-400 dark:text-zinc-500 bg-slate-200/50 dark:bg-zinc-700/50 border border-slate-200 dark:border-zinc-700 rounded select-none">
            Ctrl K
          </span>
        )}
      </div>
    </div>
  );
};

export default Searchbar;