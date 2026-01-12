import { orderService } from "@/app/_services/order.service"

export default async function MyOrders() {
    const orders = await orderService.GetMyOrders();
    console.log("My Orders:", orders);
    return (
        <div>
            <h1>My Orders Page</h1>
        </div>
    )
}
