"use client";

import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const { token } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // If user is logged in, redirect to menu
  if (token) {
    router.push("/menu");
    return null;
  }

  return (
    <div>
      <nav className="topbar">
        <div className="section-wrap py-4 flex items-center justify-between">
          <h1 className="text-3xl font-black text-[#fef8ef] tracking-tight">FoodHub</h1>
          <div className="flex items-center gap-2">
            <Link href="/login" className="btn btn-accent text-sm">Login</Link>
            <Link href="/register" className="btn btn-primary text-sm">Sign Up</Link>
          </div>
        </div>
      </nav>

      <section className="section-wrap py-16 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div>
          <p className="pill pill-created mb-4">Your flavor. Your schedule.</p>
          <h2 className="title-xl mb-4">Order Restaurant Favorites With Zero Friction</h2>
          <p className="subtitle text-lg mb-8">
            Explore curated menus, customize your cart, and track every order in real time with a smooth checkout flow.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/register" className="btn btn-primary">Start Ordering</Link>
            <Link href="/login" className="btn btn-ghost">I Already Have an Account</Link>
          </div>
        </div>

        <div className="app-card p-7">
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl bg-[#fff2df] p-4">
              <p className="text-2xl">Burger Combo</p>
              <p className="subtitle text-sm mt-1">Hot and fresh in 25 mins</p>
            </div>
            <div className="rounded-xl bg-[#dff4f2] p-4">
              <p className="text-2xl">Noodle Bowl</p>
              <p className="subtitle text-sm mt-1">Chef special</p>
            </div>
            <div className="rounded-xl bg-[#ffe8e2] p-4">
              <p className="text-2xl">Grilled Wrap</p>
              <p className="subtitle text-sm mt-1">Best seller</p>
            </div>
            <div className="rounded-xl bg-[#f7f0ff] p-4">
              <p className="text-2xl">Family Box</p>
              <p className="subtitle text-sm mt-1">Value meals</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-wrap pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="app-card p-6">
            <h3 className="font-bold text-xl mb-2">Fast Delivery</h3>
            <p className="subtitle">Reliable riders and accurate ETAs keep your meals arriving hot.</p>
          </div>
          <div className="app-card p-6">
            <h3 className="font-bold text-xl mb-2">Clean Checkout</h3>
            <p className="subtitle">Simple cart flow, no hidden surprises, instant payment confirmation.</p>
          </div>
          <div className="app-card p-6">
            <h3 className="font-bold text-xl mb-2">Order History</h3>
            <p className="subtitle">Reorder from your previous meals with one tap.</p>
          </div>
        </div>
      </section>

      <footer className="py-8 text-center border-t text-sm subtitle" style={{ borderTopColor: "var(--border)" }}>
        FoodHub - built for fast, tasty, everyday ordering.
      </footer>
    </div>
  );
}
