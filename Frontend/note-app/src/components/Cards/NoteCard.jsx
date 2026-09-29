import React, { useState, useRef, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { MdPushPin } from "react-icons/md";
import { FiCopy, FiCheck, FiMoreVertical, FiLayers } from "react-icons/fi";
import { IoColorPaletteOutline } from "react-icons/io5";
import { getNoteColorConfig, NOTE_COLORS, getNoteStats } from "../../utils/Helper";
import moment from "moment";

const HighlightText = ({ text, highlight }) => {
  if (!highlight || !highlight.trim()) return <span>{text}</span>;
  const regex = new RegExp(`(${highlight.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
  const parts = String(text || "").split(regex);
  return (
    <span>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark
            key={i}
            className="bg-yellow-200 dark:bg-yellow-500/40 text-slate-900 dark:text-yellow-100 rounded px-0.5"
          >
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </span>
  );
};

const NoteCard = ({
  note,
  onEdit,
  onDelete,
  onPinNote,
  onDuplicate,
  onChangeColor,
  onTagClick,
  viewMode = "grid",
  searchQuery = "",
}) => {
  const { title, content, tags = [], isPinned, color = "default", createdOn, updatedOn } = note;
  const [copied, setCopied] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const colorPickerRef = useRef(null);

  const colorConfig = getNoteColorConfig(color);
  const { words, readTimeMin } = getNoteStats(content);

  // Close color picker on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (colorPickerRef.current && !colorPickerRef.current.contains(e.target)) {
        setShowColorPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCopy = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`${title}\n\n${content}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Render checklist or formatted lines
  const renderPreviewContent = () => {
    const lines = (content || "").split("\n").filter(Boolean);
    const hasChecklist = lines.some((l) => /^\s*-?\s*\[([ xX])\]/.test(l));

    if (hasChecklist) {
      return (
        <div className="space-y-1 my-2">
          {lines.slice(0, 4).map((line, idx) => {
            const isTask = /^\s*-?\s*\[([ xX])\]\s*(.*)/.exec(line);
            if (isTask) {
              const isChecked = isTask[1].toLowerCase() === "x";
              const taskText = isTask[2];
              return (
                <div key={idx} className="flex items-center gap-2 text-xs">
                  <span
                    className={`w-3.5 h-3.5 rounded flex items-center justify-center border text-[10px] shrink-0 ${
                      isChecked
                        ? "bg-blue-500 border-blue-500 text-white"
                        : "border-slate-300 dark:border-zinc-600 bg-white/50 dark:bg-zinc-800"
                    }`}
                  >
                    {isChecked ? "✓" : ""}
                  </span>
                  <span
                    className={`truncate ${
                      isChecked
                        ? "line-through text-slate-400 dark:text-zinc-500"
                        : "text-slate-600 dark:text-zinc-300"
                    }`}
                  >
                    <HighlightText text={taskText} highlight={searchQuery} />
                  </span>
                </div>
              );
            }
            return (
              <p key={idx} className="text-xs text-slate-600 dark:text-zinc-300 truncate">
                <HighlightText text={line} highlight={searchQuery} />
              </p>
            );
          })}
          {lines.length > 4 && (
            <p className="text-[11px] text-slate-400 dark:text-zinc-500 italic">
              +{lines.length - 4} more items...
            </p>
          )}
        </div>
      );
    }

    return (
      <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-300 leading-relaxed line-clamp-3 mb-3">
        <HighlightText text={content} highlight={searchQuery} />
      </p>
    );
  };

  // LIST VIEW LAYOUT
  if (viewMode === "list") {
    return (
      <div
        onClick={onEdit}
        className={`group relative ${colorConfig.bgClass} rounded-2xl p-4 border ${colorConfig.borderClass} ${colorConfig.hoverBorder} shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3`}
      >
        <div className="flex-1 min-w-0 pr-2">
          <div className="flex items-center gap-2 mb-1">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onPinNote();
              }}
              className={`p-1 rounded-full transition-colors ${
                isPinned
                  ? "text-amber-500 bg-amber-50 dark:bg-amber-950/50"
                  : "text-slate-300 dark:text-zinc-600 hover:text-amber-500"
              }`}
              title={isPinned ? "Unpin note" : "Pin note"}
            >
              <MdPushPin className="text-base" />
            </button>
            <h6 className="text-sm font-semibold text-slate-900 dark:text-zinc-100 truncate">
              <HighlightText text={title} highlight={searchQuery} />
            </h6>
            <span className="text-[11px] text-slate-400 dark:text-zinc-500 shrink-0">
              • {moment(updatedOn || createdOn).fromNow()}
            </span>
          </div>

          <p className="text-xs text-slate-500 dark:text-zinc-400 truncate pl-6">
            <HighlightText text={content} highlight={searchQuery} />
          </p>
        </div>

        {/* Tags and Actions */}
        <div className="flex items-center justify-between sm:justify-end gap-3 pl-6 sm:pl-0 shrink-0">
          <div className="flex flex-wrap gap-1 max-w-[200px]">
            {tags.slice(0, 2).map((item, idx) => (
              <span
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  if (onTagClick) onTagClick(item);
                }}
                className={`text-[10px] ${colorConfig.badgeBg} px-2 py-0.5 rounded-md font-medium hover:opacity-80 transition-opacity`}
              >
                #{item}
              </span>
            ))}
            {tags.length > 2 && (
              <span className="text-[10px] text-slate-400 dark:text-zinc-500 self-center">
                +{tags.length - 2}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleCopy}
              className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
              title="Copy note"
            >
              {copied ? <FiCheck className="text-emerald-500 text-sm" /> : <FiCopy className="text-sm" />}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
              title="Edit note"
            >
              <FaEdit className="text-sm" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
              title="Delete note"
            >
              <FaTrash className="text-xs" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // GRID VIEW LAYOUT (Rich Cards)
  return (
    <div
      onClick={onEdit}
      className={`group relative ${colorConfig.bgClass} rounded-2xl p-5 border ${colorConfig.borderClass} ${colorConfig.hoverBorder} shadow-xs hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex flex-col justify-between min-h-[190px]`}
    >
      <div>
        {/* Card Header */}
        <div className="flex justify-between items-start mb-2 gap-2">
          <div className="flex-1 min-w-0">
            <h6 className="text-sm sm:text-base font-bold text-slate-900 dark:text-zinc-100 leading-snug line-clamp-2">
              <HighlightText text={title} highlight={searchQuery} />
            </h6>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[11px] font-medium text-slate-400 dark:text-zinc-400">
                {moment(updatedOn || createdOn).format("MMM D, YYYY")}
              </span>
              <span className="text-[10px] text-slate-400 dark:text-zinc-400">•</span>
              <span className="text-[11px] text-slate-400 dark:text-zinc-400">
                {words} {words === 1 ? "word" : "words"}
              </span>
            </div>
          </div>

          {/* Pin Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onPinNote();
            }}
            className={`p-1.5 rounded-xl transition-all ${
              isPinned
                ? "bg-amber-100/80 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 shadow-xs"
                : "text-slate-300 dark:text-zinc-600 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-zinc-800"
            }`}
            title={isPinned ? "Unpin note" : "Pin note"}
          >
            <MdPushPin className="text-lg" />
          </button>
        </div>

        {/* Content Preview */}
        {renderPreviewContent()}
      </div>

      {/* Card Footer: Tags & Quick Action Buttons */}
      <div className="pt-3 border-t border-slate-100/80 dark:border-zinc-800/80 flex items-center justify-between gap-2 mt-auto">
        {/* Tags */}
        <div className="flex flex-wrap gap-1 max-w-[55%]">
          {tags.map((item, index) => (
            <span
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                if (onTagClick) onTagClick(item);
              }}
              className={`text-[10px] ${colorConfig.badgeBg} px-2 py-0.5 rounded-md font-medium hover:opacity-80 transition-opacity`}
            >
              #{item}
            </span>
          ))}
        </div>

        {/* Action Toolbar */}
        <div className="flex items-center gap-1 relative" ref={colorPickerRef}>
          {/* Quick Color Picker Button */}
          {onChangeColor && (
            <div className="relative">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowColorPicker(!showColorPicker);
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
                title="Change color"
              >
                <IoColorPaletteOutline className="text-base" />
              </button>

              {/* Color Dropdown */}
              {showColorPicker && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute bottom-8 right-0 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-xl rounded-2xl p-2 z-30 flex gap-1.5 animate-fade-in"
                >
                  {NOTE_COLORS.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => {
                        onChangeColor(c.id);
                        setShowColorPicker(false);
                      }}
                      className={`w-5 h-5 rounded-full ${c.dotColor} hover:scale-110 transition-transform ${
                        color === c.id ? "ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-zinc-900" : ""
                      }`}
                      title={c.name}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Copy Button */}
          <button
            type="button"
            onClick={handleCopy}
            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
            title="Copy note"
          >
            {copied ? (
              <FiCheck className="text-emerald-500 text-base" />
            ) : (
              <FiCopy className="text-base" />
            )}
          </button>

          {/* Duplicate Button */}
          {onDuplicate && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDuplicate();
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors hidden sm:block"
              title="Duplicate note"
            >
              <FiLayers className="text-base" />
            </button>
          )}

          {/* Edit Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
            title="Edit note"
          >
            <FaEdit className="text-base" />
          </button>

          {/* Delete Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
            title="Delete note"
          >
            <FaTrash className="text-sm" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteCard;