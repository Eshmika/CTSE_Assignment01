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

    const getStatusColor = (status: string) => {
        return status === "PAID"
            ? "#389C9A"
            : "#FEDB71";
    };

    const getStatusTextColor = (status: string) => {
        return status === "PAID" ? "#FFFFFF" : "#1D1D1D";
    };

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
            <div className="min-h-screen bg-white">
                <Navbar />
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
                    <p className="text-lg" style={{ color: '#9B9B9B' }}>Loading order details...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <Navbar />

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex items-center justify-between mb-10">
                    <h1 className="text-4xl font-bold" style={{ color: '#1D1D1D' }}>📦 Order Details</h1>
                    <Link href="/orders" className="px-4 py-2 rounded-lg font-semibold hover:shadow-lg transition-all" style={{ backgroundColor: '#389C9A', color: '#FFFFFF' }}>
                        Back to Orders
                    </Link>
                </div>

                {/* Order Summary Card */}
                <div className="bg-white rounded-lg shadow-md p-8 mb-8 border-l-4" style={{ borderColor: getStatusColor(order.status) }}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <p className="text-sm" style={{ color: '#9B9B9B' }}>Order ID</p>
                            <p className="text-2xl font-bold mt-2" style={{ color: '#1D1D1D' }}>{order.id}</p>
                        </div>
                        <div>
                            <p className="text-sm" style={{ color: '#9B9B9B' }}>Status</p>
                            <div className="mt-2 inline-block px-4 py-2 rounded-lg font-semibold" style={{ backgroundColor: getStatusColor(order.status), color: getStatusTextColor(order.status) }}>
                                {order.status}
                            </div>
                        </div>
                        <div>
                            <p className="text-sm" style={{ color: '#9B9B9B' }}>Total Amount</p>
                            <p className="text-2xl font-bold mt-2" style={{ color: '#389C9A' }}>Rs. {order.totalAmount}</p>
                        </div>
                    </div>
                </div>

                {/* Items Section */}
                <div>
                    <h2 className="text-2xl font-bold mb-6" style={{ color: '#1D1D1D' }}>Order Items</h2>

                    <div className="space-y-4">
                        {order.items?.map((item: any) => (
                            <div
                                key={item.itemId}
                                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all duration-300"
                            >
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                    <div>
                                        <p className="text-lg font-semibold" style={{ color: '#1D1D1D' }}>
                                            Item #{item.itemId}
                                        </p>
                                        <p className="text-sm mt-2" style={{ color: '#6B6B6B' }}>Quantity: <span className="font-semibold" style={{ color: '#1D1D1D' }}>{item.quantity}</span></p>
                                        <p className="text-sm mt-1" style={{ color: '#6B6B6B' }}>Unit Price: <span className="font-semibold" style={{ color: '#1D1D1D' }}>Rs. {item.price}</span></p>
                                    </div>

                                    <div className="text-right">
                                        <p className="text-sm" style={{ color: '#9B9B9B' }}>Subtotal</p>
                                        <p className="text-2xl font-bold mt-2" style={{ color: '#389C9A' }}>
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