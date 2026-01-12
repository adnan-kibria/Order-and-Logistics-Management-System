'use client'
import { useCart } from "@/app/_context/CartContext";
import { IProduct } from "@/app/_interfaces/product.interface";
import { orderService } from "@/app/_services/order.service";
import { ProductsService } from "@/app/_services/product.service";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CheckoutPage() {
    const { cart, clearCart } = useCart();
    const [products, setProducts] = useState<IProduct[]>([]);
    const router = useRouter();

    

    console.log("Cart Items:", cart);
    const fetchProducts = async () => {
        const products = await ProductsService.getCartProducts(cart);
        setProducts(products);
        console.log("Products in Cart:", products);
    }

    const handleCheckout = async () => {
        try {
            console.log("Placing Order with Cart Items:", cart);
            const res = await orderService.placeOrder(cart);
            console.log("Order Response:", res);
            alert("Order placed successfully!");

            
            clearCart();
            router.push('my-orders');
    
        }
        catch (err) {
            console.error("Checkout Error:", err);
        }
    }

    useEffect(() => {
        if (cart.length > 0) {
            fetchProducts();
        }
    }, []);


    return (
        <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
            <h1 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-3">Checkout</h1>
            {products.length > 0 ? (
                <ul className="space-y-4">
                    {products.map(product => (
                        <li
                            key={product.id}
                            className="border rounded-lg p-4 flex justify-between items-center hover:shadow-md transition-shadow"
                        >
                            <div>
                                <h2 className="text-lg font-semibold text-gray-700">{product.name}</h2>
                                <p className="text-sm text-gray-500">Product ID: {product.id}</p>
                            </div>
                            <div className="flex items-center space-x-6">
                                <span className="text-gray-800 font-medium">Tk {Math.round(product.price)}</span>
                                <span className="bg-gray-100 px-3 py-1 rounded-md text-sm text-gray-600">
                                    Qty: {cart.find(item => item.productId === product.id)?.qty}
                                </span>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-center text-gray-500 italic">No products in cart.</p>
            )}

            {/* Checkout Summary */}
            {products.length > 0 && (
                <div className="mt-6 border-t pt-4 flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-700">Total:</span>
                    <span className="text-xl font-bold text-green-600">
                        Tk {cart.reduce((total, item) => {
                            const product = products.find(p => p.id === item.productId);
                            return total + (Math.round(product?.price || 0) * item.qty);
                        }, 0)}
                    </span>
                </div>
            )}

            {/* Checkout Button */}
            {products.length > 0 && (
                <div className="mt-6">
                    <button onClick={handleCheckout} className="w-full bg-blue-600 hover:bg-blue-800 text-white font-semibold py-3 rounded-lg shadow-md transition-colors hover:cursor-pointer">
                        Proceed to Payment
                    </button>
                </div>
            )}
        </div>
    );
}
