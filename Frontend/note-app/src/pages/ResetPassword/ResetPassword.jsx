import React, { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import { Link, useParams, useNavigate } from "react-router-dom";
import Password from "../../components/Input/Password";
import axiosInstance from "../../utils/axiosInstance";
import { FiArrowRight, FiLock, FiCheckCircle, FiAlertCircle } from "react-icons/fi";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

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

  const handleReset = async (e) => {
    e.preventDefault();

    if (!token) {
      setError("Reset token is missing from the link");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      await axiosInstance.post("/reset-password", {
        token,
        newPassword: password,
      });
      setIsSuccess(true);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Password reset failed. The link may have expired or is invalid."
      );
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
                {isSuccess ? (
                  <FiCheckCircle className="text-2xl text-emerald-600" />
                ) : (
                  <FiLock className="text-2xl" />
                )}
              </div>
              <h1 className="text-2xl font-bold text-slate-900">
                {isSuccess ? "Password Reset Complete" : "Choose New Password"}
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1.5 leading-relaxed">
                {isSuccess
                  ? "Your password has been securely updated. You can now sign in with your new credentials."
                  : "Please enter a strong new password for your NotePad account."}
              </p>
            </div>

            {isSuccess ? (
              <div className="space-y-4">
                <button
                  onClick={() => navigate("/login")}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-xl transition-all text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <span>Go to Sign In</span>
                  <FiArrowRight className="text-base" />
                </button>
              </div>
            ) : (
              <form onSubmit={handleReset} className="space-y-4">
                <div>
                  <label
                    htmlFor="new-password"
                    className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 ml-1"
                  >
                    New Password
                  </label>
                  <Password
                    id="new-password"
                    name="new-password"
                    autoComplete="new-password"
                    placeholder="At least 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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

                <div>
                  <label
                    htmlFor="confirm-password"
                    className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 ml-1"
                  >
                    Confirm New Password
                  </label>
                  <Password
                    id="confirm-password"
                    name="confirm-password"
                    autoComplete="new-password"
                    placeholder="Repeat your new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>

                {error && (
                  <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 space-y-1.5">
                    <p className="text-red-600 text-xs font-medium text-center">
                      {error}
                    </p>
                    {error.includes("expired") && (
                      <div className="text-center pt-1">
                        <Link
                          to="/forgot-password"
                          className="text-[11px] text-blue-600 font-semibold hover:underline"
                        >
                          Request a new reset link →
                        </Link>
                      </div>
                    )}
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
                      <span>Save New Password</span>
                      <FiArrowRight className="text-base" />
                    </>
                  )}
                </button>

                <p className="text-xs text-center text-slate-400 pt-3">
                  Remember your old password?{" "}
                  <Link
                    to="/login"
                    className="font-semibold text-blue-600 hover:underline"
                  >
                    Back to sign in
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

export default ResetPassword;
