"use client";

import { useEffect, useState } from "react";
import { getItems } from "../../services/catalog";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";

export default function MenuPage() {
  const [items, setItems] = useState([]);
  const { addToCart } = useCart();
  const { token, user } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !token) {
      router.push("/");
    }
  }, [token, mounted, router]);

  useEffect(() => {
    if (token) {
      getItems().then(setItems);
    }
  }, [token]);

  if (!mounted || !token) {
    return null;
  }

  return (
    <div>
      <Navbar />

      <div className="section-wrap">
        <div className="flex flex-col gap-2 mb-10">
          <h1 className="title-xl">Browse Our Menu</h1>
          <p className="subtitle">Fresh picks, comfort classics, and quick bites.</p>
        </div>

        {items.length === 0 ? (
          <div className="app-card text-center py-10">
            <p className="text-xl subtitle">Loading menu items...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((item: any) => (
              <div
                key={item.id}
                className="app-card overflow-hidden hover:-translate-y-1 transition-all duration-300 flex flex-col"
              >
                <div className="relative h-48 overflow-hidden bg-[#f7ead8]">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  {item.availability !== "AVAILABLE" && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <span className="text-white font-bold text-lg">Out of Stock</span>
                    </div>
                  )}
                </div>

                <div className="p-5 flex flex-col grow">
                  <div className="mb-2">
                    <span className="pill pill-created">
                      {item.category}
                    </span>
                  </div>

                  <h2 className="text-xl font-bold mb-2">{item.name}</h2>

                  <p className="text-sm line-clamp-2 mb-4 grow subtitle">
                    {item.description}
                  </p>

                  <div className="flex justify-between items-center mt-auto pt-4 border-t border-border">
                    <div className="flex flex-col">
                      <span className="text-xs subtitle">Price</span>
                      <p className="text-2xl font-bold text-secondary">Rs. {item.price}</p>
                    </div>

                    {user?.role !== "ADMIN" && (
                      <button
                        disabled={item.availability !== "AVAILABLE"}
                        onClick={() => addToCart(item)}
                        className={`btn ${
                          item.availability === "AVAILABLE"
                            ? "btn-primary"
                            : "cursor-not-allowed opacity-60"
                        }`}
                      >
                        {item.availability === "AVAILABLE" ? "Add to Cart" : "Unavailable"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

