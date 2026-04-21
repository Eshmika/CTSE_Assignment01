"use client";

import { useEffect, useMemo, useState } from "react";
import { getMyOrders } from "../../services/orders";
import { getPaymentByOrderId } from "../../services/payments";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import { getPaidOrderIds } from "../../lib/orderState";

interface PaymentDetails {
  reference: string;
}

interface OrderWithPayment {
  id: string;
  totalAmount: number;
  status: string;
  [key: string]: any;
  paymentDetails?: PaymentDetails;
  isPaid?: boolean;
}

export default function OrdersPage() {
  const { token } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [orders, setOrders] = useState<OrderWithPayment[]>([]);
  const [paidOrderIds, setPaidOrderIds] = useState<string[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !token) {
      router.push("/");
    }
  }, [token, mounted, router]);

  const getStatusClass = (status: string) =>
    status === "PAID" ? "pill pill-paid" : "pill pill-created";

  useEffect(() => {
    if (!token) {
      return;
    }

    let isActive = true;

    const loadOrders = async () => {
      try {
        const fetchedOrders = await getMyOrders(token);
        const ordersWithPayments = await Promise.all(
          fetchedOrders.map(async (order: any) => {
            let paymentDetails: PaymentDetails | null = null;

            try {
              paymentDetails = await getPaymentByOrderId(order.id, token);
            } catch (error) {
              console.error(
                `Failed to fetch payment details for order ${order.id}:`,
                error
              );
            }

            return {
              ...order,
              paymentDetails,
            };
          })
        );

        if (isActive) {
          setOrders(ordersWithPayments);
        }
      } catch (error) {
        console.error("Failed to load orders:", error);
        if (isActive) {
          setOrders([]);
        }
      }
    };

    loadOrders();
    setPaidOrderIds(getPaidOrderIds());

    const handleStorageChange = () => {
      setPaidOrderIds(getPaidOrderIds());
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      isActive = false;
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [token]);

  const ordersWithUiStatus = useMemo(
    () =>
      orders.map((order) => ({
        ...order,
        isPaid: paidOrderIds.includes(order.id) || order.status === "PAID",
      })),
    [orders, paidOrderIds]
  );

  const pendingOrders = ordersWithUiStatus.filter((order) => !order.isPaid);
  const previousOrders = ordersWithUiStatus.filter((order) => order.isPaid);

  if (!mounted || !token) {
    return null;
  }

  return (
    <div>
      <Navbar />

      <div className="section-wrap-narrow">
        <div className="mb-9 flex flex-col gap-2">
          <h1 className="title-xl">My Orders</h1>
          <p className="subtitle">
            Pay pending orders first. Once payment is confirmed, they slide into
            your previous orders archive.
          </p>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="app-card p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] subtitle">
              Pending payments
            </p>
            <p className="mt-2 text-3xl font-black text-secondary">
              {pendingOrders.length}
            </p>
          </div>
          <div className="app-card p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] subtitle">
              Previous orders
            </p>
            <p className="mt-2 text-3xl font-black text-primary">
              {previousOrders.length}
            </p>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="app-card py-12 text-center">
            <p className="subtitle mb-6 text-lg">No orders yet</p>
            <Link href="/menu" className="btn btn-secondary inline-block">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            <section className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-2xl font-bold">Proceed to Payment</h2>
                <span className="pill pill-created">
                  {pendingOrders.length} waiting
                </span>
              </div>

              {pendingOrders.length === 0 ? (
                <div className="app-card p-6 subtitle">
                  No pending orders. Everything is already paid.
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingOrders.map((order: OrderWithPayment) => (
                    <Link key={order.id} href={`/payments/${order.id}`}>
                      <div className="app-card cursor-pointer p-6 transition-all duration-300 hover:-translate-y-0.5">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <p className="text-lg font-semibold">
                              Reference:{" "}
                              {order.paymentDetails?.reference ||
                                "Ready for payment"}
                            </p>
                            <p className="subtitle mt-2 text-sm">
                              Total Amount
                            </p>
                            <p className="mt-1 text-2xl font-bold text-teal-700">
                              Rs. {order.totalAmount}
                            </p>
                            <p className="mt-2 text-sm subtitle">
                              Tap through to confirm payment and archive this
                              order.
                            </p>
                          </div>

                          <div className="flex flex-col items-start gap-3 sm:items-end">
                            <div
                              className={getStatusClass(
                                order.status || "CREATED"
                              )}
                            >
                              {order.status || "CREATED"}
                            </div>
                            <span className="btn btn-primary">Pay now</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </section>

            <section className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-2xl font-bold">Previous Orders</h2>
                <span className="pill pill-paid">
                  {previousOrders.length} archived
                </span>
              </div>

              {previousOrders.length === 0 ? (
                <div className="app-card p-6 subtitle">
                  Your paid orders will appear here after checkout is completed.
                </div>
              ) : (
                <div className="space-y-4">
                  {previousOrders.map((order: OrderWithPayment) => (
                    <Link key={order.id} href={`/orders/${order.id}`}>
                      <div className="app-card cursor-pointer p-6 transition-all duration-300 hover:-translate-y-0.5">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <p className="text-lg font-semibold">
                              Reference:{" "}
                              {order.paymentDetails?.reference || "Paid order"}
                            </p>
                            <p className="subtitle mt-2 text-sm">
                              Total Amount
                            </p>
                            <p className="mt-1 text-2xl font-bold text-teal-700">
                              Rs. {order.totalAmount}
                            </p>
                            <p className="mt-2 text-sm subtitle">
                              This order has already been paid and moved to your
                              archive.
                            </p>
                          </div>

                          <div className="flex flex-col items-start gap-3 sm:items-end">
                            <div className={getStatusClass("PAID")}>PAID</div>
                            <span className="btn btn-secondary">
                              View receipt
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
