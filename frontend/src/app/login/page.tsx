"use client";

import { useState } from "react";
import { login } from "../../services/auth";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const { loginUser } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async () => {
    if (!form.email || !form.password) {
      alert("Please fill in all fields");
      return;
    }

    try {
      setIsLoading(true);
      const res = await login(form);

      // ⚠️ adjust this depending on your backend response
      loginUser(res);

      router.push("/menu");
    } catch (err) {
      alert("Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="px-8 py-10 text-center text-white" style={{ backgroundColor: '#389C9A' }}>
            <h1 className="text-4xl font-bold mb-2">Welcome Back</h1>
            <p>Sign in to your account</p>
          </div>

          {/* Form */}
          <div className="px-8 py-10">
            {/* Email Input */}
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2" style={{ color: '#1D1D1D' }}>Email Address</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors duration-200"
                style={{ borderColor: '#E0E0E0', backgroundColor: '#F8F8F8' }}
                onFocus={(e) => e.target.style.borderColor = '#389C9A'}
                onBlur={(e) => e.target.style.borderColor = '#E0E0E0'}
                autoComplete="email"
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
                autoComplete="current-password"
              />
            </div>

            {/* Login Button */}
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full font-bold py-3 rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ backgroundColor: '#FEDB71', color: '#1D1D1D' }}
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </div>

          {/* Footer */}
          <div className="px-8 py-6 text-center" style={{ backgroundColor: '#F8F8F8', borderTop: '1px solid #E0E0E0' }}>
            <p className="text-sm" style={{ color: '#6B6B6B' }}>
              Don't have an account?{" "}
              <Link href="/register" className="font-semibold hover:opacity-70 transition-colors" style={{ color: '#389C9A' }}>
                Sign up here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}