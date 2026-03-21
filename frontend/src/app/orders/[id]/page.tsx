"use client";

import { useEffect, useState } from "react";
import { getOrderById } from "../../../services/orders";
import { useAuth } from "../../../context/AuthContext";
import { useRouter, useParams } from "next/navigation";
import Navbar from "../../../components/Navbar";
import Link from "next/link";

export default function OrderDetailsPage() {
    const { token } = useAuth();
    const router = useRouter();
    const params = useParams();
    const [mounted, setMounted] = useState(false);
    const [order, setOrder] = useState<any>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (mounted && !token) {
            router.push("/");
        }
    }, [token, mounted, router]);

    const getStatusClass = (status: string) => (status === "PAID" ? "pill pill-paid" : "pill pill-created");

    useEffect(() => {
        if (token && params.id) {
            getOrderById(params.id as string, token).then(setOrder);
        }
    }, [token, params.id]);

    if (!mounted || !token) {
        return null;
    }

    if (!order) {
        return (
            <div>
                <Navbar />
                <div className="section-wrap-narrow text-center">
                    <p className="text-lg subtitle">Loading order details...</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <Navbar />

            <div className="section-wrap">
                <div className="flex items-center justify-between mb-10">
                    <h1 className="title-xl">Order Details</h1>
                    <div className="flex items-center gap-3">
                        <Link href={`/payments/${order.id}`} className="btn btn-accent">
                            Payment Details
                        </Link>
                        <Link href="/orders" className="btn btn-secondary">
                            Back to Orders
                        </Link>
                    </div>
                </div>

                <div className="app-card p-8 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <p className="text-sm subtitle">Order ID</p>
                            <p className="text-2xl font-bold mt-2">{order.id}</p>
                        </div>
                        <div>
                            <p className="text-sm subtitle">Status</p>
                            <div className={`mt-2 ${getStatusClass(order.status)}`}>
                                {order.status}
                            </div>
                        </div>
                        <div>
                            <p className="text-sm subtitle">Total Amount</p>
                            <p className="text-2xl font-bold mt-2 text-secondary">Rs. {order.totalAmount}</p>
                        </div>
                    </div>
                </div>

                <div>
                    <h2 className="text-2xl font-bold mb-6">Order Items</h2>

                    <div className="space-y-4">
                        {order.items?.map((item: any) => (
                            <div
                                key={item.itemId}
                                className="app-card p-6"
                            >
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                    <div>
                                        <p className="text-lg font-semibold">
                                            Item #{item.itemId}
                                        </p>
                                        <p className="text-sm mt-2 subtitle">Quantity: <span className="font-semibold text-foreground">{item.quantity}</span></p>
                                        <p className="text-sm mt-1 subtitle">Unit Price: <span className="font-semibold text-foreground">Rs. {item.price}</span></p>
                                    </div>

                                    <div className="text-right">
                                        <p className="text-sm subtitle">Subtotal</p>
                                        <p className="text-2xl font-bold mt-2 text-secondary">
                                            Rs. {item.price * item.quantity}
                                        </p>
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