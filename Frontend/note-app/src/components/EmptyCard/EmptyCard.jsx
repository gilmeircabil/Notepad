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
        <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mb-4 ring-8 ring-slate-100/50">
          <FiSearch className="text-3xl" />
        </div>
        <h4 className="text-lg font-bold text-slate-800">
          No matching notes found
        </h4>
        <p className="text-xs sm:text-sm text-slate-400 mt-1.5 leading-relaxed">
          We couldn't find anything matching{" "}
          <span className="font-semibold text-slate-700">
            "{searchQuery}"
          </span>
          . Try searching for different keywords or tags.
        </p>

        {onClearSearch && (
          <button
            onClick={onClearSearch}
            className="mt-6 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition-all"
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
      <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-blue-500 to-indigo-600 text-white flex items-center justify-center mx-auto mb-4 ring-8 ring-blue-50">
        <FiFileText className="text-3xl" />
      </div>

      <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
        Your canvas is blank
      </h3>
      <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-md mx-auto leading-relaxed">
        Capture thoughts, organize your day, or draft brilliant ideas. Start typing your first note or pick a starter template below!
      </p>

      {/* Main Action */}
      <div className="mt-6 flex justify-center">
        <button
          onClick={onOpenAddModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm rounded-xl transition-all"
        >
          <FiPlus className="text-lg" />
          <span>Create First Note</span>
        </button>
      </div>

      {/* Interactive Starter Templates */}
      <div className="mt-12 text-left">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Quick Starter Templates
          </span>
          <span className="text-[11px] text-slate-400">
            Click to use
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {NOTE_TEMPLATES.map((tmpl, idx) => (
            <div
              key={idx}
              onClick={() => onSelectTemplate && onSelectTemplate(tmpl)}
              className="group p-4 bg-white border border-slate-200/80 hover:border-blue-400 rounded-2xl cursor-pointer hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                    {tmpl.category}
                  </span>
                  <span className="text-xs text-slate-400 transition-colors">
                    Use →
                  </span>
                </div>
                <h5 className="text-sm font-bold text-slate-800 transition-colors">
                  {tmpl.title}
                </h5>
                <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                  {tmpl.content.replace(/###/g, "").replace(/- \[ \]/g, "•")}
                </p>
              </div>

              <div className="flex gap-1 mt-3">
                {tmpl.tags.map((t, ti) => (
                  <span
                    key={ti}
                    className="text-[9px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded"
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