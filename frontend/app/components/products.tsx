import { IProduct } from "../_interfaces/product.interface";
import { ProductsService } from "../_services/product.service";
import Product from "./product";

export default async function Products() {
    const products: IProduct[] = await ProductsService.getAll();
    console.log(products);

    return (
        <div className="grid grid-cols-3">
            {
                products.length > 0 ? (
                    products.map(product => (
                        <Product key={product.id} product={product}></Product>
                    ))
                ) : (
                    <p>No products available.</p>
                )
            }
        </div>
    )
}
