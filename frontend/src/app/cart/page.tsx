"use client";

import { useEffect, useState } from "react";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { createOrder } from "../../services/orders";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import CreativeToast from "../../components/CreativeToast";

export default function CartPage() {
  const { cart, removeFromCart, addToCart, clearCart } = useCart();
  const { token } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [toast, setToast] = useState<{
    title: string;
    message: string;
    tone: "success" | "info" | "warning";
  } | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !token) {
      router.push("/");
    }
  }, [token, mounted, router]);

  const total = cart.reduce(
    (sum: number, item: any) => sum + item.price * item.quantity,
    0
  );

  const handleCheckout = async () => {
    try {
      const orderData = {
        items: cart.map((item: any) => ({
          itemId: item.id,
          quantity: item.quantity,
        })),
      };

      const order = await createOrder(orderData, token);

      clearCart();
      setToast({
        title: "Order placed",
        message: `Order ${order.id} is ready for payment. Head to Orders to finish the checkout ritual.`,
        tone: "info",
      });

      setTimeout(() => {
        router.push("/orders");
      }, 900);
    } catch (err) {
      console.error(err);
      setToast({
        title: "Checkout stalled",
        message:
          "We could not place the order right now. Please try again in a moment.",
        tone: "warning",
      });
    }
  };

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
        <h1 className="title-xl mb-8">Your Cart</h1>
        {cart.length === 0 ? (
          <div className="app-card py-16 text-center">
            <p className="subtitle mb-4 text-2xl">Your cart is empty</p>
            <Link href="/menu" className="btn btn-secondary inline-block">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="app-card overflow-hidden">
                <div className="divide-y divide-gray-200">
                  {cart.map((item: any) => (
                    <div
                      key={item.id}
                      className="p-6 transition-colors duration-200 hover:bg-[#fff9f1]"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="grow">
                          <h3 className="mb-1 text-lg font-semibold">
                            {item.name}
                          </h3>
                          <p className="subtitle mb-3 text-sm">
                            Unit Price:{" "}
                            <span className="font-semibold text-foreground">
                              Rs. {item.price}
                            </span>
                          </p>
                          <p className="text-lg font-bold">
                            Subtotal: Rs. {item.price * item.quantity}
                          </p>
                        </div>

                        <div className="flex w-fit items-center gap-2 rounded-lg bg-muted-surface p-2">
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="flex h-8 w-8 items-center justify-center rounded bg-secondary font-bold text-white"
                            title="Decrease quantity"
                          >
                            −
                          </button>

                          <span className="w-8 text-center font-semibold">
                            {item.quantity}
                          </span>

                          <button
                            onClick={() => addToCart(item)}
                            className="flex h-8 w-8 items-center justify-center rounded bg-secondary font-bold text-white"
                            title="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="app-card sticky top-24 h-fit p-6">
                <h2 className="mb-3 text-2xl font-bold">Order Summary</h2>
                <p className="subtitle mb-6 text-sm leading-6">
                  Place the order now, then complete payment from the Orders
                  page. Paid orders will move into your previous orders archive.
                </p>

                <div className="mb-6 border-t border-border pt-6">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold">Total</span>
                    <span className="text-2xl font-bold text-secondary">
                      Rs. {total}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="btn btn-primary w-full"
                >
                  Place Order
                </button>

                <Link
                  href="/menu"
                  className="mt-4 block text-center font-semibold text-secondary"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
