"use client";

import { useEffect, useMemo, useState } from "react";
import { getItems } from "../../services/catalog";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import CreativeToast from "../../components/CreativeToast";

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
  const [selectedQuantities, setSelectedQuantities] = useState<
    Record<string, number>
  >({});
  const [toast, setToast] = useState<{
    title: string;
    message: string;
    tone: "success" | "info" | "warning";
  } | null>(null);
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

  const changeQuantity = (itemId: string, delta: number) => {
    setSelectedQuantities((prev) => {
      const currentQuantity = prev[itemId] ?? 1;
      return {
        ...prev,
        [itemId]: Math.max(1, currentQuantity + delta),
      };
    });
  };

  const handleAddToCart = (item: any) => {
    const quantity = selectedQuantities[item.id] ?? 1;
    addToCart(item, quantity);
    setToast({
      title: "Basket boosted",
      message: `${quantity} x ${item.name} added to your cart. Your feast is getting louder.`,
      tone: "success",
    });
    setSelectedQuantities((prev) => ({ ...prev, [item.id]: 1 }));
  };

  const content =
    items.length === 0 ? (
      <div className="app-card text-center py-10">
        <p className="text-xl subtitle">Loading menu items...</p>
      </div>
    ) : filteredItems.length === 0 ? (
      <div className="app-card text-center py-10">
        <p className="text-xl subtitle">No items match your search/filter.</p>
      </div>
    ) : (
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {filteredItems.map((item: any) => {
          const isAvailable = item.availability === "AVAILABLE";
          const quantity = selectedQuantities[item.id] ?? 1;
          const buttonClass = isAvailable
            ? "btn-primary"
            : "cursor-not-allowed opacity-60";
          const buttonText = isAvailable
            ? `Add ${quantity} to Cart`
            : "Unavailable";

          return (
            <div
              key={item.id}
              className="app-card flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1"
            >
              <div className="relative flex h-56 items-center justify-center bg-[#f7ead8]">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="max-h-56 max-w-full object-contain transition-transform duration-300 hover:scale-105"
                />
                {!isAvailable && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                    <span className="text-lg font-bold text-white">
                      Out of Stock
                    </span>
                  </div>
                )}
              </div>

              <div className="flex grow flex-col p-5">
                <div className="mb-2">
                  <span className="pill pill-created">{item.category}</span>
                </div>

                <h2 className="mb-2 text-xl font-bold">{item.name}</h2>

                <p className="subtitle mb-4 grow text-sm line-clamp-2">
                  {item.description}
                </p>

                <div className="mb-4 rounded-2xl border border-border bg-[#fffaf4] p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] subtitle">
                        Quantity
                      </p>
                      <p className="text-sm font-semibold">
                        Pick your order size
                      </p>
                    </div>
                    <span className="pill pill-created">
                      {quantity} selected
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-white px-3 py-2">
                    <button
                      type="button"
                      onClick={() => changeQuantity(item.id, -1)}
                      disabled={!isAvailable || quantity === 1}
                      className="btn btn-ghost flex h-10 w-10 items-center justify-center px-0 text-xl font-black"
                      aria-label={`Decrease quantity for ${item.name}`}
                    >
                      −
                    </button>
                    <span className="text-lg font-black text-secondary">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => changeQuantity(item.id, 1)}
                      disabled={!isAvailable}
                      className="btn btn-ghost flex h-10 w-10 items-center justify-center px-0 text-xl font-black"
                      aria-label={`Increase quantity for ${item.name}`}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="mt-auto flex items-center justify-between gap-3 border-t border-border pt-4">
                  <div className="flex flex-col">
                    <span className="text-xs subtitle">Price</span>
                    <p className="text-2xl font-bold text-secondary">
                      Rs. {item.price}
                    </p>
                  </div>

                  {user?.role !== "ADMIN" && (
                    <button
                      disabled={!isAvailable}
                      onClick={() => handleAddToCart(item)}
                      className={`btn ${buttonClass}`}
                    >
                      {buttonText}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );

  if (!mounted || !token) {
    return null;
  }

  return (
    <div>
      <Navbar />
      <CreativeToast
        open={Boolean(toast)}
        title={toast?.title || ""}
        message={toast?.message || ""}
        tone={toast?.tone || "success"}
        onClose={() => setToast(null)}
      />

      <div className="section-wrap">
        <div className="mb-10 flex flex-col gap-2">
          <h1 className="title-xl">Browse Our Menu</h1>
          <p className="subtitle">
            Fresh picks, comfort classics, and quick bites.
          </p>
        </div>

        <div className="app-card mb-8 space-y-5 p-5">
          <div>
            <label
              htmlFor="menu-search"
              className="mb-2 block text-sm font-semibold"
            >
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
            <p className="mb-3 text-sm font-semibold">Filter by category</p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setSelectedCategory("All")}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
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
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
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

        {content}
      </div>
    </div>
  );
}
