"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import {
  createItem,
  getItems,
  deleteItem,
  updateAvailability,
} from "../../services/catalog";

export default function AdminPage() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && user?.role !== "ADMIN") {
      router.push("/");
    }
  }, [user, mounted, router]);

  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    imageUrl: "",
  });

  const loadItems = () => {
    getItems().then(setItems);
  };

  useEffect(() => {
    if (user?.role === "ADMIN") {
      loadItems();
    }
  }, [user]);

  if (!mounted || user?.role !== "ADMIN") {
    return null;
  }

  const handleCreate = async () => {
    try {
      await createItem(
        {
          ...form,
          price: Number(form.price),
        },
        token
      );

      alert("Item created!");
      loadItems();
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to create item";
      alert(errorMessage);
    }
  };

  return (
    <div>
      <Navbar />

      <div className="section-wrap">
        <h1 className="title-xl mb-10">Admin Panel</h1>

        <div className="app-card p-8 mb-12">
          <h2 className="text-2xl font-bold mb-8">Add New Item</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="item-name" className="field-label">
                Name
              </label>
              <input
                id="item-name"
                placeholder="Item name"
                className="field-input"
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="item-price" className="field-label">
                Price
              </label>
              <input
                id="item-price"
                placeholder="Price"
                className="field-input"
                onChange={(e) => setForm({ ...form, price: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="item-category" className="field-label">
                Category
              </label>
              <select
                id="item-category"
                className="field-input"
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                <option>Burger</option>
                <option>Sandwich</option>
                <option>Sides</option>
                <option>Milkshake</option>
                <option>Beverage</option>
                <option>Dessert</option>
              </select>
            </div>

            <div>
              <label htmlFor="item-image-url" className="field-label">
                Image URL
              </label>
              <input
                id="item-image-url"
                placeholder="Image URL"
                className="field-input"
                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="item-description" className="field-label">
                Description
              </label>
              <textarea
                id="item-description"
                placeholder="Description"
                className="field-input"
                rows={3}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </div>
          </div>

          <button onClick={handleCreate} className="btn btn-primary w-full">
            Create Item
          </button>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-8">Manage Items</h2>
          <div className="space-y-4">
            {items.map((item: any) => (
              <div key={item.id} className="app-card p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-25 h-25 object-contain rounded"
                    />
                    <div>
                      <p className="text-lg font-semibold">{item.name}</p>
                      <p className="text-sm subtitle">{item.description}</p>
                      <p className="mt-2 font-bold text-secondary">
                        Rs. {item.price}
                      </p>
                      <p className="pill pill-created mt-1">{item.category}</p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={() =>
                        updateAvailability(
                          item.id,
                          item.availability === "AVAILABLE"
                            ? "UNAVAILABLE"
                            : "AVAILABLE",
                          token
                        ).then(loadItems)
                      }
                      className="btn btn-accent"
                    >
                      {item.availability === "AVAILABLE"
                        ? "Mark Unavailable"
                        : "Mark Available"}
                    </button>

                    <button
                      onClick={() => deleteItem(item.id, token).then(loadItems)}
                      className="btn btn-danger"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
