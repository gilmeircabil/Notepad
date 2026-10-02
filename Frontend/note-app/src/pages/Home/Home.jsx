import React, { useEffect, useState, useRef, useMemo } from "react";
import Navbar from "../../components/Navbar/Navbar";
import NoteCard from "../../components/Cards/NoteCard";
import TagFilterBar from "../../components/TagFilterBar/TagFilterBar";
import AddEditNotes from "./AddEditNotes";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import Toast from "../../components/ToastMessage/Toast";
import EmptyCard from "../../components/EmptyCard/EmptyCard";
import DeleteConfirmModal from "../../components/DeleteConfirmModal/DeleteConfirmModal";
import ShortcutsModal from "../../components/ShortcutsModal/ShortcutsModal";
import SkeletonLoader from "../../components/SkeletonLoader/SkeletonLoader";
import { MdAdd, MdPushPin } from "react-icons/md";
import { FiSliders, FiArrowDown, FiArrowUp, FiCheckCircle } from "react-icons/fi";

Modal.setAppElement("#root");

const Home = () => {
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  const [showToastMsg, setShowToastMsg] = useState({
    isShown: false,
    message: "",
    type: "success",
  });

  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    note: null,
  });

  const [shortcutsModalOpen, setShortcutsModalOpen] = useState(false);
  const [allNotes, setAllNotes] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Filters & Views
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all"); // "all" | "pinned"
  const [sortBy, setSortBy] = useState("updated-desc"); // "updated-desc" | "created-desc" | "title-asc" | "title-desc"
  const [viewMode, setViewMode] = useState(() => {
    return localStorage.getItem("notepad_view_mode") || "grid";
  });

  const searchInputRef = useRef(null);
  const navigate = useNavigate();

  // Save viewMode
  const handleToggleViewMode = () => {
    const nextMode = viewMode === "grid" ? "list" : "grid";
    setViewMode(nextMode);
    localStorage.setItem("notepad_view_mode", nextMode);
  };

  const showToastMessage = (message, type = "success") => {
    setShowToastMsg({ isShown: true, message, type });
  };

  const handleCloseToast = () => {
    setShowToastMsg({ isShown: false, message: "" });
  };

  // Keyboard navigation & shortcuts
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      // Don't intercept if user is typing in an input/textarea
      const tag = e.target.tagName.toLowerCase();
      const isInput = tag === "input" || tag === "textarea";

      // Ctrl/Cmd + K or "/" to search
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (searchInputRef.current) searchInputRef.current.focus();
      } else if (e.key === "/" && !isInput) {
        e.preventDefault();
        if (searchInputRef.current) searchInputRef.current.focus();
      }

      // Ctrl + N to create new note
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "n" && !isInput) {
        e.preventDefault();
        setOpenAddEditModal({ isShown: true, type: "add", data: null });
      }

      // Ctrl + / or ? to open shortcuts
      if ((e.ctrlKey || e.metaKey) && e.key === "/" && !isInput) {
        e.preventDefault();
        setShortcutsModalOpen(true);
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, []);

  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user");
      if (response.data && response.data.user) {
        setUserInfo(response.data.user);
        localStorage.setItem("userInfo", JSON.stringify(response.data.user));
      }
    } catch (error) {
      localStorage.removeItem("userInfo");
      navigate("/login");
    }
  };

  const getAllNotes = async () => {
    try {
      const response = await axiosInstance.get("/get-all-notes");
      if (response.data && response.data.notes) {
        setAllNotes(response.data.notes);
      }
    } catch (error) {
      console.error("Error fetching notes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Edit Note
  const handleEdit = (noteDetails) => {
    setOpenAddEditModal({ isShown: true, data: noteDetails, type: "edit" });
  };

  // Prompt confirmation before deleting
  const promptDeleteNote = (note) => {
    setDeleteModal({ isOpen: true, note });
  };

  const confirmDeleteNote = async () => {
    if (!deleteModal.note) return;
    const noteId = deleteModal.note._id;
    try {
      const response = await axiosInstance.delete("/delete-note/" + noteId);
      if (response.data && !response.data.error) {
        showToastMessage("Note Deleted Successfully", "delete");
        setDeleteModal({ isOpen: false, note: null });
        getAllNotes();
      }
    } catch (error) {
      showToastMessage("Failed to delete note", "error");
    }
  };

  // Live Search Note
  const onSearchNote = (query) => {
    setSearchQuery(query);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  // Pin / Unpin Note
  const updateIsPinned = async (note) => {
    try {
      await axiosInstance.put("/update-note-pinned/" + note._id, {
        isPinned: !note.isPinned,
      });
      // Optimistic update
      setAllNotes((prev) =>
        prev.map((n) => (n._id === note._id ? { ...n, isPinned: !n.isPinned } : n))
      );
      showToastMessage(
        !note.isPinned ? "Note Pinned to top" : "Note Unpinned",
        "info"
      );
    } catch (error) {
      console.error("Pin error:", error);
      getAllNotes();
    }
  };

  // Change color directly from card
  const handleChangeColor = async (note, newColor) => {
    try {
      // Optimistic update
      setAllNotes((prev) =>
        prev.map((n) => (n._id === note._id ? { ...n, color: newColor } : n))
      );
      await axiosInstance.put("/edit-note/" + note._id, { color: newColor });
    } catch (error) {
      console.error("Color change error:", error);
      getAllNotes();
    }
  };

  // Duplicate Note
  const handleDuplicate = async (note) => {
    try {
      const response = await axiosInstance.post("/duplicate-note/" + note._id);
      if (response.data?.note) {
        showToastMessage("Note Duplicated", "add");
        getAllNotes();
      } else {
        // Fallback: create through add-note
        await axiosInstance.post("/add-note", {
          title: `${note.title} (Copy)`,
          content: note.content,
          tags: note.tags,
          color: note.color,
          isPinned: false,
        });
        showToastMessage("Note Duplicated", "add");
        getAllNotes();
      }
    } catch (error) {
      showToastMessage("Could not duplicate note", "error");
    }
  };

  // Use starter template
  const handleSelectTemplate = (template) => {
    setOpenAddEditModal({
      isShown: true,
      type: "add",
      data: {
        title: template.title,
        content: template.content,
        tags: template.tags,
        color: template.color,
      },
    });
  };

  useEffect(() => {
    getAllNotes();
    getUserInfo();
  }, []);

  // Compute all distinct tags with counts
  const distinctTags = useMemo(() => {
    const map = new Map();
    allNotes.forEach((n) => {
      (n.tags || []).forEach((t) => {
        const clean = t.trim();
        if (clean) {
          map.set(clean, (map.get(clean) || 0) + 1);
        }
      });
    });
    return Array.from(map.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [allNotes]);

  // Filtered & Sorted notes
  const processedNotes = useMemo(() => {
    let result = [...allNotes];

    // Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (n) =>
          n.title?.toLowerCase().includes(q) ||
          n.content?.toLowerCase().includes(q) ||
          (n.tags || []).some((t) => t.toLowerCase().includes(q))
      );
    }

    // Filter by Tag
    if (selectedTag) {
      result = result.filter((n) => (n.tags || []).includes(selectedTag));
    }

    // Filter by Active Filter (Pinned)
    if (activeFilter === "pinned") {
      result = result.filter((n) => n.isPinned);
    }

    // Sort order
    result.sort((a, b) => {
      if (sortBy === "created-desc") {
        return new Date(b.createdOn || 0) - new Date(a.createdOn || 0);
      }
      if (sortBy === "created-asc") {
        return new Date(a.createdOn || 0) - new Date(b.createdOn || 0);
      }
      if (sortBy === "title-asc") {
        return (a.title || "").localeCompare(b.title || "");
      }
      if (sortBy === "title-desc") {
        return (b.title || "").localeCompare(a.title || "");
      }
      // default: updated-desc
      return (
        new Date(b.updatedOn || b.createdOn || 0) -
        new Date(a.updatedOn || a.createdOn || 0)
      );
    });

    return result;
  }, [allNotes, searchQuery, selectedTag, activeFilter, sortBy]);

  // Separate pinned and unpinned notes when viewing "all" and not in a specific sub-filter
  const { pinnedNotes, otherNotes } = useMemo(() => {
    if (activeFilter === "pinned" || selectedTag || searchQuery.trim()) {
      return { pinnedNotes: [], otherNotes: processedNotes };
    }
    const pinned = processedNotes.filter((n) => n.isPinned);
    const others = processedNotes.filter((n) => !n.isPinned);
    return { pinnedNotes: pinned, otherNotes: others };
  }, [processedNotes, activeFilter, selectedTag, searchQuery]);

  const totalPinnedCount = useMemo(
    () => allNotes.filter((n) => n.isPinned).length,
    [allNotes]
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 transition-colors">
      {/* Top Navbar */}
      <Navbar
        userInfo={userInfo}
        onSearchNote={onSearchNote}
        handleClearSearch={handleClearSearch}
        viewMode={viewMode}
        onToggleViewMode={handleToggleViewMode}
        notesCount={allNotes.length}
        onOpenShortcuts={() => setShortcutsModalOpen(true)}
        searchInputRef={searchInputRef}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-28">
        {/* Sub-header: Tag bar & Sort controls */}
        {allNotes.length > 0 && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            {/* Tag / Filter chips */}
            <div className="flex-1 min-w-0">
              <TagFilterBar
                allTags={distinctTags}
                selectedTag={selectedTag}
                onSelectTag={setSelectedTag}
                activeFilter={activeFilter}
                onSelectFilter={setActiveFilter}
                totalNotesCount={allNotes.length}
                pinnedCount={totalPinnedCount}
              />
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
              <label className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                <FiSliders className="text-xs" />
                <span>Sort:</span>
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-xs font-medium bg-white text-slate-700 border border-slate-200/80 rounded-xl px-2.5 py-1.5 outline-none focus:border-blue-500 transition-colors cursor-pointer"
              >
                <option value="updated-desc">Recently Updated</option>
                <option value="created-desc">Newest First</option>
                <option value="created-asc">Oldest First</option>
                <option value="title-asc">Title (A - Z)</option>
                <option value="title-desc">Title (Z - A)</option>
              </select>
            </div>
          </div>
        )}

        {/* Content Section */}
        {isLoading ? (
          <SkeletonLoader count={6} viewMode={viewMode} />
        ) : processedNotes.length > 0 ? (
          <div className="space-y-8 animate-fade-in">
            {/* PINNED NOTES SECTION */}
            {pinnedNotes.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-3 select-none">
                  <MdPushPin className="text-amber-500 text-base" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    PINNED ({pinnedNotes.length})
                  </h3>
                </div>

                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                      : "flex flex-col gap-3"
                  }
                >
                  {pinnedNotes.map((item) => (
                    <NoteCard
                      key={item._id}
                      note={item}
                      viewMode={viewMode}
                      searchQuery={searchQuery}
                      onEdit={() => handleEdit(item)}
                      onDelete={() => promptDeleteNote(item)}
                      onPinNote={() => updateIsPinned(item)}
                      onDuplicate={() => handleDuplicate(item)}
                      onChangeColor={(c) => handleChangeColor(item, c)}
                      onTagClick={(t) => setSelectedTag(t)}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* OTHER / ALL NOTES SECTION */}
            {otherNotes.length > 0 && (
              <section>
                {pinnedNotes.length > 0 && (
                  <div className="flex items-center gap-2 mb-3 select-none">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      OTHER NOTES ({otherNotes.length})
                    </h3>
                  </div>
                )}

                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                      : "flex flex-col gap-3"
                  }
                >
                  {otherNotes.map((item) => (
                    <NoteCard
                      key={item._id}
                      note={item}
                      viewMode={viewMode}
                      searchQuery={searchQuery}
                      onEdit={() => handleEdit(item)}
                      onDelete={() => promptDeleteNote(item)}
                      onPinNote={() => updateIsPinned(item)}
                      onDuplicate={() => handleDuplicate(item)}
                      onChangeColor={(c) => handleChangeColor(item, c)}
                      onTagClick={(t) => setSelectedTag(t)}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        ) : (
          /* EMPTY STATE */
          <EmptyCard
            isSearch={Boolean(searchQuery.trim() || selectedTag)}
            searchQuery={searchQuery || selectedTag}
            onClearSearch={() => {
              setSearchQuery("");
              setSelectedTag(null);
              setActiveFilter("all");
            }}
            onOpenAddModal={() =>
              setOpenAddEditModal({ isShown: true, type: "add", data: null })
            }
            onSelectTemplate={handleSelectTemplate}
          />
        )}
      </main>

      {/* Floating Action Button (FAB) */}
      <button
        onClick={() => {
          setOpenAddEditModal({ isShown: true, type: "add", data: null });
        }}
        className="fixed bottom-6 right-6 md:bottom-8 md:right-8 w-14 h-14 md:w-16 md:h-16 bg-gradient-to-tr from-blue-600 to-indigo-600 text-white rounded-2xl flex items-center justify-center hover: transition-all z-40 group"
        aria-label="Create note (Ctrl + N)"
        title="Create new note (Ctrl + N)"
      >
        <MdAdd className="text-3xl sm:text-4xl transition-transform duration-300" />
      </button>

      {/* Add / Edit Note Modal */}
      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={() => {
          setOpenAddEditModal({ isShown: false, type: "add", data: null });
        }}
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            backdropFilter: "blur(6px)",
            zIndex: 1000,
          },
        }}
        className="w-[94%] sm:w-[85%] md:w-[70%] lg:w-[48%] max-h-[92vh] bg-white rounded-3xl mx-auto mt-[4vh] p-6 sm:p-7 border border-slate-200/80 overflow-y-auto outline-none animate-fade-in"
      >
        <AddEditNotes
          type={openAddEditModal.type}
          noteData={openAddEditModal.data}
          onClose={() => {
            setOpenAddEditModal({ isShown: false, type: "add", data: null });
          }}
          getAllNotes={getAllNotes}
          showToastMessage={showToastMessage}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        noteTitle={deleteModal.note?.title}
        onClose={() => setDeleteModal({ isOpen: false, note: null })}
        onConfirm={confirmDeleteNote}
      />

      {/* Keyboard Shortcuts Modal */}
      <ShortcutsModal
        isOpen={shortcutsModalOpen}
        onClose={() => setShortcutsModalOpen(false)}
      />

      {/* Notification Toast */}
      <Toast
        isShown={showToastMsg.isShown}
        message={showToastMsg.message}
        type={showToastMsg.type}
        onClose={handleCloseToast}
      />
    </div>
  );
};

export default Home;