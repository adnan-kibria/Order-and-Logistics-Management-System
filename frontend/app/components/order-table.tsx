"use client";
import { useState } from "react";
import { Eye, Calendar, User, Package } from "lucide-react";
import OrderViewModal from "./order-details-modal";
import { orderService } from "../_services/order.service";

export default function OrderTable({ initialOrders, deliverymen }: any) {
  const [orders, setOrders] = useState(initialOrders);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const refreshData = async () => {
    const updated = await orderService.getOrders();
    setOrders(updated);
  };

  const formatDate = (date: any) => date ? new Date(date).toLocaleString('en-GB') : "-";

  return (
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
                <td className="px-6 py-4 font-mono font-bold text-indigo-600">Tk. {order.total}</td>
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
                  <button onClick={() => setSelectedOrder(order)} className="p-2 bg-gray-100 hover:bg-indigo-600 hover:text-white rounded-lg transition-all">
                    <Eye size={18}/>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <OrderViewModal 
        isOpen={!!selectedOrder} 
        order={selectedOrder} 
        deliverymen={deliverymen}
        onClose={() => setSelectedOrder(null)} 
        onUpdate={refreshData}
      />
    </div>
  );
}