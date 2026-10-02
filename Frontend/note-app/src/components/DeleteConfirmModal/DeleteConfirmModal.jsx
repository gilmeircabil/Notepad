import React from "react";
import { FiAlertTriangle, FiX } from "react-icons/fi";

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, noteTitle }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-sm bg-white rounded-3xl border border-slate-200/80 p-6 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <FiX className="text-lg" />
        </button>

        {/* Warning Icon */}
        <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center mb-4 ring-8 ring-red-50/50">
          <FiAlertTriangle className="text-2xl" />
        </div>

        {/* Text */}
        <h3 className="text-lg font-bold text-slate-900">
          Delete Note?
        </h3>
        <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-slate-700">
            "{noteTitle || "this note"}"
          </span>
          ? This action cannot be undone.
        </p>

        {/* Actions */}
        <div className="flex items-center gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 px-4 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 py-2.5 px-4 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-all"
          >
            Delete Note
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
