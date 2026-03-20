"use client";

import { useState } from "react";
import { register } from "../../services/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    username: "",
    password: "",
    email: "",
    fullName: ""
  });

  const handleSubmit = async () => {
    if (isSubmitting) {
      return;
    }

    if (!form.username || !form.email || !form.fullName || !form.password) {
      alert("Please fill in all fields");
      return;
    }

    try {
      setIsSubmitting(true);
      await register(form);
      alert("Registered successfully");
      router.push("/login");
    } catch (err: unknown) {
      console.log(err);
      alert(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="px-8 py-10 text-center text-white" style={{ backgroundColor: '#389C9A' }}>
            <h1 className="text-4xl font-bold mb-2">Create Account</h1>
            <p>Join us today and get started</p>
          </div>

          {/* Form */}
          <div className="px-8 py-10">
            {/* Full Name Input */}
            <div className="mb-5">
              <label className="block text-sm font-semibold mb-2" style={{ color: '#1D1D1D' }}>Full Name</label>
              <input
                type="text"
                placeholder="John Doe"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors duration-200"
                style={{ borderColor: '#E0E0E0', backgroundColor: '#F8F8F8' }}
                onFocus={(e) => e.target.style.borderColor = '#389C9A'}
                onBlur={(e) => e.target.style.borderColor = '#E0E0E0'}
              />
            </div>

            {/* Username Input */}
            <div className="mb-5">
              <label className="block text-sm font-semibold mb-2" style={{ color: '#1D1D1D' }}>Username</label>
              <input
                type="text"
                placeholder="johndoe"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors duration-200"
                style={{ borderColor: '#E0E0E0', backgroundColor: '#F8F8F8' }}
                onFocus={(e) => e.target.style.borderColor = '#389C9A'}
                onBlur={(e) => e.target.style.borderColor = '#E0E0E0'}
              />
            </div>

            {/* Email Input */}
            <div className="mb-5">
              <label className="block text-sm font-semibold mb-2" style={{ color: '#1D1D1D' }}>Email Address</label>
              <input
                type="email"
                placeholder="john@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors duration-200"
                style={{ borderColor: '#E0E0E0', backgroundColor: '#F8F8F8' }}
                onFocus={(e) => e.target.style.borderColor = '#389C9A'}
                onBlur={(e) => e.target.style.borderColor = '#E0E0E0'}
              />
            </div>

            {/* Password Input */}
            <div className="mb-8">
              <label className="block text-sm font-semibold mb-2" style={{ color: '#1D1D1D' }}>Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors duration-200"
                style={{ borderColor: '#E0E0E0', backgroundColor: '#F8F8F8' }}
                onFocus={(e) => e.target.style.borderColor = '#389C9A'}
                onBlur={(e) => e.target.style.borderColor = '#E0E0E0'}
              />
            </div>

            {/* Register Button */}
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full font-bold py-3 rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ backgroundColor: '#FEDB71', color: '#1D1D1D' }}
            >
              {isSubmitting ? "Creating Account..." : "Create Account"}
            </button>
          </div>

          {/* Footer */}
          <div className="px-8 py-6 text-center" style={{ backgroundColor: '#F8F8F8', borderTop: '1px solid #E0E0E0' }}>
            <p className="text-sm" style={{ color: '#6B6B6B' }}>
              Already have an account?{" "}
              <Link href="/login" className="font-semibold hover:opacity-70 transition-colors" style={{ color: '#389C9A' }}>
                Log in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}