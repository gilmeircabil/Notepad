import React, { useState } from "react";
import { MdAdd, MdClose } from "react-icons/md";
import { FiHash } from "react-icons/fi";

const TagInput = ({ tags = [], setTags }) => {
  const [inputValue, setInputValue] = useState("");

  const addNewTag = () => {
    const cleanTag = inputValue.trim().replace(/^#/, "");
    if (cleanTag && !tags.includes(cleanTag)) {
      setTags([...tags, cleanTag]);
      setInputValue("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addNewTag();
    } else if (e.key === "Backspace" && !inputValue && tags.length > 0) {
      // Remove last tag when backspacing in empty input
      setTags(tags.slice(0, -1));
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div className="flex flex-col gap-2.5">
      {/* Tags Display Container */}
      {tags?.length > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-1 rounded-lg border border-blue-100 dark:border-blue-900/60 transition-all"
            >
              <FiHash className="text-[10px] opacity-70" />
              <span>{tag}</span>
              <button
                type="button"
                className="hover:text-red-500 hover:bg-blue-100/50 dark:hover:bg-blue-900/50 p-0.5 rounded-full transition-colors ml-0.5"
                onClick={() => handleRemoveTag(tag)}
                title="Remove tag"
              >
                <MdClose className="text-xs" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Input Group */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={inputValue}
            placeholder="Add a tag (press Enter or comma)..."
            className="w-full text-xs sm:text-sm bg-slate-50 dark:bg-zinc-800/80 border border-slate-200/80 dark:border-zinc-700/60 rounded-xl px-3.5 py-2 outline-none focus:bg-white dark:focus:bg-zinc-900 focus:border-blue-400 dark:focus:border-blue-500 text-slate-800 dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-500 transition-all"
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        <button
          type="button"
          onClick={addNewTag}
          className="w-9 h-9 flex justify-center items-center rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-900/60 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white transition-all active:scale-95 shrink-0"
          aria-label="Add Tag"
          title="Add tag"
        >
          <MdAdd className="text-xl" />
        </button>
      </div>
    </div>
  );
};

export default TagInput;