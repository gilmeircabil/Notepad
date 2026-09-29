import React from "react";
import { FiPlus, FiSearch, FiFileText } from "react-icons/fi";
import { NOTE_TEMPLATES } from "../../utils/Helper";

const EmptyCard = ({
  isSearch = false,
  searchQuery = "",
  onClearSearch,
  onOpenAddModal,
  onSelectTemplate,
}) => {
  if (isSearch) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-fade-in max-w-md mx-auto">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-zinc-800 text-slate-400 dark:text-zinc-500 flex items-center justify-center mb-4 ring-8 ring-slate-100/50 dark:ring-zinc-800/50">
          <FiSearch className="text-3xl" />
        </div>
        <h4 className="text-lg font-bold text-slate-800 dark:text-zinc-100">
          No matching notes found
        </h4>
        <p className="text-xs sm:text-sm text-slate-400 dark:text-zinc-400 mt-1.5 leading-relaxed">
          We couldn't find anything matching{" "}
          <span className="font-semibold text-slate-700 dark:text-zinc-200">
            "{searchQuery}"
          </span>
          . Try searching for different keywords or tags.
        </p>

        {onClearSearch && (
          <button
            onClick={onClearSearch}
            className="mt-6 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-md shadow-blue-500/20 active:scale-95 transition-all"
          >
            Clear Search
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="py-12 px-4 max-w-3xl mx-auto text-center animate-fade-in">
      {/* Visual Header */}
      <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-blue-500 to-indigo-600 text-white flex items-center justify-center mx-auto mb-4 shadow-xl shadow-blue-500/20 ring-8 ring-blue-50 dark:ring-blue-950/30">
        <FiFileText className="text-3xl" />
      </div>

      <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
        Your canvas is blank
      </h3>
      <p className="text-xs sm:text-sm text-slate-400 dark:text-zinc-400 mt-2 max-w-md mx-auto leading-relaxed">
        Capture thoughts, organize your day, or draft brilliant ideas. Start typing your first note or pick a starter template below!
      </p>

      {/* Main Action */}
      <div className="mt-6 flex justify-center">
        <button
          onClick={onOpenAddModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-lg shadow-blue-500/25 transition-all"
        >
          <FiPlus className="text-lg" />
          <span>Create First Note</span>
        </button>
      </div>

      {/* Interactive Starter Templates */}
      <div className="mt-12 text-left">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
            Quick Starter Templates
          </span>
          <span className="text-[11px] text-slate-400 dark:text-zinc-500">
            Click to use
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {NOTE_TEMPLATES.map((tmpl, idx) => (
            <div
              key={idx}
              onClick={() => onSelectTemplate && onSelectTemplate(tmpl)}
              className="group p-4 bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 hover:border-blue-400 dark:hover:border-blue-500 rounded-2xl cursor-pointer shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-md">
                    {tmpl.category}
                  </span>
                  <span className="text-xs text-slate-400 group-hover:text-blue-500 transition-colors">
                    Use →
                  </span>
                </div>
                <h5 className="text-sm font-bold text-slate-800 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {tmpl.title}
                </h5>
                <p className="text-xs text-slate-400 dark:text-zinc-400 line-clamp-2 mt-1">
                  {tmpl.content.replace(/###/g, "").replace(/- \[ \]/g, "•")}
                </p>
              </div>

              <div className="flex gap-1 mt-3">
                {tmpl.tags.map((t, ti) => (
                  <span
                    key={ti}
                    className="text-[9px] bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400 px-1.5 py-0.5 rounded"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmptyCard;