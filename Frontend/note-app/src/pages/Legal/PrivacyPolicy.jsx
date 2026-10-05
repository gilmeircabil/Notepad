import React from "react";
import { Link } from "react-router-dom";
import { FiArrowLeft, FiShield } from "react-icons/fi";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-12 shadow-sm animate-fade-in">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-blue-600 hover:text-blue-700 mb-6 transition-colors"
        >
          <FiArrowLeft className="text-sm" />
          <span>Back to NotePad</span>
        </Link>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <FiShield className="text-xl" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Privacy Policy</h1>
            <p className="text-xs text-slate-400">Last updated: October 5, 2026</p>
          </div>
        </div>

        <div className="prose prose-slate max-w-none text-xs sm:text-sm leading-relaxed space-y-6 text-slate-600">
          <section>
            <h2 className="text-base font-bold text-slate-900 mb-2">1. Overview</h2>
            <p>
              NotePad ("we", "our", or "us") provides a personal note-taking application designed
              to help you capture thoughts, tasks, and ideas. We value your privacy and believe in
              radical transparency: your personal data belongs to you.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 mb-2">2. Information We Collect</h2>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>
                <strong className="text-slate-800">Account Credentials:</strong> When you register,
                we collect your full name, email address, and a securely salted & hashed representation
                of your password (using bcrypt). We never store your plaintext password.
              </li>
              <li>
                <strong className="text-slate-800">Note Content:</strong> The notes, titles, tags, checklist items,
                and colors you create are stored in our secure database linked exclusively to your account identifier.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 mb-2">3. How We Use Your Data</h2>
            <p>
              Your data is used solely to authenticate your session and render your personal notes.
              We do <strong>not</strong> sell, rent, monetize, or share your data with data brokers, advertisers,
              or third-party trackers.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 mb-2">4. Cookies and Storage</h2>
            <p>
              We use a single strictly necessary session cookie (<code className="bg-slate-100 px-1 py-0.5 rounded text-[11px] font-mono">accessToken</code>)
              with <code className="bg-slate-100 px-1 py-0.5 rounded text-[11px] font-mono">httpOnly</code> and <code className="bg-slate-100 px-1 py-0.5 rounded text-[11px] font-mono">secure</code> flags
              for authentication. We use browser local storage solely to remember non-sensitive interface preferences
              (such as grid or list view).
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 mb-2">5. Data Retention & Deletion (Your Rights)</h2>
            <p>
              You maintain complete control over your data:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 mt-2">
              <li>You can edit or delete individual notes at any time.</li>
              <li>
                You can permanently delete your entire account and all associated notes at any time
                via the <strong className="text-slate-800">Delete Account</strong> option in your user menu.
                Upon deletion, all your records are purged immediately and permanently from our database.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 mb-2">6. Security</h2>
            <p>
              All traffic between your browser and our servers is encrypted in transit using industry-standard
              HTTPS (TLS). Database access is restricted to authenticated server processes with least-privilege access.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
