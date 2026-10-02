import React, { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import { Link, useNavigate } from "react-router-dom";
import Password from "../../components/Input/Password";
import { validateEmail } from "../../utils/Helper";
import axiosInstance from "../../utils/axiosInstance";
import { FiArrowRight, FiLock, FiMail, FiCheckCircle } from "react-icons/fi";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    if (e) e.preventDefault();

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const response = await axiosInstance.post("/login", {
        email: email.trim().toLowerCase(),
        password,
      });

      if (response.data?.user) {
        localStorage.setItem("userInfo", JSON.stringify(response.data.user));
      }

      navigate("/home");
    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Unable to connect to server. Please check your connection.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemo = async () => {
    setEmail("demo@notepad.io");
    setPassword("DemoPass123!");
    setError(null);
    setIsLoading(true);

    try {
      // First attempt to login with demo
      let response;
      try {
        response = await axiosInstance.post("/login", {
          email: "demo@notepad.io",
          password: "DemoPass123!",
        });
      } catch (loginErr) {
        // If demo user does not exist, create it automatically
        response = await axiosInstance.post("/create-account", {
          fullName: "Demo User",
          email: "demo@notepad.io",
          password: "DemoPass123!",
        });
      }

      if (response?.data?.user) {
        localStorage.setItem("userInfo", JSON.stringify(response.data.user));
      }

      navigate("/home");
    } catch (err) {
      // If server unreachable, proceed in guest offline demo mode
      localStorage.setItem(
        "userInfo",
        JSON.stringify({ fullName: "Demo Explorer", email: "demo@notepad.io" })
      );
      navigate("/home");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-800 dark:text-zinc-100 transition-colors flex flex-col">
      <Navbar />

      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 py-10 sm:py-16 relative overflow-hidden">
        {/* Ambient Glow Orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 dark:bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-500/10 dark:bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-md relative z-10">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-black/60 border border-slate-200/80 dark:border-zinc-800 p-7 sm:p-10 animate-fade-in">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 mb-3 shadow-inner">
                <FiLock className="text-2xl" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Welcome back
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 dark:text-zinc-400 mt-1.5">
                Sign in to manage and organize your personal notes
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 mb-1.5 ml-1">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-xs sm:text-sm bg-slate-50 dark:bg-zinc-800/80 border border-slate-200/80 dark:border-zinc-700/60 rounded-xl px-4 py-3 outline-none focus:bg-white dark:focus:bg-zinc-900 focus:border-blue-500 transition-all text-slate-800 dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 mb-1.5 ml-1">
                  Password
                </label>
                <Password
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50">
                  <p className="text-red-600 dark:text-red-400 text-xs font-medium text-center">
                    {error}
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.98] disabled:opacity-60 text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-blue-500/25 transition-all text-xs sm:text-sm flex items-center justify-center gap-2 mt-2"
              >
                {isLoading ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Sign In</span>
                    <FiArrowRight className="text-base" />
                  </>
                )}
              </button>

              {/* Instant Demo Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleQuickDemo}
                  className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 font-semibold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <FiCheckCircle className="text-emerald-500 text-sm" />
                  <span>Try Demo Account (One-Click)</span>
                </button>
              </div>

              <p className="text-xs text-center text-slate-400 dark:text-zinc-500 pt-4">
                Don't have an account yet?{" "}
                <Link
                  to="/signup"
                  className="font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Create one now
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
