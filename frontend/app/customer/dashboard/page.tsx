import { ICategory } from "@/app/_interfaces/category.interface";
import { CategoryService } from "@/app/_services/category.service";
import CategoryNavBar from "@/app/components/category-navbar";
import Products from "@/app/components/products";
import OrderNotifications from "@/app/components/pusher/order-notififcation";

export default async function CustomerDashBoard() {
    return (
        <div className="w-3/4 container mx-auto">
            <div>
                <h1 className="text-3xl text-center py-5">Categories</h1>
                <CategoryNavBar></CategoryNavBar>
                <OrderNotifications customerId={10}></OrderNotifications>
            </div>
            <div>
                {/* Products Grid */}
                <h1 className="text-3xl text-center py-5">Products</h1>
                <Products></Products>
            </div>
        </div>
    )
}
