import React from "react";
import { FiAlertTriangle, FiX } from "react-icons/fi";

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, noteTitle }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-sm bg-white rounded-3xl border border-slate-200/70 p-6 overflow-hidden shadow-2xl shadow-slate-950/10">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-black/5 transition-colors cursor-pointer"
        >
          <FiX className="text-lg" />
        </button>

        {/* Warning Icon */}
        <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4 ring-8 ring-rose-50/50">
          <FiAlertTriangle className="text-2xl" />
        </div>

        {/* Text */}
        <h3 className="text-lg font-bold text-slate-900 tracking-tight">
          Delete Note?
        </h3>
        <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-slate-800">
            "{noteTitle || "this note"}"
          </span>
          ? This action cannot be undone.
        </p>

        {/* Actions */}
        <div className="flex items-center gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 px-4 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 py-2.5 px-4 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 shadow-sm rounded-xl active:translate-y-0.5 transition-colors cursor-pointer"
          >
            Delete Note
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
