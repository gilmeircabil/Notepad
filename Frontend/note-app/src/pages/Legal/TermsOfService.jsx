import React from "react";
import { Link } from "react-router-dom";
import { FiArrowLeft, FiCheckCircle } from "react-icons/fi";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl border border-slate-200/70 p-8 sm:p-12 shadow-xl shadow-slate-900/5 animate-fade-in">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-blue-600 hover:text-blue-700 mb-6 transition-colors"
        >
          <FiArrowLeft className="text-sm" />
          <span>Back to NotePad</span>
        </Link>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-sm">
            <FiCheckCircle className="text-xl" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Terms of Service</h1>
            <p className="text-xs text-slate-400">Last updated: October 5, 2026</p>
          </div>
        </div>

        <div className="prose prose-slate max-w-none text-xs sm:text-sm leading-relaxed space-y-6 text-slate-600">
          <section>
            <h2 className="text-base font-bold text-slate-900 mb-2">1. Acceptance of Terms</h2>
            <p>
              By accessing or using NotePad, you agree to be bound by these Terms of Service.
              If you do not agree with any part of these terms, please discontinue using the service.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 mb-2">2. User Accounts</h2>
            <p>
              You are responsible for maintaining the confidentiality of your login credentials
              and for all activities that occur under your account. You agree to notify us immediately
              of any unauthorized use of your account.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 mb-2">3. Acceptable Use</h2>
            <p>
              You agree not to use NotePad for any unlawful purposes, or to upload, store, or transmit
              any content that is abusive, infringing on intellectual property, or designed to disrupt
              or harm our systems or other users.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 mb-2">4. Your Content</h2>
            <p>
              You retain full ownership and copyright of all notes, checklists, and text you input
              into NotePad. We do not claim any ownership over your user content.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 mb-2">5. Termination & Deletion</h2>
            <p>
              You may stop using NotePad and permanently delete your account at any time. We reserve the
              right to suspend or terminate accounts that violate these terms or compromise system integrity.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-slate-900 mb-2">6. Limitation of Liability</h2>
            <p>
              NotePad is provided on an "as is" and "as available" basis without warranties of any kind.
              We strive for high reliability and uptime, but we are not liable for incidental, indirect,
              or consequential damages resulting from data loss or service interruptions.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
