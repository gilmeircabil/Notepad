import React from "react";
import { Link } from "react-router-dom";
import { FiFileText, FiArrowLeft } from "react-icons/fi";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200/80 p-8 text-center animate-fade-in shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4 ring-8 ring-blue-50/50">
          <FiFileText className="text-3xl" />
        </div>

        <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
          404 Not Found
        </span>

        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-4">
          Page not found
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
          The link you followed may be broken, or the page may have been removed.
        </p>

        <div className="mt-6">
          <Link
            to="/home"
            className="inline-flex items-center justify-center gap-2 py-3 px-6 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all"
          >
            <FiArrowLeft className="text-sm" />
            <span>Return to NotePad</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
