'use client'
import { IProduct } from '../_interfaces/product.interface'

export default function AddToCartButton({ product }: { product: IProduct }) {
    return (
        <button
            className="btn btn-primary w-full"
            disabled={product.stockQty === 0}
            onClick={() => document.getElementById(`my_modal_${product.id}`).showModal()}
        >
            {product.stockQty === 0 ? "Unavailable" : "Add To Cart"}
        </button>
    )
}
