"use client";
import { useState } from "react";
import { X, User, MapPin, Mail, Send, Loader2, Truck, ShieldCheck, Package } from "lucide-react";
import { orderService } from "../_services/order.service";

export default function OrderViewModal({ order, isOpen, onClose, deliverymen, onUpdate }: any) {
  const [loading, setLoading] = useState(false);
  const [customerEmail, setCustomerEmail] = useState(order?.customer?.email || "");
  const [staffEmail, setStaffEmail] = useState("");

  if (!isOpen || !order) return null;

  const handleStatusUpdate = async (type: string) => {
    setLoading(true);
    try {
      if (type === "confirm") await orderService.confirmOrder(order.id);
      if (type === "process") await orderService.processOrder(order.id);
      if (type === "cancel") await orderService.cancelOrder(order.id);
      await onUpdate();
      alert("Status updated successfully!");
    } catch (err) { alert("Update failed"); }
    finally { setLoading(false); }
  };

  const handleAssign = async (dmId: string) => {
    if (!dmId) return;
    setLoading(true);
    try {
      await orderService.assignDeliveryman(order.id, parseInt(dmId));
      const dm = deliverymen.find((d: any) => d.id === parseInt(dmId));
      if (dm) setStaffEmail(dm.user.email);
      await onUpdate();
      alert("Deliveryman assigned!");
    } catch (err) { alert("Assignment failed"); }
    finally { setLoading(false); }
  };

  const sendNotification = async (target: 'customer' | 'staff') => {
    setLoading(true);
    try {
      if (target === 'customer') {
        // userId from your backend param requirement
        await orderService.sendMailToCustomer(order.customer.userId, customerEmail);
        alert("Pusher notification & Email sent to Customer!");
      } else {
        await orderService.sendMailToDM(order.id, staffEmail);
        alert("Pusher notification & Email sent to Deliveryman!");
      }
    } catch (err) { alert("Email failed to send"); }
    finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b flex justify-between items-center bg-gray-50">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Order # {order.id}</h2>
            <p className="text-sm text-gray-500">Manage status and logistics</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full"><X /></button>
        </div>

        <div className="p-6 overflow-y-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Column 1: Customer & Shipping */}
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 font-bold text-gray-700 border-b pb-2"><User size={18}/> Information</h3>
            <div className="bg-gray-50 p-4 rounded-xl space-y-2">
                <p className="font-bold">{order.customer?.name}</p>
                <p className="text-sm text-gray-600">{order.customer?.phone}</p>
                <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-xs font-bold text-gray-400 uppercase">Shipping Address</p>
                    <p className="text-sm mt-1">{order.customer?.shippingAddress?.details}, {order.customer?.shippingAddress?.location}, {order.customer?.shippingAddress?.city}</p>
                </div>
            </div>
            
            <div className="pt-4">
                <p className="text-xs font-bold text-gray-400 uppercase mb-2">Order Status</p>
                <div className="flex flex-wrap gap-2">
                    <button onClick={() => handleStatusUpdate('confirm')} className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-xs font-bold hover:bg-green-200">Confirm</button>
                    <button onClick={() => handleStatusUpdate('process')} className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-xs font-bold hover:bg-blue-200">Process</button>
                    <button onClick={() => handleStatusUpdate('cancel')} className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-xs font-bold hover:bg-red-200">Cancel</button>
                </div>
            </div>
          </div>

          {/* Column 2: Items & Financials */}
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 font-bold text-gray-700 border-b pb-2"><Package size={18}/> Order Items</h3>
            <div className="border rounded-xl overflow-hidden">
                <table className="w-full text-xs">
                    <thead className="bg-gray-50">
                        <tr><th className="p-2 text-left">Item</th><th className="p-2">Qty</th><th className="p-2 text-right">Price</th></tr>
                    </thead>
                    <tbody className="divide-y">
                        {order.orderDetails?.map((item: any) => (
                            <tr key={item.id}><td className="p-2">{item.product?.name}</td><td className="p-2 text-center">{item.qty}</td><td className="p-2 text-right">Tk. {item.orderPrice}</td></tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="bg-indigo-50 p-4 rounded-xl text-right space-y-1">
                <p className="text-xs text-gray-500">Product Total: Tk. {order.productTotal}</p>
                <p className="text-xs text-gray-500">Shipping: Tk. {order.shippingCharge}</p>
                <p className="text-lg font-black text-indigo-700">Grand Total: Tk. {order.total}</p>
            </div>
          </div>

          {/* Column 3: Logistics & Email Notifications */}
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 font-bold text-gray-700 border-b pb-2"><Truck size={18}/> Logistics</h3>
            
            <div className="space-y-4">
                {/* Deliveryman Assignment */}
                <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase">Assign Deliveryman</label>
                    <select 
                        className="w-full mt-1 p-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                        value={order.deliveryman?.id || ""}
                        onChange={(e) => handleAssign(e.target.value)}
                    >
                        <option value="">Select Staff</option>
                        {deliverymen.map((dm: any) => (
                            <option key={dm.id} value={dm.id}>{dm.name}</option>
                        ))}
                    </select>
                </div>

                {/* Notify Customer */}
                <div className="p-4 border rounded-xl bg-orange-50/30 border-orange-100">
                    <label className="text-[10px] font-bold text-orange-700 uppercase">Notify Customer</label>
                    <div className="flex gap-2 mt-1">
                        <input type="email" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} className="flex-1 p-2 text-xs border rounded-lg" placeholder="Customer Email" />
                        <button onClick={() => sendNotification('customer')} className="p-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"><Send size={14}/></button>
                    </div>
                </div>

                {/* Notify Deliveryman */}
                <div className="p-4 border rounded-xl bg-green-50/30 border-green-100">
                    <label className="text-[10px] font-bold text-green-700 uppercase">Notify Deliveryman</label>
                    <div className="flex gap-2 mt-1">
                        <input type="email" value={staffEmail} onChange={(e) => setStaffEmail(e.target.value)} className="flex-1 p-2 text-xs border rounded-lg" placeholder="Staff Email" />
                        <button onClick={() => sendNotification('staff')} className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700"><Send size={14}/></button>
                    </div>
                </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}