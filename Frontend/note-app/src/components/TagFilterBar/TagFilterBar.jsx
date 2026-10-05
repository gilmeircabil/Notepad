import React from "react";
import { FiHash } from "react-icons/fi";
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
    <div className="w-full overflow-x-auto py-1 scrollbar-none flex items-center gap-2 select-none">
      {/* All Notes Chip */}
      <button
        onClick={() => {
          onSelectFilter("all");
          onSelectTag(null);
        }}
        className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors duration-150 ${
          activeFilter === "all" && !selectedTag
            ? "bg-slate-900 text-white shadow-sm shadow-slate-900/10"
            : "bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 border border-slate-200/70"
        }`}
      >
        <span>All Notes</span>
        <span
          className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold leading-none ${
            activeFilter === "all" && !selectedTag
              ? "bg-white/20 text-white"
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
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors duration-150 ${
            activeFilter === "pinned" && !selectedTag
              ? "bg-amber-600 text-white shadow-sm shadow-amber-600/10"
              : "bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 border border-slate-200/70"
          }`}
        >
          <MdPushPin className="text-sm" />
          <span>Pinned</span>
          <span
            className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold leading-none ${
              activeFilter === "pinned" && !selectedTag
                ? "bg-white/25 text-white"
                : "bg-slate-100 text-slate-500"
            }`}
          >
            {pinnedCount}
          </span>
        </button>
      )}

      {/* Divider if tags exist */}
      {allTags.length > 0 && (
        <span className="w-[1px] h-4 bg-slate-200/80 mx-1 shrink-0" />
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
            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors duration-150 ${
              isSelected
                ? "bg-blue-600 text-white shadow-sm shadow-blue-600/10"
                : "bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 border border-slate-200/70"
            }`}
          >
            <FiHash className="text-[11px] opacity-70" />
            <span>{name}</span>
            <span
              className={`text-[10px] ml-0.5 px-1.5 py-0.5 rounded-full font-bold leading-none ${
                isSelected
                  ? "bg-white/20 text-white"
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
