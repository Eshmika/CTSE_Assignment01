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
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 shadow-lg" style={{ backgroundColor: '#389C9A' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-4xl font-bold text-white">🍔 FoodHub</h1>
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="px-6 py-3 rounded-lg font-semibold text-white hover:shadow-lg hover:scale-105 transition-all"
                style={{ backgroundColor: '#FEDB71', color: '#1D1D1D' }}
              >
                Login
              </Link>
              <Link
                href="/register"
                className="px-6 py-3 rounded-lg font-semibold text-white hover:shadow-lg hover:scale-105 transition-all"
                style={{ backgroundColor: '#1D1D1D' }}
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#F8F8F8' }}>
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-6xl font-bold mb-6" style={{ color: '#1D1D1D' }}>
            Welcome to FoodHub
          </h2>
          <p className="text-2xl mb-8" style={{ color: '#6B6B6B' }}>
            Discover delicious food, order with ease, and enjoy fast delivery right to your door.
          </p>
          <p className="text-lg mb-12" style={{ color: '#9B9B9B' }}>
            Browse our menu, add items to your cart, and checkout seamlessly. Fresh food, great prices, better experience.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <Link
              href="/register"
              className="px-10 py-4 rounded-lg font-bold text-lg hover:shadow-lg hover:scale-105 transition-all"
              style={{ backgroundColor: '#FEDB71', color: '#1D1D1D' }}
            >
              Get Started
            </Link>
            <Link
              href="/login"
              className="px-10 py-4 rounded-lg font-bold text-lg text-white hover:shadow-lg hover:scale-105 transition-all"
              style={{ backgroundColor: '#389C9A' }}
            >
              Sign In
            </Link>
          </div>

          <div className="text-6xl mb-8">🍕 🍔 🍟 🍜 🍱</div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h3 className="text-4xl font-bold text-center mb-16" style={{ color: '#1D1D1D' }}>
            Why Choose FoodHub?
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-8 rounded-lg shadow-md bg-white">
              <div className="text-4xl mb-4">⚡</div>
              <h4 className="text-2xl font-bold mb-3" style={{ color: '#1D1D1D' }}>
                Fast Delivery
              </h4>
              <p style={{ color: '#6B6B6B' }}>
                Get your food delivered fresh and hot within minutes
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 rounded-lg shadow-md bg-white">
              <div className="text-4xl mb-4">💰</div>
              <h4 className="text-2xl font-bold mb-3" style={{ color: '#1D1D1D' }}>
                Best Prices
              </h4>
              <p style={{ color: '#6B6B6B' }}>
                Enjoy great discounts and affordable options for all budgets
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 rounded-lg shadow-md bg-white">
              <div className="text-4xl mb-4">✨</div>
              <h4 className="text-2xl font-bold mb-3" style={{ color: '#1D1D1D' }}>
                Quality Food
              </h4>
              <p style={{ color: '#6B6B6B' }}>
                Fresh ingredients and delicious recipes prepared with care
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4" style={{ backgroundColor: '#F8F8F8' }}>
        <div className="text-center max-w-2xl mx-auto">
          <h3 className="text-4xl font-bold mb-6" style={{ color: '#1D1D1D' }}>
            Ready to Order?
          </h3>
          <p className="text-lg mb-8" style={{ color: '#6B6B6B' }}>
            Create an account and start ordering your favorite food today!
          </p>
          <Link
            href="/register"
            className="inline-block px-10 py-4 rounded-lg font-bold text-lg hover:shadow-lg hover:scale-105 transition-all text-white"
            style={{ backgroundColor: '#389C9A' }}
          >
            Sign Up Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4" style={{ backgroundColor: '#1D1D1D', color: '#FFFFFF' }}>
        <div className="max-w-5xl mx-auto text-center">
          <p className="mb-2">© 2024 FoodHub. All rights reserved.</p>
          <p style={{ color: '#9B9B9B' }}>Order your favorite food online with FoodHub 🍔</p>
        </div>
      </footer>
    </div>
  );
}