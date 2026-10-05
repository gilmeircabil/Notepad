import React from "react";
import { FiCommand, FiX } from "react-icons/fi";

const ShortcutsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const isMac =
    typeof navigator !== "undefined" &&
    /Mac|iPhone|iPod|iPad/.test(navigator.platform || navigator.userAgent);

  const modKey = isMac ? "⌘" : "Ctrl";

  const shortcuts = [
    { key: `${modKey} + K / /`, desc: "Focus search bar" },
    { key: "Alt + N", desc: "Create a new note" },
    { key: `${modKey} + Enter`, desc: "Save note (in editor)" },
    { key: `${modKey} + D`, desc: "Insert timestamp (in editor)" },
    { key: "Esc", desc: "Close modal or clear search" },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="shortcuts-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm animate-fade-in"
    >
      <div className="relative w-full max-w-md bg-white rounded-3xl border border-slate-200/70 p-6 sm:p-7 overflow-hidden shadow-2xl shadow-slate-950/10">
        <button
          onClick={onClose}
          aria-label="Close keyboard shortcuts"
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-black/5 transition-colors cursor-pointer"
        >
          <FiX className="text-lg" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-sm">
            <FiCommand className="text-xl" />
          </div>
          <div>
            <h3 id="shortcuts-modal-title" className="text-base font-bold text-slate-900 tracking-tight">
              Keyboard Shortcuts
            </h3>
            <p className="text-xs text-slate-400">
              Navigate and manage notes with lightning speed
            </p>
          </div>
        </div>

        <div className="space-y-2">
          {shortcuts.map(({ key, desc }) => (
            <div
              key={key}
              className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50/80 border border-slate-100"
            >
              <span className="text-xs text-slate-600 font-medium">
                {desc}
              </span>
              <kbd className="px-2.5 py-1 text-[11px] font-mono font-medium text-slate-700 bg-white border border-slate-200/80 rounded-lg shadow-[0_1px_1px_rgba(0,0,0,0.04)] select-none">
                {key}
              </kbd>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 py-2.5 bg-blue-600 text-white text-xs font-semibold rounded-xl hover:bg-blue-700 shadow-sm active:translate-y-0.5 transition-colors cursor-pointer"
        >
          Got it
        </button>
      </div>
    </div>
  );
};

export default ShortcutsModal;
