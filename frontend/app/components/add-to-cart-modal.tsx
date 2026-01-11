'use client'
import React, { useState } from 'react'
import { IProduct } from '../_interfaces/product.interface'

export default function AddToCartModal({ product }: { product: IProduct }) {
    const [quantity, setQuantity] = useState<number>(1)
    const [products, setProducts] = useState<number[]>([]);
    const handleAddToCart = (productId: number) => {
        if (products.includes(productId)) {
            alert("Product already in cart");
            return;
        }
        setProducts([...products, productId]); 
    }
    console.log("Products IDs in Cart:", products);


    if (!product) return null

    return (
        <dialog id={`my_modal_${product.id}`} className="modal modal-bottom sm:modal-middle">

            <div className="modal-box">

                <h2 className="text-xl font-semibold text-gray-800 mb-2">{product.name}</h2>
                <p className="text-gray-600 mb-4">
                    <span className="font-medium">Available:</span> {product.stockQty}
                </p>

                {/* Quantity Selector */}
                <div className="flex items-center justify-center gap-4 mb-6">
                    <button
                        className="btn  btn-error"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity <= 1}
                    >
                        -
                    </button>
                    <span className="text-lg font-bold">{quantity}</span>
                    <button
                        className="btn btn-outline btn-primary"
                        onClick={() => setQuantity(Math.min(product.stockQty, quantity + 1))}
                        disabled={quantity >= product.stockQty}
                    >
                        +
                    </button>
                </div>

                {/* Action Buttons */}
                <div className="modal-action flex justify-between">
                    <form method="dialog">
                        <button className="btn btn-ghost">Cancel</button>
                    </form>
                    <form method="dialog">
                        <button
                            className="btn btn-success"
                            disabled={product.stockQty === 0}
                            onClick={() => handleAddToCart(product.id)}
                        >
                            {product.stockQty === 0 ? 'Out of Stock' : 'Add to Cart'}
                        </button>
                    </form>
                </div>
            </div>
        </dialog>
    )
}