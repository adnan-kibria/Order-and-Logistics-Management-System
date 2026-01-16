"use client";
import { useState } from "react";
import { X, User, MapPin, Mail, Send, Truck, Package } from "lucide-react";
import { orderService } from "../_services/order.service";

export default function OrderViewModal({ order, isOpen, onClose, deliverymen, onUpdate }: any) {
  const [loading, setLoading] = useState(false);
  const [emails, setEmails] = useState({ 
    customer: order?.customer?.email || "", 
    staff: "" 
  });

  if (!isOpen || !order) return null;

  const addr = order.customer?.shippingAddress || order.profile?.shippingAddress;
  const fullAddress = addr ? `${addr.details || ''} ${addr.location || ''} ${addr.city || ''}`.trim() : null;

  const handleAction = async (actionFn: () => Promise<any>, successMsg: string) => {
    setLoading(true);
    try {
      await actionFn();
      await onUpdate();
      alert(successMsg);
    } catch (err) {
      alert("Action failed");
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = (dmId: string) => {
    if (!dmId) return;
    handleAction(async () => {
      await orderService.assignDeliveryman(order.id, parseInt(dmId));
      // Auto-fill the staff email field when a name is selected
      const dm = deliverymen.find((d: any) => (d.userId || d.id) === parseInt(dmId));
      setEmails(prev => ({ ...prev, staff: dm?.email || dm?.user?.email || "" }));
    }, "Deliveryman assigned!");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col font-sans text-gray-800">
        
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center bg-gray-50/50">
          <div>
            <h2 className="text-xl font-bold">Order Details</h2>
            <p className="text-xs text-gray-500">ID: #{order.id}</p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-full transition-colors"><X /></button>
        </div>

        <div className="p-6 overflow-y-auto grid md:grid-cols-2 gap-8">
          
          {/* Column 1: Customer & Address */}
          <div className="space-y-6">
            <section>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <User size={14}/> Customer
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <p className="font-bold">{order.customer?.name || "No Name"}</p>
                <p className="text-sm text-gray-600 flex items-center gap-1"><Mail size={12}/> {order.customer?.email}</p>
                
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1 mb-1">
                    <MapPin size={10}/> Shipping To
                  </p>
                  <p className="text-sm text-gray-700 leading-snug">
                    {fullAddress || <span className="text-red-400 italic">No address provided</span>}
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <Package size={14}/> Items Ordered
              </h3>
              <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
                <div className="divide-y max-h-48 overflow-y-auto">
                  {order.orderDetails?.map((item: any) => (
                    <div key={item.id} className="p-3 flex justify-between items-center text-sm">
                      <span className="font-medium">{item.product?.name} <span className="text-gray-400 text-xs ml-1">×{item.qty}</span></span>
                      <span className="text-gray-600 font-semibold">Tk {item.orderPrice}</span>
                    </div>
                  ))}
                </div>
                <div className="p-3 bg-indigo-600 text-white flex justify-between items-center font-bold">
                  <span className="text-xs uppercase">Grand Total</span>
                  <span className="text-lg">Tk {order.total}</span>
                </div>
              </div>
            </section>
          </div>

          {/* Column 2: Management & Notifications */}
          <div className="space-y-6">
            <section className="space-y-4">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <Truck size={14}/> Dispatch & Status
              </h3>
              
              <div className="space-y-3">
                {/* Select by Name */}
                <div>
                  <label className="text-[10px] font-bold text-gray-500 block mb-1">Assign Delivery Staff</label>
                  <select 
                    className="w-full p-2.5 border rounded-md text-sm bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={order.deliveryman?.id || ""}
                    onChange={(e) => handleAssign(e.target.value)}
                    disabled={loading}
                  >
                    <option value="">-- Select by Name --</option>
                    {deliverymen.map((dm: any) => (
                      <option key={dm.userId || dm.id} value={dm.userId || dm.id}>
                        {/* Prioritizes Name over Email */}
                        {dm.profile?.name || dm.name || dm.email}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-2">
                  <button onClick={() => handleAction(() => orderService.confirmOrder(order.id), "Confirmed")} className="flex-1 py-2 bg-green-600 text-white text-xs font-bold rounded shadow-sm hover:bg-green-700">Confirm</button>
                  <button onClick={() => handleAction(() => orderService.processOrder(order.id), "Processing")} className="flex-1 py-2 bg-blue-600 text-white text-xs font-bold rounded shadow-sm hover:bg-blue-700">Process</button>
                  <button onClick={() => handleAction(() => orderService.cancelOrder(order.id), "Cancelled")} className="flex-1 py-2 bg-red-50 text-red-600 text-xs font-bold rounded hover:bg-red-100 border border-red-200">Cancel</button>
                </div>
              </div>
            </section>

            <section className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-4">
               <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Send Email Notifications</h3>
               <div className="space-y-3">
                 <div className="flex gap-2">
                   <input className="flex-1 p-2 text-xs border rounded bg-white" value={emails.customer} onChange={e => setEmails({...emails, customer: e.target.value})} placeholder="Customer Email" />
                   <button onClick={() => handleAction(async () => orderService.sendMailToCustomer(order.customer.userId, emails.customer), "Sent!")} className="p-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition-colors" title="Send to Customer"><Send size={14}/></button>
                 </div>
                 <div className="flex gap-2">
                   <input className="flex-1 p-2 text-xs border rounded bg-white" value={emails.staff} onChange={e => setEmails({...emails, staff: e.target.value})} placeholder="Staff Email (Auto-filled)" />
                   <button onClick={() => handleAction(async () => orderService.sendMailToDM(order.id, emails.staff), "Sent!")} className="p-2 bg-gray-700 text-white rounded hover:bg-gray-800 transition-colors" title="Send to Staff"><Send size={14}/></button>
                 </div>
               </div>
            </section>
          </div>

        </div>
      </div>
    </div>
  );
}