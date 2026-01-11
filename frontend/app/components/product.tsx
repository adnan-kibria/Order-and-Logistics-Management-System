import { IProduct } from '../_interfaces/product.interface'
import AddToCartButton from './add-to-cart-btn'
import AddToCartModal from './add-to-cart-modal'

export default function Product({ product }: { product?: IProduct }) {
    if (!product) return null

    return (
        <div className="card w-96 bg-base-100 shadow-md border border-gray-200 m-4">
            <div className="card-body">
                <h2 className="card-title text-lg font-semibold text-gray-800">
                    {product.name}
                    {product.discount && product.discount > 0 && (
                        <span className="badge badge-secondary ml-2">
                            -{product.discount}%
                        </span>
                    )}
                </h2>

                <p className="text-gray-700">
                    <span className="font-medium">Price:</span> Tk {product.price}
                </p>

                <p className="text-gray-700">
                    <span className="font-medium">Stock:</span>{" "}
                    {product.stockQty > 0 ? (
                        <span className="text-green-600">{product.stockQty} available</span>
                    ) : (
                        <span className="text-red-600">Out of stock</span>
                    )}
                </p>

                <div className="card-actions justify-end mt-4">
                    <AddToCartButton product={product}></AddToCartButton>
                    <AddToCartModal product={product}></AddToCartModal>
                </div>
            </div>
        </div>
    )
}