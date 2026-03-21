"use client";

import { useEffect, useState } from "react";
import { getMyOrders } from "../../services/orders";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "../../components/Navbar";

interface PaymentDetails {
    reference: string;
}

interface OrderWithPayment {
    id: string;
    totalAmount: number;
    status: string;
    [key: string]: any;
    paymentDetails?: PaymentDetails;
}

export default function OrdersPage() {
    const { token } = useAuth();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [orders, setOrders] = useState<OrderWithPayment[]>([]);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (mounted && !token) {
            router.push("/");
        }
    }, [token, mounted, router]);

    const getStatusClass = (status: string) => (status === "PAID" ? "pill pill-paid" : "pill pill-created");

    const fetchPaymentDetails = async (orderId: string, authToken: string): Promise<PaymentDetails | null> => {
        try {
            const response = await fetch(`http://localhost:8080/payments/${orderId}`, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });
            if (response.ok) {
                return await response.json();
            }
        } catch (error) {
            console.error(`Failed to fetch payment details for order ${orderId}:`, error);
        }
        return null;
    };

    useEffect(() => {
        if (token) {
            getMyOrders(token).then(async (fetchedOrders) => {
                const ordersWithPayments = await Promise.all(
                    fetchedOrders.map(async (order: any) => ({
                        ...order,
                        paymentDetails: await fetchPaymentDetails(order.id, token),
                    }))
                );
                setOrders(ordersWithPayments);
            });
        }
    }, [token]);

    if (!mounted || !token) {
        return null;
    }

    return (
        <div>
            <Navbar />

            <div className="section-wrap-narrow">
                <h1 className="title-xl mb-9">My Orders</h1>

                {orders.length === 0 ? (
                    <div className="app-card text-center py-12">
                        <p className="text-lg mb-6 subtitle">No orders yet</p>
                        <Link href="/menu" className="btn btn-secondary inline-block">
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order: OrderWithPayment) => (
                            <Link key={order.id} href={`/orders/${order.id}`}>
                                <div className="app-card p-6 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                        <div>
                                            <p className="text-lg font-semibold">
                                                Reference: {order.paymentDetails?.reference || "Loading..."}
                                            </p>
                                            <p className="text-sm mt-2 subtitle">Total Amount</p>
                                            <p className="text-2xl font-bold mt-1 text-teal-700">Rs. {order.totalAmount}</p>
                                        </div>

                                        <div className={getStatusClass(order.status || "CREATED")}>
                                            {order.status || "CREATED"}
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
