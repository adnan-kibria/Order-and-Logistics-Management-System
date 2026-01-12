import OrderTable from "../../components/order-table";
import { orderService } from "@/app/_services/order.service";

export default async function OrderPage() {
  let initialOrders = [];
  let deliverymen = [];

  try {
    // SSR Data Fetching
    const [orders, dms] = await Promise.all([
      orderService.getOrders(),
      orderService.getDeliverymen()
    ]);
    initialOrders = orders;
    deliverymen = dms;
  } catch (error) {
    console.error("Fetch error:", error);
  }

  return (
    <div className="p-8 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Orders</h1>
          <p className="text-gray-500 mt-2">Manage logistics, track statuses, and assign staff.</p>
        </div>
      </div>

      <OrderTable initialOrders={initialOrders} deliverymen={deliverymen} />
    </div>
  );
}