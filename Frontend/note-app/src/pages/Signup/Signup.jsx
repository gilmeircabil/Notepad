import React, { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import { Link, useNavigate } from "react-router-dom";
import Password from "../../components/Input/Password";
import { validateEmail } from "../../utils/Helper";
import axiosInstance from "../../utils/axiosInstance";
import { FiArrowRight, FiUserCheck } from "react-icons/fi";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [website, setWebsite] = useState(""); // Anti-spam honeypot
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
        website, // Honeypot (empty for real humans, populated by bots)
      });

      if (response.data?.accessToken) {
        localStorage.setItem("token", response.data.accessToken);
      }
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
    <div className="min-h-screen bg-slate-50 text-slate-800 transition-colors flex flex-col justify-between">
      <Navbar />

      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 py-10 sm:py-16 relative overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute top-1/4 right-1/2 translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-md relative z-10">
          <div className="bg-white rounded-3xl border border-slate-200/70 p-7 sm:p-10 animate-fade-in shadow-xl shadow-slate-900/5">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 mb-3 shadow-sm">
                <FiUserCheck className="text-2xl" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                Create Account
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1.5 leading-relaxed">
                Join to organize and protect your notes in one place
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSignup} className="space-y-4">
              {/* Anti-spam Honeypot: Hidden from real humans, auto-filled by spam bots */}
              <div style={{ display: "none" }} aria-hidden="true">
                <label htmlFor="signup-website">Leave blank</label>
                <input
                  id="signup-website"
                  name="website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />
              </div>

              <div>
                <label
                  htmlFor="signup-name"
                  className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 ml-1 select-none"
                >
                  Full Name
                </label>
                <input
                  id="signup-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder="e.g. Alex Rivera"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs sm:text-sm bg-slate-50/70 border border-slate-200/70 rounded-xl px-4 py-3 outline-none focus:bg-white focus:border-blue-500/50 focus:ring-3 focus:ring-blue-500/10 transition-all text-slate-800 placeholder:text-slate-400"
                />
              </div>

              <div>
                <label
                  htmlFor="signup-email"
                  className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 ml-1 select-none"
                >
                  Email Address
                </label>
                <input
                  id="signup-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="alex@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs sm:text-sm bg-slate-50/70 border border-slate-200/70 rounded-xl px-4 py-3 outline-none focus:bg-white focus:border-blue-500/50 focus:ring-3 focus:ring-blue-500/10 transition-all text-slate-800 placeholder:text-slate-400"
                />
              </div>

              <div>
                <label
                  htmlFor="signup-password"
                  className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 ml-1 select-none"
                >
                  Password
                </label>
                <Password
                  id="signup-password"
                  name="password"
                  autoComplete="new-password"
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
                              : "bg-slate-200"
                          }`}
                        />
                      ))}
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-slate-400 pt-0.5">
                      <span>Password strength</span>
                      <span className={`font-semibold ${strength.color.split(" ")[1]}`}>
                        {strength.text}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200">
                  <p className="text-red-600 text-xs font-medium text-center">
                    {error}
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-3.5 rounded-xl shadow-sm transition-colors text-xs sm:text-sm flex items-center justify-center gap-2 mt-2 cursor-pointer active:translate-y-0.5"
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

              {/* Legal & Consent Notice (GDPR/Compliance) */}
              <p className="text-[11px] text-slate-400 text-center leading-relaxed pt-2">
                By signing up, you agree to our{" "}
                <Link to="/terms" className="text-blue-600 hover:underline">
                  Terms of Service
                </Link>{" "}
                and acknowledge our{" "}
                <Link to="/privacy" className="text-blue-600 hover:underline">
                  Privacy Policy
                </Link>.
              </p>

              <p className="text-xs text-center text-slate-400 pt-3">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-blue-600 hover:underline"
                >
                  Log in here
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>

      {/* Subtle Footer Links */}
      <footer className="py-4 text-center text-[11px] text-slate-400 border-t border-slate-200/60 bg-white/50 flex items-center justify-center gap-4">
        <span>© {new Date().getFullYear()} NotePad</span>
        <Link to="/privacy" className="hover:text-blue-600 transition-colors">
          Privacy
        </Link>
        <span>•</span>
        <Link to="/terms" className="hover:text-blue-600 transition-colors">
          Terms
        </Link>
      </footer>
    </div>
  );
};

export default Signup;