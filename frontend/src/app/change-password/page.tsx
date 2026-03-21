"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import { changePassword } from "../../services/auth";

export default function ChangePasswordPage() {
  const { token } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [form, setForm] = useState({ currentPassword: "", newPassword: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !token) {
      router.push("/");
    }
  }, [mounted, token, router]);

  if (!mounted || !token) {
    return null;
  }

  const handleSubmit = async () => {
    if (!form.currentPassword || !form.newPassword) {
      alert("Please fill all fields");
      return;
    }

    try {
      setIsSubmitting(true);
      await changePassword(form, token);
      alert("Password changed successfully");
      router.push("/profile");
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to change password";
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="section-wrap-narrow">
        <div className="app-card p-8">
          <h1 className="title-xl mb-7">
            Change Password
          </h1>

          <label className="field-label">Current Password</label>
          <input type="password" value={form.currentPassword} onChange={(e) => setForm({ ...form, currentPassword: e.target.value })} className="field-input mb-5" />

          <label className="field-label">New Password</label>
          <input type="password" value={form.newPassword} onChange={(e) => setForm({ ...form, newPassword: e.target.value })} className="field-input mb-6" />

          <button onClick={handleSubmit} disabled={isSubmitting} className="btn btn-primary w-full">
            {isSubmitting ? "Updating..." : "Update Password"}
          </button>
        </div>
      </div>
    </div>
  );
}

