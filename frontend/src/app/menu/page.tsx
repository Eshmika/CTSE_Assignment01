"use client";

import { useEffect, useState } from "react";
import { getItems } from "../../services/catalog";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";

export default function MenuPage() {
  const [items, setItems] = useState([]);
  const { cart, addToCart } = useCart();
  const { token } = useAuth();
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
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Navbar />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold mb-12" style={{ color: '#1D1D1D' }}>Browse Our Menu</h1>
        
        {items.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl" style={{ color: '#9B9B9B' }}>Loading menu items...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((item: any) => (
              <div
                key={item.id}
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col"
              >
                {/* Image Container */}
                <div className="relative h-48 overflow-hidden bg-gray-200">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                  />
                  {item.availability !== "AVAILABLE" && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <span className="text-white font-bold text-lg">Out of Stock</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col grow">
                  {/* Category Badge */}
                  <div className="mb-2">
                    <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full" style={{ backgroundColor: '#F8F8F8', color: '#1D1D1D' }}>
                      {item.category}
                    </span>
                  </div>

                  {/* Name */}
                  <h2 className="text-xl font-bold mb-2" style={{ color: '#1D1D1D' }}>{item.name}</h2>

                  {/* Description */}
                  <p className="text-sm line-clamp-2 mb-4 grow" style={{ color: '#6B6B6B' }}>
                    {item.description}
                  </p>

                  {/* Price + Button */}
                  <div className="flex justify-between items-center mt-auto pt-4" style={{ borderTop: '1px solid #F8F8F8' }}>
                    <div className="flex flex-col">
                      <span className="text-xs" style={{ color: '#9B9B9B' }}>Price</span>
                      <p className="text-2xl font-bold" style={{ color: '#389C9A' }}>Rs. {item.price}</p>
                    </div>

                    <button
                      disabled={item.availability !== "AVAILABLE"}
                      onClick={() => {
                        addToCart(item);
                      }}
                      className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                        item.availability === "AVAILABLE"
                          ? "hover:shadow-lg hover:scale-105 active:scale-95"
                          : "cursor-not-allowed opacity-60"
                      }`}
                      style={{
                        backgroundColor: item.availability === "AVAILABLE" ? '#FEDB71' : '#E0E0E0',
                        color: '#1D1D1D'
                      }}
                    >
                      {item.availability === "AVAILABLE" ? "Add to Cart" : "Unavailable"}
                    </button>
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
