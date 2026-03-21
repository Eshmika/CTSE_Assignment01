"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import { getProfile, updateProfile } from "../../services/auth";

export default function ProfilePage() {
  const { token } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState({ fullName: "", username: "", email: "" });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !token) {
      router.push("/");
    }
  }, [mounted, token, router]);

  useEffect(() => {
    if (token) {
      getProfile(token)
        .then((data) => {
          setForm({
            fullName: data?.fullName || "",
            username: data?.username || "",
            email: data?.email || "",
          });
        })
        .catch(() => {
          alert("Failed to load profile");
        });
    }
  }, [token]);

  if (!mounted || !token) {
    return null;
  }

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await updateProfile(form, token);
      alert("Profile updated");
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update profile";
      alert(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <Navbar />

      <div className="section-wrap-narrow">
        <div className="app-card p-8 mb-6">
          <h1 className="title-xl mb-7">
            My Profile
          </h1>

          <div className="space-y-5">
            <div>
              <label className="field-label">Full Name</label>
              <input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} className="field-input" />
            </div>

            <div>
              <label className="field-label">Username</label>
              <input value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} className="field-input" readOnly/>
            </div>

            <div>
              <label className="field-label">Email</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="field-input" readOnly/>
            </div>
          </div>

          <button onClick={handleSave} disabled={isSaving} className="btn btn-primary w-full mt-8">
            {isSaving ? "Saving..." : "Save Profile"}
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/change-password" className="btn btn-secondary text-center">
            Change Password
          </Link>
          <Link href="/addresses" className="btn btn-ghost text-center">
            Manage Addresses
          </Link>
        </div>
      </div>
    </div>
  );
}

