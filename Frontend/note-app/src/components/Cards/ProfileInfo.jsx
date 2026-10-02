import React, { useState, useRef, useEffect } from "react";
import { getInitials } from "../../utils/Helper";
import { FiLogOut, FiCommand, FiUser } from "react-icons/fi";
const ProfileInfo = ({ userInfo, onLogout, notesCount = 0, onOpenShortcuts }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

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

  return (
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
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl border border-slate-200/80 p-2 z-50 animate-fade-in text-sm">
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
          </div>

          {/* Logout */}
          <div className="pt-1 border-t border-slate-100">
            <button
              onClick={() => {
                setIsOpen(false);
                onLogout();
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors"
            >
              <FiLogOut className="text-sm" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileInfo;