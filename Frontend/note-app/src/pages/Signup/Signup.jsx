import React, { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import { Link, useNavigate } from "react-router-dom";
import Password from "../../components/Input/Password";
import { validateEmail } from "../../utils/Helper";
import axiosInstance from "../../utils/axiosInstance";
import { FiArrowRight, FiUserCheck, FiShield } from "react-icons/fi";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  // Password strength calculation
  const getPasswordStrength = (pwd) => {
    if (!pwd) return { score: 0, text: "", color: "" };
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    if (score <= 1) return { score: 1, text: "Weak", color: "bg-red-500 text-red-500" };
    if (score === 2) return { score: 2, text: "Fair", color: "bg-amber-500 text-amber-500" };
    if (score === 3) return { score: 3, text: "Good", color: "bg-blue-500 text-blue-500" };
    return { score: 4, text: "Strong", color: "bg-emerald-500 text-emerald-500" };
  };

  const strength = getPasswordStrength(password);

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("Please enter your full name");
      return;
    }
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
      const response = await axiosInstance.post("/create-account", {
        fullName: name.trim(),
        email: email.trim().toLowerCase(),
        password,
      });

      if (response.data?.user) {
        localStorage.setItem("userInfo", JSON.stringify(response.data.user));
      }

      navigate("/home");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-800 dark:text-zinc-100 transition-colors flex flex-col">
      <Navbar />

      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 py-10 sm:py-16 relative overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute top-1/4 right-1/2 translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-md relative z-10">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-black/60 border border-slate-200/80 dark:border-zinc-800 p-7 sm:p-10 animate-fade-in">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 mb-3 shadow-inner">
                <FiUserCheck className="text-2xl" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Create Account
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 dark:text-zinc-400 mt-1.5">
                Join to organize and protect your notes in one place
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 mb-1.5 ml-1">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Alex Rivera"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs sm:text-sm bg-slate-50 dark:bg-zinc-800/80 border border-slate-200/80 dark:border-zinc-700/60 rounded-xl px-4 py-3 outline-none focus:bg-white dark:focus:bg-zinc-900 focus:border-indigo-500 transition-all text-slate-800 dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 mb-1.5 ml-1">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="alex@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs sm:text-sm bg-slate-50 dark:bg-zinc-800/80 border border-slate-200/80 dark:border-zinc-700/60 rounded-xl px-4 py-3 outline-none focus:bg-white dark:focus:bg-zinc-900 focus:border-indigo-500 transition-all text-slate-800 dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 mb-1.5 ml-1">
                  Password
                </label>
                <Password
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                />

                {/* Password Strength Indicator */}
                {password && (
                  <div className="mt-2 space-y-1">
                    <div className="flex gap-1 h-1">
                      {[1, 2, 3, 4].map((step) => (
                        <div
                          key={step}
                          className={`flex-1 rounded-full transition-all duration-300 ${
                            strength.score >= step
                              ? strength.color.split(" ")[0]
                              : "bg-slate-200 dark:bg-zinc-800"
                          }`}
                        />
                      ))}
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-slate-400 dark:text-zinc-500 pt-0.5">
                      <span>Password strength</span>
                      <span className={`font-semibold ${strength.color.split(" ")[1]}`}>
                        {strength.text}
                      </span>
                    </div>
                  </div>
                )}
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
                    <span>Create Account</span>
                    <FiArrowRight className="text-base" />
                  </>
                )}
              </button>

              <p className="text-xs text-center text-slate-400 dark:text-zinc-500 pt-4">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Log in here
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;