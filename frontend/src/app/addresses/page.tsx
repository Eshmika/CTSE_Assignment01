"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import { addAddress, deleteAddress, getAddresses, updateAddress } from "../../services/auth";

type Address = {
  id?: string;
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
};

export default function AddressesPage() {
  const { token } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Address>({
    line1: "",
    line2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !token) {
      router.push("/");
    }
  }, [mounted, token, router]);

  const loadAddresses = () => {
    if (!token) {
      return;
    }

    getAddresses(token)
      .then((data) => setAddresses(Array.isArray(data) ? data : []))
      .catch(() => setAddresses([]));
  };

  useEffect(() => {
    if (token) {
      loadAddresses();
    }
  }, [token]);

  if (!mounted || !token) {
    return null;
  }

  const resetForm = () => {
    setForm({
      line1: "",
      line2: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
    });
    setEditingId(null);
  };

  const handleSubmit = async () => {
    if (!form.line1 || !form.city || !form.country) {
      alert("Line 1, city and country are required");
      return;
    }

    try {
      setIsSubmitting(true);
      if (editingId) {
        await updateAddress(editingId, form, token);
      } else {
        await addAddress(form, token);
      }
      resetForm();
      loadAddresses();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Address operation failed";
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const startEdit = (address: Address) => {
    setEditingId(address.id || null);
    setForm({
      line1: address.line1 || "",
      line2: address.line2 || "",
      city: address.city || "",
      state: address.state || "",
      postalCode: address.postalCode || "",
      country: address.country || "",
    });
  };

  return (
    <div>
      <Navbar />

      <div className="section-wrap">
        <h1 className="title-xl mb-7">
          My Addresses
        </h1>

        <div className="app-card p-6 mb-8">
          <h2 className="text-xl font-bold mb-5">
            {editingId ? "Edit Address" : "Add Address"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              placeholder="Line 1"
              value={form.line1}
              onChange={(e) => setForm({ ...form, line1: e.target.value })}
              className="field-input"
            />
            <input
              placeholder="Line 2"
              value={form.line2}
              onChange={(e) => setForm({ ...form, line2: e.target.value })}
              className="field-input"
            />
            <input
              placeholder="City"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              className="field-input"
            />
            <input
              placeholder="State"
              value={form.state}
              onChange={(e) => setForm({ ...form, state: e.target.value })}
              className="field-input"
            />
            <input
              placeholder="Postal Code"
              value={form.postalCode}
              onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
              className="field-input"
            />
            <input
              placeholder="Country"
              value={form.country}
              onChange={(e) => setForm({ ...form, country: e.target.value })}
              className="field-input"
            />
          </div>

          <div className="flex gap-3 mt-5">
            <button onClick={handleSubmit} disabled={isSubmitting} className="btn btn-primary">
              {isSubmitting ? "Saving..." : editingId ? "Update Address" : "Add Address"}
            </button>

            {editingId && (
              <button onClick={resetForm} className="btn btn-ghost">
                Cancel
              </button>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {addresses.length === 0 ? (
            <div className="app-card p-6 subtitle">
              No addresses available
            </div>
          ) : (
            addresses.map((address, index) => (
              <div key={address.id || String(index)} className="app-card p-6">
                <p className="font-semibold">
                  {address.line1}
                </p>
                {address.line2 && <p className="subtitle">{address.line2}</p>}
                <p className="subtitle">
                  {address.city} {address.state} {address.postalCode}
                </p>
                <p className="subtitle">{address.country}</p>

                <div className="flex gap-3 mt-4">
                  <button onClick={() => startEdit(address)} className="btn btn-secondary">
                    Edit
                  </button>

                  {address.id && (
                    <button
                      onClick={() => {
                        deleteAddress(address.id as string, token)
                          .then(loadAddresses)
                          .catch((err: unknown) => {
                            const errorMessage = err instanceof Error ? err.message : "Delete failed";
                            alert(errorMessage);
                          });
                      }}
                      className="btn btn-danger"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

