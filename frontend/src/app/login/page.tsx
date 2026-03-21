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
    <div className="auth-shell">
      <div className="auth-grid">
        <section className="auth-visual flex flex-col justify-between">
          <div>
            <span className="auth-badge">FoodHub</span>
            <h1 className="text-5xl font-black leading-tight mb-4">
              HELLO <span className="text-primary">.</span>
            </h1>
            <p className="text-xl subtitle max-w-sm">
              Please enter your details to continue
            </p>
          </div>

          <div className="text-7xl md:text-8xl">🥗</div>
        </section>

        <section className="auth-form-pane">
          <div className="mb-8">
            <h2 className="text-4xl font-black tracking-tight">
              <span className="text-primary">Food</span>Hub
            </h2>
            <p className="subtitle mt-2">Login to place and track orders</p>
          </div>

          <div className="space-y-5">
            <div>
              <label className="field-label">Username or E-mail</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="field-input"
                autoComplete="email"
              />
            </div>

            <div>
              <label className="field-label">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="field-input"
                autoComplete="current-password"
              />
            </div>

            <button onClick={handleSubmit} disabled={isLoading} className="btn btn-primary w-full rounded-full mt-3">
              {isLoading ? "Logging in..." : "Log in"}
            </button>

            <div className="text-center space-y-2 pt-2">
              <Link href="/forgot-password" className="text-sm font-semibold text-primary">
                Forget Password?
              </Link>

              <p className="text-sm subtitle">
                Do not have account?{" "}
                <Link href="/register" className="font-bold text-primary">
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
