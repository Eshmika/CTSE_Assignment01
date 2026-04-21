"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Navbar from "../../../components/Navbar";
import { useAuth } from "../../../context/AuthContext";
import { chargePayment, getPaymentByOrderId } from "../../../services/payments";
import { getOrderById } from "../../../services/orders";
import CreativeToast from "../../../components/CreativeToast";
import { isOrderMarkedPaid, markOrderAsPaid } from "../../../lib/orderState";

export default function PaymentDetailsPage() {
  const { token } = useAuth();
  const router = useRouter();
  const params = useParams();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<any>(null);
  const [payment, setPayment] = useState<any>(null);
  const [toast, setToast] = useState<{
    title: string;
    message: string;
    tone: "success" | "info" | "warning";
  } | null>(null);
  const orderId = params?.orderId as string | undefined;
  const uiPaid = isOrderMarkedPaid(orderId);
  const isPaid = uiPaid || payment?.status === "PAID";

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !token) {
      router.push("/");
    }
  }, [mounted, token, router]);

  useEffect(() => {
    if (!token || !orderId) {
      return;
    }

    let isActive = true;
    setLoading(true);

    Promise.allSettled([
      getOrderById(orderId, token),
      getPaymentByOrderId(orderId, token),
    ]).then(([orderResult, paymentResult]) => {
      if (!isActive) {
        return;
      }

      if (orderResult.status === "fulfilled") {
        setOrder(orderResult.value);
      }

      if (paymentResult.status === "fulfilled") {
        setPayment(paymentResult.value);
      } else {
        setPayment(null);
      }

      setLoading(false);
    });

    return () => {
      isActive = false;
    };
  }, [token, orderId]);

  const handleConfirmPayment = async () => {
    if (!token || !orderId || !order) {
      return;
    }

    try {
      const chargedPayment = await chargePayment(
        {
          orderId,
          amount: order.totalAmount,
        },
        token
      );

      markOrderAsPaid(orderId);
      setPayment(chargedPayment);
      setToast({
        title: "Payment sealed",
        message: `Order ${orderId} has moved into your previous orders archive.`,
        tone: "success",
      });

      setTimeout(() => {
        router.push("/orders");
      }, 900);
    } catch (error) {
      console.error(error);
      setToast({
        title: "Payment paused",
        message:
          "We could not complete this payment right now. Please try again.",
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

      <div className="section-wrap-narrow">
        <div className="mb-8 flex items-center justify-between gap-3">
          <h1 className="title-xl">Payment Lounge</h1>
          <Link href="/orders" className="btn btn-secondary">
            Back to Orders
          </Link>
        </div>

        <div className="app-card mb-6 p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] subtitle">
            Status
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <span className={isPaid ? "pill pill-paid" : "pill pill-created"}>
              {isPaid ? "PAID" : "PAYMENT PENDING"}
            </span>
            <p className="subtitle text-sm leading-6">
              Confirm this order here, then it will move into previous orders
              automatically.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="app-card p-6 subtitle">
            Loading payment details...
          </div>
        ) : !order ? (
          <div className="app-card p-6 subtitle">
            Order data not found for this payment lounge.
          </div>
        ) : (
          <div className="app-card space-y-5 p-8">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm subtitle">Order ID</p>
                <p className="text-xl font-semibold">{order.id || orderId}</p>
              </div>

              <div>
                <p className="text-sm subtitle">Amount</p>
                <p className="text-2xl font-bold text-teal-700">
                  Rs. {order.totalAmount}
                </p>
              </div>
            </div>

            <div>
              <p className="text-sm subtitle">Reference No</p>
              <p className="font-semibold">
                {payment?.reference ||
                  "Ready to generate on payment confirmation"}
              </p>
            </div>

            {payment?.transactionId && (
              <div>
                <p className="text-sm subtitle">Transaction ID</p>
                <p className="font-semibold">{payment.transactionId}</p>
              </div>
            )}

            <div className="rounded-2xl border border-border bg-[#fffaf4] p-5">
              <p className="text-lg font-bold">Creative checkout cue</p>
              <p className="subtitle mt-2 text-sm leading-6">
                Tap the button below to seal the payment. We will keep the
                backend calls intact, but the paid badge and archive move are
                handled in the UI so the experience feels instant.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleConfirmPayment}
                disabled={isPaid}
                className="btn btn-primary"
              >
                {isPaid ? "Payment Complete" : "Seal Payment"}
              </button>
              <Link href="/orders" className="btn btn-ghost text-center">
                Return to Orders
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
