import { AdminService } from "@/app/_services/admin.service";
import { OrderActionWrapper } from "@/app/components/order-action"; // Small interactive part

export default async function OrderPage() {
  let orders: any = [];
  let deliverymen = [];

  try {
    // 1. Fetch data on the Server
    const [ordersData, dmsData] = await Promise.all([
      AdminService.getAllOrders(),
      AdminService.getDeliverymen()
    ]);
    orders = ordersData;
    deliverymen = dmsData;
  } catch (error) {
    console.error("Fetch error:", error);
  }

  const formatDate = (date: any) => 
    date ? new Date(date).toLocaleString('en-GB') : "-";

  return (
    <div className="p-8 space-y-6 bg-gray-50 min-h-screen">
      <header>
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Orders</h1>
        <p className="text-gray-500 mt-2">Manage logistics and track statuses.</p>
      </header>

      {/* 2. The Table stays here in page.tsx */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-semibold">
              <tr>
                <th className="px-6 py-4">Order ID & Date</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Total Amount</th>
                <th className="px-6 py-4">Cancelled By/At</th>
                <th className="px-6 py-4">Delivered At</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">View</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((order: any) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-bold text-gray-900">#{order.id}</span>
                    <p className="text-[10px] text-gray-400">{formatDate(order.date)}</p>
                  </td>
                  <td className="px-6 py-4 font-medium">{order.customer?.name}</td>
                  <td className="px-6 py-4 font-mono font-bold text-indigo-600">
                    Tk. {order.total}
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-500">
                  {order.cancelledBy ? (
                    <div>
                      <p className="text-red-600 font-bold">{order.cancelledBy}</p>
                      <p>{formatDate(order.cancelledAt)}</p>
                    </div>
                  ) : "-"}
                </td>
                <td className="px-6 py-4 text-xs text-gray-500">{formatDate(order.deliveredAt)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                      order.orderStatus?.id === 7 ? "bg-red-100 text-red-700" : 
                      order.orderStatus?.id === 9 ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                    }`}>
                      {order.orderStatus?.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {/* 3. This small wrapper handles the Modal logic */}
                    <OrderActionWrapper order={order} deliverymen={deliverymen} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}