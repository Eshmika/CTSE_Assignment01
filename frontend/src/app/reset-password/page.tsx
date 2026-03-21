"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { resetPassword } from "../../services/auth";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!token.trim() || !newPassword.trim()) {
      alert("Please provide reset token and new password");
      return;
    }

    try {
      setIsSubmitting(true);
      await resetPassword({ token: token.trim(), newPassword });
      alert("Password reset successful");
      router.push("/login");
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Reset failed";
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="section-wrap-narrow py-12">
      <div className="app-card overflow-hidden">
        <div className="bg-[linear-gradient(120deg,#ef6c2f,#d95a1c)] px-8 py-9 text-center text-[#fff6ef]">
          <h1 className="title-xl mb-2">Reset Password</h1>
          <p className="text-sm text-[#ffe6d2]">Use your token and create a new password</p>
        </div>

        <div className="px-8 py-8">
          <label className="field-label">Reset Token</label>
          <input
            type="text"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Paste reset token"
            className="field-input mb-4"
          />

          <label className="field-label">New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
            className="field-input mb-6"
          />

          <button onClick={handleSubmit} disabled={isSubmitting} className="btn btn-primary w-full">
            {isSubmitting ? "Submitting..." : "Reset Password"}
          </button>
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

