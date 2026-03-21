"use client";

import { useEffect, useMemo, useState } from "react";
import { getItems } from "../../services/catalog";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";

const MENU_CATEGORIES = [
  "Dessert",
  "Beverage",
  "Milkshake",
  "Sides",
  "Sandwich",
  "Burger",
];

export default function MenuPage() {
  const [items, setItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
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

  const filteredItems = useMemo(() => {
    return items.filter((item: any) => {
      const matchesCategory =
        selectedCategory === "All" || item.category === selectedCategory;
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        query.length === 0 ||
        item.name?.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [items, selectedCategory, searchQuery]);

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

        <div className="app-card p-5 mb-8 space-y-5">
          <div>
            <label htmlFor="menu-search" className="block text-sm font-semibold mb-2">
              Search
            </label>
            <input
              id="menu-search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by item name or description"
              className="w-full rounded-lg border border-border bg-white px-4 py-2.5 outline-none focus:ring-2 focus:ring-secondary/40"
            />
          </div>

          <div>
            <p className="text-sm font-semibold mb-3">Filter by category</p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setSelectedCategory("All")}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                  selectedCategory === "All"
                    ? "bg-secondary text-white"
                    : "bg-muted-surface text-foreground hover:bg-[#f4e8d8]"
                }`}
              >
                All
              </button>
              {MENU_CATEGORIES.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                    selectedCategory === category
                      ? "bg-secondary text-white"
                      : "bg-muted-surface text-foreground hover:bg-[#f4e8d8]"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="app-card text-center py-10">
            <p className="text-xl subtitle">Loading menu items...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="app-card text-center py-10">
            <p className="text-xl subtitle">No items match your search/filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item: any) => (
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

