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
    <div className="topbar">
      <div className="section-wrap py-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Link href={token ? "/menu" : "/"} className="text-3xl font-black text-[#fef8ef] tracking-tight">
            FoodHub
          </Link>

          {token ? (
            <div className="flex flex-wrap items-center gap-2 sm:justify-end">
              {user?.role === "ADMIN" ? (
                <>
                  <span className="text-sm font-semibold text-[#d6fffb] mr-2">Hi, {user?.username}</span>
                  <Link href="/admin" className="btn btn-ghost text-sm">
                    New Menu
                  </Link>
                  <Link href="/menu" className="btn btn-ghost text-sm">
                    Menu
                  </Link>
                  <button onClick={handleLogout} className="btn btn-danger text-sm">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <span className="text-sm font-semibold text-[#d6fffb] mr-2">Hi, {user?.username}</span>
                  <Link href="/menu" className="btn btn-ghost text-sm">
                    Menu
                  </Link>
                  <Link href="/profile" className="btn btn-ghost text-sm">
                    Profile
                  </Link>
                  <Link href="/orders" className="btn btn-ghost text-sm">
                    Orders
                  </Link>
                  <Link href="/cart" className="btn btn-accent text-sm">
                    Cart ({cart?.length || 0})
                  </Link>
                  <button onClick={handleLogout} className="btn btn-danger text-sm">
                    Logout
                  </button>
                </>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login" className="btn btn-accent text-sm">
                Login
              </Link>
              <Link href="/register" className="btn btn-primary text-sm">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
