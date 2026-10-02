import React, { useRef, useEffect, useCallback } from "react";
import ProfileInfo from "../Cards/ProfileInfo";
import Searchbar from "../Searchbar/Searchbar";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { useTheme } from "../../context/ThemeContext";
import { FiSun, FiMoon, FiGrid, FiList, FiEdit3 } from "react-icons/fi";

const Navbar = ({
  userInfo,
  onSearchNote,
  handleClearSearch,
  viewMode = "grid",
  onToggleViewMode,
  notesCount = 0,
  onOpenShortcuts,
  searchInputRef,
}) => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const onLogout = async () => {
    try {
      await axiosInstance.post("/logout");
    } catch (error) {
      console.error("Logout error", error);
    } finally {
      localStorage.removeItem("userInfo");
      navigate("/login");
    }
  };

  const handleSearch = () => {
    if (onSearchNote) {
      onSearchNote(searchQuery);
    }
  };

  // Debounce search to reduce unnecessary re-renders
  const debounceTimerRef = useRef(null);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => {
      if (onSearchNote) onSearchNote(val);
    }, 200);
  };

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, []);

  const onClear = () => {
    setSearchQuery("");
    if (handleClearSearch) {
      handleClearSearch();
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/85 dark:bg-zinc-900/85 border-b border-slate-200/80 dark:border-zinc-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3 sm:gap-6">
        {/* Brand Logo */}
        <div
          onClick={() => navigate("/home")}
          className="flex items-center gap-2.5 cursor-pointer shrink-0 group select-none"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <FiEdit3 className="text-lg" />
          </div>
          <div className="flex flex-col">
            <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white leading-none">
              Note<span className="text-blue-600 dark:text-blue-400">Pad</span>
            </span>
            <span className="text-[10px] font-medium text-slate-400 dark:text-zinc-500 hidden sm:block tracking-wide">
              THOUGHTS & TASKS
            </span>
          </div>
        </div>

        {/* Center Search Bar */}
        {userInfo && (
          <div className="flex-1 max-w-md mx-auto">
            <Searchbar
              inputRef={searchInputRef}
              value={searchQuery}
              onChange={handleInputChange}
              handleSearch={handleSearch}
              onClearSearch={onClear}
            />
          </div>
        )}

        {/* Right Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {userInfo && onToggleViewMode && (
            <button
              onClick={onToggleViewMode}
              className="p-2 text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-xl transition-colors hidden sm:flex items-center justify-center"
              title={viewMode === "grid" ? "Switch to List View" : "Switch to Grid View"}
              aria-label="Toggle view mode"
            >
              {viewMode === "grid" ? (
                <FiList className="text-lg" />
              ) : (
                <FiGrid className="text-lg" />
              )}
            </button>
          )}

          {/* Theme Switcher Button */}
          <button
            onClick={toggleTheme}
            className="p-2 text-slate-500 hover:text-amber-500 dark:text-zinc-400 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-xl transition-all"
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle theme"
          >
            {isDarkMode ? (
              <FiSun className="text-lg text-amber-400 hover:rotate-45 transition-transform" />
            ) : (
              <FiMoon className="text-lg text-indigo-500 hover:-rotate-12 transition-transform" />
            )}
          </button>

          {/* User Profile */}
          {userInfo && (
            <ProfileInfo
              userInfo={userInfo}
              onLogout={onLogout}
              notesCount={notesCount}
              onOpenShortcuts={onOpenShortcuts}
            />
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;