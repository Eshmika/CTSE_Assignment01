"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Navbar from "../../../components/Navbar";
import { useAuth } from "../../../context/AuthContext";
import { getPaymentByOrderId } from "../../../services/payments";

export default function PaymentDetailsPage() {
  const { token } = useAuth();
  const router = useRouter();
  const params = useParams();
  const [mounted, setMounted] = useState(false);
  const [payment, setPayment] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !token) {
      router.push("/");
    }
  }, [mounted, token, router]);

  useEffect(() => {
    const orderId = params?.orderId as string | undefined;
    if (token && orderId) {
      getPaymentByOrderId(orderId, token)
        .then(setPayment)
        .catch(() => {
          setPayment(null);
        });
    }
  }, [token, params?.orderId]);

  if (!mounted || !token) {
    return null;
  }

  return (
    <div>
      <Navbar />

      <div className="section-wrap-narrow">
        <div className="flex items-center justify-between mb-8">
          <h1 className="title-xl">Payment Details</h1>
          <Link href="/orders" className="btn btn-secondary">
            Back to Orders
          </Link>
        </div>

        {!payment ? (
          <div className="app-card p-6 subtitle">
            Payment data not found for this order.
          </div>
        ) : (
          <div className="app-card p-8 space-y-5">
            <div>
              <p className="text-sm subtitle">Order ID</p>
              <p className="text-xl font-semibold">
                {payment.orderId || params?.orderId}
              </p>
            </div>

            <div>
              <p className="text-sm subtitle">Amount</p>
              <p className="text-2xl font-bold text-teal-700">
                Rs. {payment.amount}
              </p>
            </div>

            <div>
              <p className="text-sm subtitle">Status</p>
              <span className="pill pill-created mt-2">
                {payment.status || "COMPLETED"}
              </span>
            </div>

            {payment.transactionId && (
              <div>
                <p className="text-sm subtitle">Transaction ID</p>
                <p className="font-semibold">
                  {payment.transactionId}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
