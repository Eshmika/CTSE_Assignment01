"use client";

import { useEffect, useState } from "react";
import { getMyOrders } from "../../services/orders";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "../../components/Navbar";

export default function OrdersPage() {
    const { token } = useAuth();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (mounted && !token) {
            router.push("/");
        }
    }, [token, mounted, router]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case "PAID":
                return "#389C9A";
            case "CREATED":
                return "#FEDB71";
            default:
                return "#9B9B9B";
        }
    };

    useEffect(() => {
        if (token) {
            getMyOrders(token).then(setOrders);
        }
    }, [token]);

    if (!mounted || !token) {
        return null;
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <Navbar />

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-4xl font-bold mb-12" style={{ color: '#1D1D1D' }}>📜 My Orders</h1>

                {orders.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg shadow-md">
                        <p className="text-lg mb-6" style={{ color: '#9B9B9B' }}>No orders yet</p>
                        <Link href="/menu" className="inline-block px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all" style={{ backgroundColor: '#389C9A', color: '#FFFFFF' }}>
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order: any) => (
                            <Link key={order.id} href={`/orders/${order.id}`}>
                                <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg hover:scale-102 transition-all duration-300 cursor-pointer border-l-4" style={{ borderColor: getStatusColor(order.status) }}>
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                        <div>
                                            <p className="text-lg font-semibold" style={{ color: '#1D1D1D' }}>Order #{order.id}</p>
                                            <p className="text-sm mt-2" style={{ color: '#6B6B6B' }}>Total Amount</p>
                                            <p className="text-2xl font-bold mt-1" style={{ color: '#389C9A' }}>Rs. {order.totalAmount}</p>
                                        </div>

                                        {/* Status Badge */}
                                        <div className="px-4 py-2 rounded-lg font-semibold text-white" style={{ backgroundColor: getStatusColor(order.status), color: order.status === "CREATED" ? '#1D1D1D' : '#FFFFFF' }}>
                                            {order.status}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}