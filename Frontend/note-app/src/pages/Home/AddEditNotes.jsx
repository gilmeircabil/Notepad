import React, { useState, useRef, useEffect } from "react";
import TagInput from "../../components/Input/TagInput";
import { MdClose, MdPushPin } from "react-icons/md";
import { FiCheckSquare, FiList, FiType, FiCalendar } from "react-icons/fi";
import axiosInstance from "../../utils/axiosInstance";
import { NOTE_COLORS, getNoteStats } from "../../utils/Helper";

const AddEditNotes = ({
  noteData,
  type,
  getAllNotes,
  onClose,
  showToastMessage,
}) => {
  const [title, setTitle] = useState(noteData?.title || "");
  const [content, setContent] = useState(noteData?.content || "");
  const [tags, setTags] = useState(noteData?.tags || []);
  const [color, setColor] = useState(noteData?.color || "default");
  const [isPinned, setIsPinned] = useState(noteData?.isPinned || false);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const titleInputRef = useRef(null);
  const textareaRef = useRef(null);
  const handleSaveRef = useRef();
  const handleInsertRef = useRef();
  const handleCloseRef = useRef();

  // Autofocus title on mount
  useEffect(() => {
    if (titleInputRef.current && !noteData?.title) {
      titleInputRef.current.focus();
    }
  }, [noteData]);

  // Keyboard shortcut: Ctrl/Cmd + Enter to save, Esc to close, Ctrl+D for timestamp
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        handleSaveRef.current?.();
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "d") {
        e.preventDefault();
        handleInsertRef.current?.(`\n[${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}] `);
      }
      if (e.key === "Escape") {
        handleCloseRef.current?.();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const { words, chars } = getNoteStats(content);

  // Insert formatting snippet at textarea cursor position
  const insertSnippet = (snippet) => {
    if (!textareaRef.current) return;
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const before = content.substring(0, start);
    const after = content.substring(end);
    const newContent = `${before}${snippet}${after}`;
    setContent(newContent);

    // Reposition cursor
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + snippet.length, start + snippet.length);
    }, 0);
  };

  const addNewNote = async () => {
    setIsSubmitting(true);
    try {
      const response = await axiosInstance.post("/add-note", {
        title: title.trim(),
        content: content.trim(),
        tags,
        color,
        isPinned,
      });
      if (response.data) {
        showToastMessage("Note Added Successfully", "add");
        getAllNotes();
        onClose();
      }
    } catch (err) {
      setError(err.response?.data?.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const editNote = async () => {
    setIsSubmitting(true);
    const noteId = noteData._id;
    try {
      const response = await axiosInstance.put("/edit-note/" + noteId, {
        title: title.trim(),
        content: content.trim(),
        tags,
        color,
        isPinned,
      });
      if (response.data) {
        showToastMessage("Note Updated Successfully", "add");
        getAllNotes();
        onClose();
      }
    } catch (err) {
      setError(err.response?.data?.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = () => {
    if (!title.trim()) {
      setError("Please enter a title for your note");
      if (titleInputRef.current) titleInputRef.current.focus();
      return;
    }
    if (!content.trim()) {
      setError("Please enter some content for your note");
      if (textareaRef.current) textareaRef.current.focus();
      return;
    }
    setError(null);
    if (type === "edit") {
      editNote();
    } else {
      addNewNote();
    }
  };

  handleSaveRef.current = handleSubmit;
  handleInsertRef.current = insertSnippet;
  handleCloseRef.current = onClose;

  return (
    <div className="flex flex-col h-full text-slate-800">
      {/* Modal Header */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <h2 className="text-base sm:text-lg font-bold text-slate-900">
            {type === "edit" ? "Edit Note" : "Create New Note"}
          </h2>

          {/* Pin toggle right inside header */}
          <button
            type="button"
            onClick={() => setIsPinned(!isPinned)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-semibold transition-all ${
              isPinned
                ? "bg-amber-100 text-amber-700"
                : "bg-slate-100 text-slate-500 hover:text-amber-600"
            }`}
            title={isPinned ? "Note will be pinned" : "Pin this note"}
          >
            <MdPushPin className="text-sm" />
            <span>{isPinned ? "Pinned" : "Pin Note"}</span>
          </button>
        </div>

        <button
          className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          onClick={onClose}
          title="Close (Esc)"
        >
          <MdClose className="text-xl" />
        </button>
      </div>

      {/* Color Palette Selector */}
      <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mr-1">
          Color:
        </span>
        {NOTE_COLORS.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setColor(c.id)}
            className={`w-6 h-6 rounded-full ${c.dotColor} transition-transform flex items-center justify-center ${
              color === c.id
                ? "ring-2 ring-blue-500 ring-offset-2 scale-110"
                : "opacity-80"
            }`}
            title={c.name}
          />
        ))}
      </div>

      {/* Main Form Fields */}
      <div className="space-y-4 flex-1">
        {/* Title Input */}
        <div>
          <input
            ref={titleInputRef}
            type="text"
            aria-label="Note Title"
            placeholder="Note Title..."
            className="w-full text-lg sm:text-xl font-bold text-slate-900 placeholder:text-slate-400 outline-none bg-slate-50 px-4 py-3 rounded-2xl border border-slate-200/80 focus:bg-white focus:border-blue-500 transition-all"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>

        {/* Formatting Shortcuts Toolbar */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100/80 rounded-xl border border-slate-200/60 overflow-x-auto">
          <button
            type="button"
            onClick={() => insertSnippet("\n- [ ] ")}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-white rounded-lg transition-colors shrink-0"
            title="Insert checklist task"
          >
            <FiCheckSquare className="text-sm text-blue-500" />
            <span>Checklist</span>
          </button>
          <button
            type="button"
            onClick={() => insertSnippet("\n• ")}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-white rounded-lg transition-colors shrink-0"
            title="Insert bullet point"
          >
            <FiList className="text-sm text-emerald-500" />
            <span>Bullet</span>
          </button>
          <button
            type="button"
            onClick={() => insertSnippet("\n### ")}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-white rounded-lg transition-colors shrink-0"
            title="Insert section header"
          >
            <FiType className="text-sm text-purple-500" />
            <span>Heading</span>
          </button>
          <button
            type="button"
            onClick={() => insertSnippet(`\n[${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}] `)}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-white rounded-lg transition-colors shrink-0"
            title="Insert timestamp"
          >
            <FiCalendar className="text-sm text-amber-500" />
            <span>Timestamp</span>
          </button>
        </div>

        {/* Content Textarea */}
        <div>
          <textarea
            ref={textareaRef}
            rows={8}
            placeholder="Jot down notes, capture links, or brainstorm ideas..."
            className="w-full text-xs sm:text-sm text-slate-700 placeholder:text-slate-400 leading-relaxed outline-none bg-slate-50 p-4 rounded-2xl border border-slate-200/80 focus:bg-white focus:border-blue-500 transition-all resize-none"
            value={content}
            onChange={({ target }) => setContent(target.value)}
          />
        </div>

        {/* Tags Section */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 ml-1">
            Tags & Labels
          </label>
          <TagInput tags={tags} setTags={setTags} />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-3 p-2.5 rounded-xl bg-red-50 border border-red-200">
          <p className="text-red-600 text-xs font-medium text-center">
            {error}
          </p>
        </div>
      )}

      {/* Footer: Word count & Actions */}
      <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-3">
        <span className="text-[11px] text-slate-400 font-mono">
          {words} words • {chars} characters
        </span>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleSubmit}
            className="flex items-center gap-1.5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold text-xs rounded-xl transition-all"
          >
            <span>{type === "edit" ? "Update Note" : "Save Note"}</span>
            <span className="hidden sm:inline-block text-[10px] bg-blue-700/60 px-1.5 py-0.5 rounded ml-1">
              Ctrl+Enter
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddEditNotes;