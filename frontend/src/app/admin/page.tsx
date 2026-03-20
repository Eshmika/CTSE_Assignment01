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
    if (mounted && (!user || user.role !== "ADMIN")) {
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

  if (!mounted || !user || user.role !== "ADMIN") {
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
    } catch (err) {
      alert("Failed to create item");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Navbar />

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold mb-12" style={{ color: '#1D1D1D' }}>👑 Admin Panel</h1>

        {/* CREATE FORM */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-12">
          <h2 className="text-2xl font-bold mb-8" style={{ color: '#1D1D1D' }}>Add New Item</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: '#1D1D1D' }}>Name</label>
              <input
                placeholder="Item name"
                className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors duration-200"
                style={{ borderColor: '#E0E0E0', backgroundColor: '#F8F8F8' }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#389C9A'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#E0E0E0'}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: '#1D1D1D' }}>Price</label>
              <input
                placeholder="Price"
                className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors duration-200"
                style={{ borderColor: '#E0E0E0', backgroundColor: '#F8F8F8' }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#389C9A'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#E0E0E0'}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: '#1D1D1D' }}>Category</label>
              <input
                placeholder="Category"
                className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors duration-200"
                style={{ borderColor: '#E0E0E0', backgroundColor: '#F8F8F8' }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#389C9A'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#E0E0E0'}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: '#1D1D1D' }}>Image URL</label>
              <input
                placeholder="Image URL"
                className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors duration-200"
                style={{ borderColor: '#E0E0E0', backgroundColor: '#F8F8F8' }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#389C9A'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#E0E0E0'}
                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold mb-2" style={{ color: '#1D1D1D' }}>Description</label>
              <textarea
                placeholder="Description"
                className="w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors duration-200"
                style={{ borderColor: '#E0E0E0', backgroundColor: '#F8F8F8' }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#389C9A'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#E0E0E0'}
                rows={3}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
          </div>

          <button
            onClick={handleCreate}
            className="w-full px-6 py-3 rounded-lg font-bold hover:shadow-lg hover:scale-105 transition-all duration-300 active:scale-95"
            style={{ backgroundColor: '#FEDB71', color: '#1D1D1D' }}
          >
            Create Item
          </button>
        </div>

        {/* ITEM LIST */}
        <div>
          <h2 className="text-2xl font-bold mb-8" style={{ color: '#1D1D1D' }}>Manage Items</h2>
          <div className="space-y-4">
            {items.map((item: any) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <p className="text-lg font-semibold" style={{ color: '#1D1D1D' }}>{item.name}</p>
                    <p className="text-sm" style={{ color: '#6B6B6B' }}>{item.description}</p>
                    <p className="mt-2 font-bold" style={{ color: '#389C9A' }}>Rs. {item.price}</p>
                    <p className="text-xs mt-1 px-3 py-1 rounded-full w-fit" style={{ backgroundColor: '#F8F8F8', color: '#1D1D1D' }}>
                      {item.category}
                    </p>
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
                      className="px-4 py-2 rounded-lg font-semibold text-white hover:shadow-lg transition-all"
                      style={{ backgroundColor: '#FEDB71', color: '#1D1D1D' }}
                    >
                      {item.availability === "AVAILABLE" ? "Mark Unavailable" : "Mark Available"}
                    </button>

                    <button
                      onClick={() =>
                        deleteItem(item.id, token).then(loadItems)
                      }
                      className="px-4 py-2 rounded-lg font-semibold text-white hover:shadow-lg transition-all"
                      style={{ backgroundColor: '#1D1D1D' }}
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