import React from "react";

const SkeletonLoader = ({ count = 6, viewMode = "grid" }) => {
  return (
    <div
      className={
        viewMode === "grid"
          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6"
          : "flex flex-col gap-3 mt-6"
      }
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white dark:bg-zinc-900 rounded-2xl p-5 border border-slate-200/60 dark:border-zinc-800 shadow-sm animate-pulse flex flex-col justify-between min-h-[160px]"
        >
          <div>
            <div className="flex justify-between items-start mb-3">
              <div className="w-2/3 h-5 bg-slate-200 dark:bg-zinc-800 rounded-md" />
              <div className="w-6 h-6 bg-slate-200 dark:bg-zinc-800 rounded-full" />
            </div>
            <div className="w-1/4 h-3 bg-slate-100 dark:bg-zinc-800/60 rounded-md mb-4" />
            <div className="space-y-2">
              <div className="w-full h-3 bg-slate-100 dark:bg-zinc-800/80 rounded-md" />
              <div className="w-5/6 h-3 bg-slate-100 dark:bg-zinc-800/80 rounded-md" />
            </div>
          </div>

          <div className="flex justify-between items-center mt-6 pt-2">
            <div className="flex gap-1.5">
              <div className="w-12 h-5 bg-slate-100 dark:bg-zinc-800 rounded-md" />
              <div className="w-10 h-5 bg-slate-100 dark:bg-zinc-800 rounded-md" />
            </div>
            <div className="flex gap-2">
              <div className="w-6 h-6 bg-slate-100 dark:bg-zinc-800 rounded-md" />
              <div className="w-6 h-6 bg-slate-100 dark:bg-zinc-800 rounded-md" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SkeletonLoader;
