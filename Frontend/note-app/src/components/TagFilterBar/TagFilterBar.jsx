import React from "react";
import { FiHash, FiCheck, FiFilter } from "react-icons/fi";
import { MdPushPin } from "react-icons/md";

const TagFilterBar = ({
  allTags = [],
  selectedTag = null,
  onSelectTag,
  activeFilter = "all", // "all" | "pinned"
  onSelectFilter,
  totalNotesCount = 0,
  pinnedCount = 0,
}) => {
  return (
    <div className="w-full overflow-x-auto py-2.5 scrollbar-none flex items-center gap-2 select-none">
      {/* All Notes Chip */}
      <button
        onClick={() => {
          onSelectFilter("all");
          onSelectTag(null);
        }}
        className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
          activeFilter === "all" && !selectedTag
            ? "bg-blue-600 text-white"
            : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80"
        }`}
      >
        <span>All Notes</span>
        <span
          className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
            activeFilter === "all" && !selectedTag
              ? "bg-blue-700/60 text-white"
              : "bg-slate-100 text-slate-500"
          }`}
        >
          {totalNotesCount}
        </span>
      </button>

      {/* Pinned Filter Chip */}
      {pinnedCount > 0 && (
        <button
          onClick={() => {
            onSelectFilter("pinned");
            onSelectTag(null);
          }}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
            activeFilter === "pinned" && !selectedTag
              ? "bg-amber-500 text-white"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80"
          }`}
        >
          <MdPushPin className="text-sm" />
          <span>Pinned</span>
          <span
            className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
              activeFilter === "pinned" && !selectedTag
                ? "bg-amber-600/60 text-white"
                : "bg-slate-100 text-slate-500"
          }`}
        >
          {pinnedCount}
        </span>
      </button>
      )}

      {/* Divider if tags exist */}
      {allTags.length > 0 && (
        <span className="w-[1px] h-5 bg-slate-200 mx-1 shrink-0" />
      )}

      {/* Tag Chips */}
      {allTags.map(({ name, count }) => {
        const isSelected = selectedTag === name;
        return (
          <button
            key={name}
            onClick={() => {
              onSelectTag(isSelected ? null : name);
            }}
            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all duration-200 ${
              isSelected
                ? "bg-indigo-600 text-white"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80"
            }`}
          >
            <FiHash className="text-[11px] opacity-70" />
            <span>{name}</span>
            <span
              className={`text-[10px] ml-0.5 px-1.5 py-0.2 rounded-full font-bold ${
                isSelected
                  ? "bg-indigo-700/60 text-white"
                  : "bg-slate-100 text-slate-400"
              }`}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default TagFilterBar;
