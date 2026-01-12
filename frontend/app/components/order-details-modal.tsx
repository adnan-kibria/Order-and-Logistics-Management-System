"use client";
import { X, Package, User, MapPin, Calendar } from "lucide-react";

export default function OrderViewModal({ order, isOpen, onClose }: any) {
  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">Order # {order.id} Details</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full"><X /></button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6">
          {/* Customer & Shipping */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-400 flex items-center gap-2"><User size={16}/> Customer</h3>
              <p className="font-medium">{order.customer?.name}</p>
              <p className="text-sm text-gray-600">{order.customer?.phone}</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-400 flex items-center gap-2"><MapPin size={16}/> Delivery</h3>
              <p className="text-sm">{order.customer?.shippingAddress?.details}, {order.customer?.shippingAddress?.city}, {order.customer?.shippingAddress?.location}</p>
            </div>
          </div>

          {/* Product List */}
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-2 text-left">Product</th>
                  <th className="px-4 py-2 text-center">Qty</th>
                  <th className="px-4 py-2 text-right">Price</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {order.orderDetails?.map((item: any) => (
                  <tr key={item.id}>
                    <td className="px-4 py-2">{item.product?.name}</td>
                    <td className="px-4 py-2 text-center">{item.qty}</td>
                    <td className="px-4 py-2 text-right">${item.orderPrice}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Financials */}
          <div className="space-y-2 text-right border-t pt-4">
            <p className="text-sm text-gray-600">Product Total: ${order.productTotal}</p>
            <p className="text-sm text-gray-600">Shipping: ${order.shippingCharge}</p>
            <p className="text-lg font-bold text-indigo-600">Grand Total: ${order.total}</p>
          </div>
        </div>
      </div>
    </div>
  );
}