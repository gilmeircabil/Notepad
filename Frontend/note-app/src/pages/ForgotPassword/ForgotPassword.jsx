import React, { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import { Link } from "react-router-dom";
import { validateEmail } from "../../utils/Helper";
import axiosInstance from "../../utils/axiosInstance";
import { FiArrowRight, FiKey, FiMail, FiCheckCircle } from "react-icons/fi";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      await axiosInstance.post("/forgot-password", {
        email: email.trim().toLowerCase(),
      });
      setIsSubmitted(true);
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

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 transition-colors flex flex-col justify-between">
      <Navbar />

      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 py-10 sm:py-16 relative overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-md relative z-10">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-7 sm:p-10 animate-fade-in shadow-sm">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 mb-3 shadow-inner">
                {isSubmitted ? (
                  <FiCheckCircle className="text-2xl text-emerald-600" />
                ) : (
                  <FiKey className="text-2xl" />
                )}
              </div>
              <h1 className="text-2xl font-bold text-slate-900">
                {isSubmitted ? "Check your email" : "Forgot Password?"}
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1.5 leading-relaxed">
                {isSubmitted
                  ? `If an account exists for ${email}, a password reset link has been dispatched.`
                  : "Enter your email address and we'll send you a link to reset your password."}
              </p>
            </div>

            {isSubmitted ? (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100 text-left">
                  <div className="flex items-start gap-3">
                    <FiMail className="text-blue-600 text-lg shrink-0 mt-0.5" />
                    <div className="text-xs text-blue-900 leading-relaxed">
                      <p className="font-semibold mb-1">What to do next:</p>
                      <ul className="list-disc pl-4 space-y-1 text-blue-800/90">
                        <li>Check your inbox (and spam/junk folder).</li>
                        <li>Click the link in the email within 15 minutes.</li>
                        <li>Choose a strong, memorable new password.</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="pt-2 text-center space-y-3">
                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setEmail("");
                    }}
                    className="text-xs text-slate-500 hover:text-blue-600 transition-colors"
                  >
                    Didn't get the email? Try again
                  </button>

                  <div>
                    <Link
                      to="/login"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:underline"
                    >
                      Return to Sign In
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="forgot-email"
                    className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 ml-1"
                  >
                    Account Email
                  </label>
                  <input
                    id="forgot-email"
                    type="email"
                    autoComplete="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200/80 rounded-xl px-4 py-3 outline-none focus:bg-white focus:border-blue-500 transition-all text-slate-800 placeholder:text-slate-400"
                  />
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
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-3.5 rounded-xl transition-all text-xs sm:text-sm flex items-center justify-center gap-2 mt-2 cursor-pointer"
                >
                  {isLoading ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Send Reset Link</span>
                      <FiArrowRight className="text-base" />
                    </>
                  )}
                </button>

                <p className="text-xs text-center text-slate-400 pt-3">
                  Remembered your password?{" "}
                  <Link
                    to="/login"
                    className="font-semibold text-blue-600 hover:underline"
                  >
                    Back to login
                  </Link>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
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

export default ForgotPassword;
