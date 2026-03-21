"use client";

import { useEffect, useState } from "react";
import { getOrderById } from "../../../services/orders";
import { getItemById } from "../../../services/catalog";
import { getPaymentByOrderId } from "../../../services/payments";
import { useAuth } from "../../../context/AuthContext";
import { useRouter, useParams } from "next/navigation";
import Navbar from "../../../components/Navbar";
import Link from "next/link";

interface CatalogItem {
    id: string;
    name?: string;
    description?: string;
    category?: string;
    price?: number;
}

interface PaymentDetails {
    reference?: string;
}

export default function OrderDetailsPage() {
    const { token } = useAuth();
    const router = useRouter();
    const params = useParams();
    const [mounted, setMounted] = useState(false);
    const [order, setOrder] = useState<any>(null);
    const [catalogItemsById, setCatalogItemsById] = useState<Record<string, CatalogItem>>({});
    const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);

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
            getPaymentByOrderId(params.id as string, token)
                .then(setPaymentDetails)
                .catch(() => setPaymentDetails(null));
        }
    }, [token, params.id]);

    useEffect(() => {
        const items = order?.items;
        if (!items || items.length === 0) {
            return;
        }

        const uniqueItemIds = [...new Set(items.map((item: any) => item.itemId))] as string[];

        Promise.all(
            uniqueItemIds.map(async (itemId) => {
                try {
                    const item = await getItemById(itemId);
                    return [itemId, item] as const;
                } catch {
                    return [itemId, null] as const;
                }
            })
        ).then((resolvedItems) => {
            const lookup: Record<string, CatalogItem> = {};
            resolvedItems.forEach(([itemId, item]) => {
                if (item) {
                    lookup[itemId] = item;
                }
            });
            setCatalogItemsById(lookup);
        });
    }, [order]);

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
                </div>

                <div className="app-card p-8 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <p className="text-sm subtitle">Order ID</p>
                            <p className="text-2xl font-bold mt-2">{paymentDetails?.reference || "Not available"}</p>
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
                        {order.items?.map((item: any) => {
                            const catalogPrice = catalogItemsById[item.itemId]?.price;
                            const unitPrice = typeof catalogPrice === "number" ? catalogPrice : item.price;

                            return (
                                <div
                                    key={item.itemId}
                                    className="app-card p-6"
                                >
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                        <div>
                                            <p className="text-lg font-semibold">
                                                {catalogItemsById[item.itemId]?.name || `Item #${item.itemId}`}
                                            </p>
                                            <p className="text-sm mt-2 subtitle">Quantity: <span className="font-semibold text-foreground">{item.quantity}</span></p>
                                            <p className="text-sm mt-1 subtitle">Unit Price: <span className="font-semibold text-foreground">Rs. {unitPrice}</span></p>
                                        </div>

                                        <div className="text-right">
                                            <p className="text-sm subtitle">Subtotal</p>
                                            <p className="text-2xl font-bold mt-2 text-secondary">
                                                Rs. {unitPrice * item.quantity}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}