"use client";

import { useState } from "react";
import Link from "next/link";
import { forgotPassword } from "../../services/auth";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    if (!email.trim()) {
      alert("Please enter your email");
      return;
    }

    try {
      setIsSubmitting(true);
      await forgotPassword({ email: email.trim() });
      setMessage("Password reset instructions sent. Please check your email.");
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Request failed";
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="section-wrap-narrow py-12">
      <div className="app-card overflow-hidden">
        <div className="bg-[linear-gradient(120deg,#1c8c84,#0e6e67)] px-8 py-9 text-center text-[#effffb]">
          <h1 className="title-xl mb-2">Forgot Password</h1>
          <p className="text-sm text-[#d0f8f3]">We will send you a secure reset token</p>
        </div>

        <div className="px-8 py-8">
          <label className="field-label">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="field-input mb-5"
          />

          <button onClick={handleSubmit} disabled={isSubmitting} className="btn btn-primary w-full">
            {isSubmitting ? "Submitting..." : "Send Reset Instructions"}
          </button>

          {message && <p className="text-sm mt-4 text-secondary">{message}</p>}
        </div>

        <div className="px-8 py-6 text-center border-t border-border bg-muted-surface">
          <Link href="/login" className="font-semibold text-secondary">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

