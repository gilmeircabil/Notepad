import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

const Password = ({
  value,
  onChange,
  placeholder = "Password",
  id = "password",
  name = "password",
  autoComplete = "current-password",
  ariaLabel = "Password",
}) => {
  const [isShowPassword, setIsShowPassword] = useState(false);

  return (
    <div className="relative w-full group">
      <input
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        aria-label={ariaLabel}
        type={isShowPassword ? "text" : "password"}
        placeholder={placeholder}
        className="w-full text-xs sm:text-sm bg-slate-50/70 border border-slate-200/70 rounded-xl px-4 py-3 pr-11 outline-none focus:bg-white focus:border-blue-500/50 focus:ring-3 focus:ring-blue-500/10 text-slate-800 placeholder:text-slate-400 transition-all"
      />

      <button
        type="button"
        onClick={() => setIsShowPassword(!isShowPassword)}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-black/5 transition-colors cursor-pointer"
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