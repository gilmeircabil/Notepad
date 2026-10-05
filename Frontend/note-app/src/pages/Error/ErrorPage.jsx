import React from "react";
import { useRouteError, Link } from "react-router-dom";
import { FiAlertTriangle, FiHome, FiRefreshCw } from "react-icons/fi";

const ErrorPage = () => {
  const error = useRouteError();

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200/80 p-8 text-center animate-fade-in shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4 ring-8 ring-amber-50/50">
          <FiAlertTriangle className="text-3xl" />
        </div>

        <h1 className="text-xl font-bold text-slate-900">
          Something went wrong
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
          An unexpected error occurred. Don't worry, your notes are safely stored.
        </p>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-left">
            <p className="text-[11px] font-mono text-slate-600 break-words">
              {error.statusText || error.message || "Unknown Application Error"}
            </p>
          </div>
        )}

        <div className="mt-6 flex flex-col sm:flex-row gap-2.5">
          <button
            onClick={() => window.location.reload()}
            className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          >
            <FiRefreshCw className="text-sm" />
            <span>Reload Page</span>
          </button>
          <Link
            to="/home"
            className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all"
          >
            <FiHome className="text-sm" />
            <span>Go Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
