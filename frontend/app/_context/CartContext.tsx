'use client';
import { createContext, useContext, useState } from "react";
import { ICartItem } from "../_interfaces/order/cart-item.interface";

type CartContextType = {
    cart: ICartItem[];
    addToCart: (productId: number, qty: number) => void;
    clearCart: () => void;
};

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
    const [cart, setCart] = useState<ICartItem[]>([]);

    const addToCart = (productId: number, qty: number) => {
        setCart((prev) => {
            const existing = prev.find(item => item.productId === productId);
            if (existing) {
                return prev.map(item =>
                    item.productId === productId
                        ? { ...item, qty: item.qty + qty }
                        : item
                );
            }
            return [...prev, { productId, qty }];
        });
    };

    const clearCart = () => setCart([]);

    return (
        <CartContext.Provider value={{ cart, addToCart, clearCart }}>
            {children}
        </CartContext.Provider>
    );
}
export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error("useCart must be used inside CartProvider");
    return context;
};