"use client";

import { useEffect, useState } from "react";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { createOrder, updateOrderStatus } from "../../services/orders";
import { chargePayment } from "../../services/payments";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "../../components/Navbar";

export default function CartPage() {
    const { cart, removeFromCart, addToCart, clearCart } = useCart();
    const { token } = useAuth();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

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

    if (!mounted || !token) {
        return null;
    }

    const handleCheckout = async () => {
        try {
            // 1. Create Order
            const orderData = {
                items: cart.map((item: any) => ({
                    itemId: item.id,
                    quantity: item.quantity,
                })),
            };

            const order = await createOrder(orderData, token);

            console.log("Order:", order);

            // 2. Call Payment
            const paymentData = {
                orderId: order.id,
                amount: order.totalAmount,
            };

            const payment = await chargePayment(paymentData, token);

            console.log("Payment:", payment);

            // 3. Update order status after successful payment
            await updateOrderStatus(order.id, "PAID", token);

            alert("Payment successful! 🎉");

            // Clear cart after successful payment
            clearCart();

            // Redirect to menu after a short delay
            setTimeout(() => {
                router.push("/menu");
            }, 500);

        } catch (err) {
            console.error(err);
            alert("Payment failed");
        }
    };

    return (
        <div>
            <Navbar />

            <div className="section-wrap">
                <h1 className="title-xl mb-8">Your Cart</h1>
                {cart.length === 0 ? (
                    <div className="app-card text-center py-16">
                        <p className="text-2xl mb-4 subtitle">Your cart is empty</p>
                        <Link href="/menu" className="btn btn-secondary inline-block">
                            Continue Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                            <div className="app-card overflow-hidden">
                                <div className="divide-y divide-gray-200">
                                    {cart.map((item: any) => (
                                        <div
                                            key={item.id}
                                            className="p-6 hover:bg-[#fff9f1] transition-colors duration-200"
                                        >
                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                                <div className="grow">
                                                    <h3 className="text-lg font-semibold mb-1">{item.name}</h3>
                                                    <p className="text-sm mb-3 subtitle">Unit Price: <span className="font-semibold text-foreground">Rs. {item.price}</span></p>
                                                    <p className="font-bold text-lg">Subtotal: Rs. {item.price * item.quantity}</p>
                                                </div>

                                                <div className="flex items-center gap-2 rounded-lg p-2 w-fit bg-muted-surface">
                                                    <button
                                                        onClick={() => removeFromCart(item.id)}
                                                        className="w-8 h-8 rounded font-bold flex items-center justify-center text-white bg-secondary"
                                                        title="Decrease quantity"
                                                    >
                                                        −
                                                    </button>

                                                    <span className="w-8 text-center font-semibold">{item.quantity}</span>

                                                    <button
                                                        onClick={() => addToCart(item)}
                                                        className="w-8 h-8 rounded font-bold flex items-center justify-center text-white bg-secondary"
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
                            <div className="app-card p-6 sticky top-24 h-fit">
                                <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

                                <div className="pt-6 mb-6 border-t border-border">
                                    <div className="flex justify-between items-center">
                                        <span className="text-lg font-bold">Total</span>
                                        <span className="text-2xl font-bold text-secondary">Rs. {total}</span>
                                    </div>
                                </div>

                                <button onClick={handleCheckout} className="btn btn-primary w-full">
                                    Proceed to Checkout
                                </button>

                                <Link href="/menu" className="block text-center mt-4 font-semibold text-secondary">
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
