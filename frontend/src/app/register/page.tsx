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
    <div className="auth-shell">
      <div className="auth-grid">
        <section className="auth-visual flex flex-col justify-between">
          <div>
            <span className="auth-badge">FoodHub</span>
            <h1 className="text-5xl font-black leading-tight mb-4">
              JOIN <span className="text-primary">US</span>
            </h1>
            <p className="text-xl subtitle max-w-sm">
              Create your account and get instant access to menus, cart and order tracking.
            </p>
          </div>

          <div className="text-7xl md:text-8xl">🍜</div>
        </section>

        <section className="auth-form-pane">
          <div className="mb-8">
            <h2 className="text-4xl font-black tracking-tight">
              <span className="text-primary">Create</span> Account
            </h2>
            <p className="subtitle mt-2">Start your food ordering journey</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="field-label">Full Name</label>
              <input type="text" placeholder="John Doe" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} className="field-input" />
            </div>

            <div>
              <label className="field-label">Username</label>
              <input type="text" placeholder="johndoe" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} className="field-input" />
            </div>

            <div>
              <label className="field-label">Email Address</label>
              <input type="email" placeholder="john@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="field-input" />
            </div>

            <div>
              <label className="field-label">Password</label>
              <input type="password" placeholder="Choose a password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="field-input" />
            </div>

            <button onClick={handleSubmit} disabled={isSubmitting} className="btn btn-primary w-full rounded-full mt-3">
              {isSubmitting ? "Creating account..." : "Sign Up"}
            </button>

            <p className="text-sm subtitle text-center pt-2">
              Already have an account?{" "}
              <Link href="/login" className="font-bold text-primary">Log in</Link>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
