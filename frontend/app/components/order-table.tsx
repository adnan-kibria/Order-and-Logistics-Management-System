"use client";
import { useState } from "react";
import { Eye, Check, X, Truck, Loader2, Mail, Clock } from "lucide-react";
import { orderService } from "../_services/order.service";
import OrderViewModal from "../components/order-details-modal";

export default function OrderTable({ initialOrders, deliverymen }: any) {
  const [orders, setOrders] = useState(initialOrders);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [loadingId, setLoadingId] = useState<number | null>(null);

  const refreshData = async () => {
    const updated = await orderService.getOrders();
    setOrders(updated);
  };

  const handleAction = async (id: number, type: string) => {
    setLoadingId(id);
    try {
      if (type === "confirm") await orderService.confirmOrder(id);
      if (type === "cancel") await orderService.cancelOrder(id);
      await refreshData();
    } catch (err: any) {
      alert(err.response?.data?.message || "Action failed");
    } finally {
      setLoadingId(null);
    }
  };

  const handleAssign = async (orderId: number, dm: any) => {
    if (!dm) return;
    setLoadingId(orderId);
    try {
      await OrderService.assignAndMail(orderId, dm.id, dm.user.email);
      await refreshData();
      alert("Deliveryman assigned and email notification sent!");
    } catch (err: any) {
      alert(err.response?.data?.message || "Assignment failed");
    } finally {
      setLoadingId(null);
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status?.toLowerCase()) {
      case "delivered": return "bg-green-100 text-green-700 border-green-200";
      case "cancelled": return "bg-red-100 text-red-700 border-red-200";
      case "on the way": return "bg-blue-100 text-blue-700 border-blue-200";
      case "processing": return "bg-orange-100 text-orange-700 border-orange-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50/50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">ID & Date</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Customer</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Amount</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Logistics</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase text-center">Manage</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map((order: any) => (
              <tr key={order.id} className="hover:bg-indigo-50/30 transition-colors">
                <td className="px-6 py-4">
                  <p className="font-bold text-gray-900">#{order.id}</p>
                  <p className="text-[10px] text-gray-400 flex items-center gap-1 mt-1">
                    <Clock size={10}/> {new Date(order.date).toLocaleDateString()}
                  </p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm font-medium text-gray-800">{order.customer?.name}</p>
                  <p className="text-xs text-gray-500">{order.customer?.phone}</p>
                </td>
                <td className="px-6 py-4 font-mono font-bold text-indigo-600">${order.total}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-black border uppercase tracking-wider ${getStatusStyle(order.orderStatus?.name)}`}>
                    {order.orderStatus?.name || "Placed"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <select 
                    disabled={loadingId === order.id || [7, 9].includes(order.orderStatus?.id)}
                    className="text-xs bg-gray-50 border border-gray-200 rounded-lg p-2 outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                    value={order.deliveryman?.id || ""}
                    onChange={(e) => {
                      const dm = deliverymen.find((d: any) => d.id === parseInt(e.target.value));
                      handleAssign(order.id, dm);
                    }}
                  >
                    <option value="">Select Staff</option>
                    {deliverymen.map((dm: any) => (
                      <option key={dm.id} value={dm.id}>{dm.name}</option>
                    ))}
                  </select>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-center gap-1">
                    <button onClick={() => setSelectedOrder(order)} className="p-2 text-gray-600 hover:bg-white hover:shadow-md rounded-xl transition-all" title="View Detail"><Eye size={18}/></button>
                    {order.orderStatus?.id !== 7 && order.orderStatus?.id !== 9 && (
                      <>
                        <button onClick={() => handleAction(order.id, "confirm")} className="p-2 text-green-600 hover:bg-green-50 rounded-xl" title="Confirm Order"><Check size={18}/></button>
                        <button onClick={() => handleAction(order.id, "cancel")} className="p-2 text-red-600 hover:bg-red-50 rounded-xl" title="Cancel Order"><X size={18}/></button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <OrderViewModal 
        isOpen={!!selectedOrder} 
        order={selectedOrder} 
        onClose={() => setSelectedOrder(null)} 
      />
    </div>
  );
}