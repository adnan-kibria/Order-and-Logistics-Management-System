'use client'
import React, { useState } from 'react'
import { IProduct } from '../_interfaces/product.interface'
import { useCart } from '../_context/CartContext';

export default function AddToCartModal({ product }: { product: IProduct }) {
    const [quantity, setQuantity] = useState<number>(1);
    const { addToCart } = useCart();

    if (!product) return null;

    return (
        <dialog id={`my_modal_${product.id}`} className="modal modal-bottom sm:modal-middle">
            <div className="modal-box">
                <h2 className="text-xl font-semibold">{product.name}</h2>
                <p className="mb-4">
                    <span className="font-medium">Available:</span> {product.stockQty}
                </p>

                {/* Quantity Selector */}
                <div className="flex items-center justify-center gap-4 mb-6">
                    <button
                        className="btn btn-outline btn-error"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity <= 1}
                    >-</button>

                    <span className="text-lg font-bold">{quantity}</span>

                    <button
                        className="btn btn-outline btn-primary"
                        onClick={() => setQuantity(Math.min(product.stockQty, quantity + 1))}
                        disabled={quantity >= product.stockQty}
                    >+</button>
                </div>

                <div className="modal-action flex justify-between">
                    <form method="dialog">
                        <button className="btn btn-error">Cancel</button>
                    </form>
                    <form method="dialog">
                        <button
                            className="btn btn-success"
                            disabled={product.stockQty === 0}
                            onClick={() => addToCart(product.id, quantity)}
                        >
                            {product.stockQty === 0 ? 'Out of Stock' : 'Add to Cart'}
                        </button>
                    </form>
                </div>
            </div>
        </dialog>
    );
}
