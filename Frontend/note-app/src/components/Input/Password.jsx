import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

const Password = ({ value, onChange, placeholder = "Password", id, name }) => {
  const [isShowPassword, setIsShowPassword] = useState(false);

  return (
    <div className="relative w-full group">
      <input
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        type={isShowPassword ? "text" : "password"}
        placeholder={placeholder}
        className="w-full text-xs sm:text-sm bg-slate-50 dark:bg-zinc-800/80 border border-slate-200/80 dark:border-zinc-700/60 rounded-xl px-4 py-3 pr-11 outline-none focus:bg-white dark:focus:bg-zinc-900 focus:border-blue-500/70 dark:focus:border-blue-400/70 focus:ring-2 focus:ring-blue-500/10 text-slate-800 dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-500 transition-all"
      />

      <button
        type="button"
        onClick={() => setIsShowPassword(!isShowPassword)}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg text-slate-400 dark:text-zinc-500 hover:text-blue-600 dark:hover:text-blue-400 active:bg-slate-100 dark:active:bg-zinc-800 transition-all"
        title={isShowPassword ? "Hide password" : "Show password"}
        aria-label={isShowPassword ? "Hide password" : "Show password"}
      >
        {isShowPassword ? (
          <FaRegEyeSlash className="text-base" />
        ) : (
          <FaRegEye className="text-base" />
        )}
      </button>
    </div>
  );
};

export default Password;