import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getInitials } from "../../utils/Helper";
import { FiLogOut, FiCommand, FiTrash2, FiShield, FiFileText, FiAlertTriangle, FiX } from "react-icons/fi";
import axiosInstance from "../../utils/axiosInstance";

const ProfileInfo = ({ userInfo, onLogout, notesCount = 0, onOpenShortcuts }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!userInfo) return null;

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    setDeleteError("");
    try {
      await axiosInstance.delete("/delete-account");
      localStorage.removeItem("userInfo");
      setShowDeleteModal(false);
      navigate("/login");
    } catch (err) {
      setDeleteError(err.response?.data?.message || "Failed to delete account. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2.5 p-1 rounded-full hover:bg-slate-100 transition-all focus:outline-none"
          aria-label="User menu"
        >
          <div className="relative">
            <div className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-full text-white font-semibold text-xs md:text-sm bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-500 ring-2 ring-white">
              {getInitials(userInfo.fullName)}
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
          </div>

          <div className="hidden md:flex flex-col text-left">
            <p className="text-xs font-semibold text-slate-800 leading-none">
              {userInfo.fullName}
            </p>
            <span className="text-[10px] text-slate-400 mt-1 truncate max-w-[120px]">
              {userInfo.email}
            </span>
          </div>
        </button>

        {/* Modern Popover Dropdown Menu */}
        {isOpen && (
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl border border-slate-200/80 p-2 z-50 animate-fade-in text-sm shadow-lg">
            {/* User Header */}
            <div className="px-3 py-2.5 border-b border-slate-100">
              <p className="font-semibold text-slate-800 leading-tight">
                {userInfo.fullName}
              </p>
              <p className="text-xs text-slate-400 truncate mt-0.5">
                {userInfo.email}
              </p>
              <div className="mt-2 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-50 text-blue-700 border border-blue-100">
                {notesCount} {notesCount === 1 ? "Note" : "Notes"} saved
              </div>
            </div>

            {/* Quick Actions */}
            <div className="py-1">
              {onOpenShortcuts && (
                <button
                  onClick={() => {
                    onOpenShortcuts();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 rounded-xl transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <FiCommand className="text-slate-400 text-sm" />
                    Keyboard Shortcuts
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-500">
                    Ctrl + /
                  </span>
                </button>
              )}

              <Link
                to="/privacy"
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 rounded-xl transition-colors"
              >
                <FiShield className="text-slate-400 text-sm" />
                Privacy Policy
              </Link>

              <Link
                to="/terms"
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 rounded-xl transition-colors"
              >
                <FiFileText className="text-slate-400 text-sm" />
                Terms of Service
              </Link>
            </div>

            {/* Account Management & Logout */}
            <div className="pt-1 border-t border-slate-100 space-y-0.5">
              <button
                onClick={() => {
                  setIsOpen(false);
                  onLogout();
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-xl transition-colors"
              >
                <FiLogOut className="text-sm text-slate-500" />
                Sign Out
              </button>

              <button
                onClick={() => {
                  setIsOpen(false);
                  setShowDeleteModal(true);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors"
              >
                <FiTrash2 className="text-sm" />
                Delete Account
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Account Confirmation Modal (GDPR / Privacy Compliance) */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-sm bg-white rounded-3xl border border-slate-200/80 p-6 overflow-hidden shadow-xl">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <FiX className="text-lg" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-4 ring-8 ring-red-50/50">
              <FiAlertTriangle className="text-2xl" />
            </div>

            <h3 className="text-lg font-bold text-slate-900">
              Delete Account?
            </h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              This will permanently delete your account, login credentials, and all{" "}
              <strong className="text-slate-700">{notesCount} saved notes</strong>. This action is immediate and cannot be undone.
            </p>

            {deleteError && (
              <div className="mt-3 p-2.5 rounded-xl bg-red-50 border border-red-200">
                <p className="text-red-600 text-xs text-center">{deleteError}</p>
              </div>
            )}

            <div className="flex items-center gap-2.5 mt-6">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-2.5 px-4 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDeleteAccount}
                className="flex-1 py-2.5 px-4 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 disabled:opacity-60 rounded-xl transition-all"
              >
                {isDeleting ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileInfo;