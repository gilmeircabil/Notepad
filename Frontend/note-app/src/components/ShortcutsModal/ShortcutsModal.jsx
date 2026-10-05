import React from "react";
import { FiCommand, FiX } from "react-icons/fi";

const ShortcutsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: "Ctrl + K / /", desc: "Focus search bar" },
    { key: "Alt + N", desc: "Create a new note" },
    { key: "Ctrl + Enter", desc: "Save note (in editor)" },
    { key: "Ctrl + D", desc: "Insert timestamp (in editor)" },
    { key: "Esc", desc: "Close modal or clear search" },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="shortcuts-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm animate-fade-in"
    >
      <div className="relative w-full max-w-md bg-white rounded-3xl border border-slate-200/80 p-6 overflow-hidden shadow-xl">
        <button
          onClick={onClose}
          aria-label="Close keyboard shortcuts"
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <FiX className="text-lg" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <FiCommand className="text-xl" />
          </div>
          <div>
            <h3 id="shortcuts-modal-title" className="text-base font-bold text-slate-900">
              Keyboard Shortcuts
            </h3>
            <p className="text-xs text-slate-400">
              Work faster with quick keyboard commands
            </p>
          </div>
        </div>

        <div className="space-y-2">
          {shortcuts.map(({ key, desc }) => (
            <div
              key={key}
              className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100"
            >
              <span className="text-xs text-slate-600">
                {desc}
              </span>
              <kbd className="px-2 py-1 text-[11px] font-mono font-medium text-slate-700 bg-white border border-slate-200 rounded-lg">
                {key}
              </kbd>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 py-2.5 bg-blue-600 text-white text-xs font-semibold rounded-xl hover:bg-blue-700 transition-all cursor-pointer"
        >
          Got it
        </button>
      </div>
    </div>
  );
};

export default ShortcutsModal;
