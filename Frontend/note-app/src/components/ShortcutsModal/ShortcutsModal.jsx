import React from "react";
import { FiCommand, FiX } from "react-icons/fi";

const ShortcutsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: "Ctrl + K / /", desc: "Focus search bar" },
    { key: "Ctrl + N", desc: "Create a new note" },
    { key: "Ctrl + Enter", desc: "Save note (in editor)" },
    { key: "Esc", desc: "Close modal or clear search" },
    { key: "Ctrl + D", desc: "Insert current date/time (in editor)" },
    { key: "Ctrl + Shift + D", desc: "Toggle Dark / Light Mode" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 dark:bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-slate-200/80 dark:border-zinc-800 p-6 overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <FiX className="text-lg" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <FiCommand className="text-xl" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Keyboard Shortcuts
            </h3>
            <p className="text-xs text-slate-400 dark:text-zinc-500">
              Work faster with quick keyboard commands
            </p>
          </div>
        </div>

        <div className="space-y-2">
          {shortcuts.map(({ key, desc }) => (
            <div
              key={key}
              className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-100 dark:border-zinc-800"
            >
              <span className="text-xs text-slate-600 dark:text-zinc-300">
                {desc}
              </span>
              <kbd className="px-2 py-1 text-[11px] font-mono font-medium text-slate-700 dark:text-zinc-200 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-lg shadow-2xs">
                {key}
              </kbd>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 py-2.5 bg-blue-600 text-white text-xs font-semibold rounded-xl hover:bg-blue-700 transition-all"
        >
          Got it
        </button>
      </div>
    </div>
  );
};

export default ShortcutsModal;
