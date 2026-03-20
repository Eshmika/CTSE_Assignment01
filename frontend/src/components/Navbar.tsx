"use client";

import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { user, token, logout } = useAuth();
  const { cart } = useCart();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <div className="sticky top-0 z-50 shadow-lg" style={{ backgroundColor: '#389C9A' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-between items-center">
          <Link href={token ? "/menu" : "/"} className="text-4xl font-bold text-white hover:opacity-80 transition">
            🍔 FoodHub
          </Link>

          {token ? (
            <div className="flex items-center gap-4">
              <span className="text-white font-semibold">{user?.username}</span>
              <Link
                href="/cart"
                className="px-4 py-2 rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center gap-2"
                style={{ backgroundColor: '#FEDB71', color: '#1D1D1D' }}
              >
                <span>🛒</span>
                <span>Cart ({cart?.length || 0})</span>
              </Link>
              <Link href="/orders" className="bg-blue-600 text-white px-4 py-2 rounded">
                My Orders
              </Link>
              {user?.role === "ADMIN" && (
                <Link href="/admin" className="bg-purple-600 text-white px-4 py-2 rounded">
                  Admin Panel
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="px-6 py-3 rounded-lg font-semibold text-white hover:shadow-lg hover:scale-105 transition-all duration-300"
                style={{ backgroundColor: '#1D1D1D' }}
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="px-6 py-3 rounded-lg font-semibold text-white hover:shadow-lg hover:scale-105 transition-all duration-300"
                style={{ backgroundColor: '#FEDB71', color: '#1D1D1D' }}
              >
                Login
              </Link>
              <Link
                href="/register"
                className="px-6 py-3 rounded-lg font-semibold text-white hover:shadow-lg hover:scale-105 transition-all duration-300"
                style={{ backgroundColor: '#1D1D1D' }}
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
