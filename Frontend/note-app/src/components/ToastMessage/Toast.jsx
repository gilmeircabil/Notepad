import React, { useEffect } from "react";
import { LuCheck } from "react-icons/lu";
import { MdDeleteOutline, MdErrorOutline } from "react-icons/md";
import { FiInfo, FiX } from "react-icons/fi";

const Toast = ({ isShown, message, type = "success", onClose }) => {
  useEffect(() => {
    if (!isShown) return;
    const timeoutId = setTimeout(() => {
      onClose();
    }, 3200);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [isShown, onClose]);

  if (!isShown) return null;

  const getThemeConfig = () => {
    switch (type) {
      case "delete":
        return {
          barColor: "bg-rose-500",
          iconBg: "bg-rose-50",
          iconColor: "text-rose-600",
          label: "Deleted",
          Icon: MdDeleteOutline,
        };
      case "error":
        return {
          barColor: "bg-rose-500",
          iconBg: "bg-rose-50",
          iconColor: "text-rose-600",
          label: "Error",
          Icon: MdErrorOutline,
        };
      case "info":
        return {
          barColor: "bg-blue-500",
          iconBg: "bg-blue-50",
          iconColor: "text-blue-600",
          label: "Notice",
          Icon: FiInfo,
        };
      default:
        return {
          barColor: "bg-emerald-500",
          iconBg: "bg-emerald-50",
          iconColor: "text-emerald-600",
          label: "Success",
          Icon: LuCheck,
        };
    }
  };

  const { barColor, iconBg, iconColor, label, Icon } = getThemeConfig();

  return (
    <div className="fixed top-20 right-4 sm:right-8 z-[100] animate-fade-in max-w-sm w-full">
      <div className="relative bg-white border border-slate-200/70 rounded-2xl overflow-hidden flex items-center justify-between p-3.5 gap-3 shadow-xl shadow-slate-900/5">
        {/* Accent Bar */}
        <div className={`absolute left-0 top-0 h-full w-1.5 ${barColor}`} />

        <div className="flex items-center gap-3 pl-2 flex-1 min-w-0">
          <div
            className={`w-9 h-9 flex items-center justify-center rounded-xl ${iconBg} ${iconColor} shrink-0`}
          >
            <Icon className="text-lg" />
          </div>

          <div className="flex flex-col flex-1 min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 select-none">
              {label}
            </span>
            <p className="text-xs font-semibold text-slate-800 truncate">
              {message}
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          aria-label="Close notification"
          className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-black/5 transition-colors cursor-pointer"
        >
          <FiX className="text-sm" />
        </button>
      </div>
    </div>
  );
};

export default Toast;