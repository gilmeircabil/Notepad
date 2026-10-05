import React from "react";
import { FaSearch, FaTimes } from "react-icons/fa";

const Searchbar = ({
  value,
  onChange,
  handleSearch,
  onClearSearch,
  inputRef,
}) => {
  const isMac =
    typeof navigator !== "undefined" &&
    /Mac|iPhone|iPod|iPad/.test(navigator.platform || navigator.userAgent);

  return (
    <div className="relative flex items-center w-full px-3.5 py-1.5 bg-slate-100/70 border border-slate-200/70 rounded-xl group focus-within:bg-white focus-within:border-blue-500/50 focus-within:ring-2 focus-within:ring-blue-500/10 transition-all duration-150">
      <FaSearch className="text-slate-400 text-sm mr-2.5 shrink-0 transition-colors group-focus-within:text-blue-500" />

      <input
        ref={inputRef}
        type="text"
        placeholder="Search notes, tags, ideas..."
        className="w-full text-xs md:text-sm bg-transparent py-1 outline-none text-slate-800 placeholder:text-slate-400 font-normal"
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
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-black/5 transition-colors"
            title="Clear search (Esc)"
          >
            <FaTimes className="text-xs" />
          </button>
        ) : (
          <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-medium text-slate-400 bg-slate-200/50 border border-slate-200/70 rounded select-none">
            {isMac ? "⌘ K" : "Ctrl K"}
          </span>
        )}
      </div>
    </div>
  );
};

export default Searchbar;