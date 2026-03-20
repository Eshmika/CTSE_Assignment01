"use client";

import { useEffect, useState } from "react";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { createOrder } from "../../services/orders";
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
        <div className="min-h-screen bg-white">
            {/* Header */}
            <Navbar />

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {cart.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-lg shadow-md">
                        <p className="text-2xl mb-4" style={{ color: '#9B9B9B' }}>Your cart is empty</p>
                        <Link href="/menu" className="inline-block px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition-all" style={{ backgroundColor: '#389C9A', color: '#FFFFFF' }}>
                            Continue Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Cart Items */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                                <div className="divide-y divide-gray-200">
                                    {cart.map((item: any) => (
                                        <div
                                            key={item.id}
                                            className="p-6 hover:bg-gray-50 transition-colors duration-200"
                                        >
                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                                {/* Item Info */}
                                                <div className="grow">
                                                    <h3 className="text-lg font-semibold mb-1" style={{ color: '#1D1D1D' }}>{item.name}</h3>
                                                    <p className="text-sm mb-3" style={{ color: '#6B6B6B' }}>Unit Price: <span className="font-semibold" style={{ color: '#1D1D1D' }}>Rs. {item.price}</span></p>
                                                    <p className="font-bold text-lg" style={{ color: '#1D1D1D' }}>Subtotal: Rs. {item.price * item.quantity}</p>
                                                </div>

                                                {/* Quantity Controls */}
                                                <div className="flex items-center gap-2 rounded-lg p-2 w-fit" style={{ backgroundColor: '#F8F8F8' }}>
                                                    <button
                                                        onClick={() => removeFromCart(item.id)}
                                                        className="w-8 h-8 rounded font-bold transition-colors duration-200 flex items-center justify-center text-white hover:opacity-80"
                                                        style={{ backgroundColor: '#389C9A' }}
                                                        title="Decrease quantity"
                                                    >
                                                        −
                                                    </button>

                                                    <span className="w-8 text-center font-semibold" style={{ color: '#1D1D1D' }}>{item.quantity}</span>

                                                    <button
                                                        onClick={() => addToCart(item)}
                                                        className="w-8 h-8 rounded font-bold transition-colors duration-200 flex items-center justify-center text-white hover:opacity-80"
                                                        style={{ backgroundColor: '#389C9A', color: '#FFFFFF' }}
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

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24 h-fit">
                                <h2 className="text-2xl font-bold mb-6" style={{ color: '#1D1D1D' }}>Order Summary</h2>

                                <div className="pt-6 mb-6" style={{ borderTop: '1px solid #F8F8F8' }}>
                                    <div className="flex justify-between items-center">
                                        <span className="text-lg font-bold" style={{ color: '#1D1D1D' }}>Total</span>
                                        <span className="text-2xl font-bold" style={{ color: '#389C9A' }}>Rs. {total}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={handleCheckout}
                                    className="w-full py-3 rounded-lg font-bold hover:shadow-lg hover:scale-105 transition-all duration-300 active:scale-95 text-white"
                                    style={{ backgroundColor: '#FEDB71', color: '#1D1D1D' }}
                                >
                                    Proceed to Checkout
                                </button>

                                <Link
                                    href="/menu"
                                    className="block text-center mt-4 font-semibold hover:opacity-70 transition-colors"
                                    style={{ color: '#389C9A' }}
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