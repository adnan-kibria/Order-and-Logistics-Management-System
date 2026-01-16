"use client";
import { useState } from "react";
import { X, User, MapPin, Mail, Send, Truck, Package } from "lucide-react";
import { orderService } from "../_services/order.service";

export default function OrderViewModal({ order, isOpen, onClose, deliverymen, onUpdate }: any) {
  const [loading, setLoading] = useState(false);
  const [emails, setEmails] = useState({ 
    customer: order?.customer?.user?.email || order?.customer?.email || "", 
    staff: order?.deliveryman?.user?.email || "" 
  });

  if (!isOpen || !order) return null;

  // Shipping Address Lookup based on your Entities
  const addr = order.customer?.shippingAddress;
  const displayAddress = addr 
    ? `${addr.details || ''} ${addr.location || ''} ${addr.city || ''}`.trim() 
    : null;

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
      const dm = deliverymen.find((d: any) => (d.id === parseInt(dmId)));
      setEmails(prev => ({ ...prev, staff: dm?.user?.email || "" }));
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
          
          <div className="space-y-6">
            {/* Customer Section */}
            <section>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <User size={14}/> Customer
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <p className="font-bold">{order.customer?.name || "No Name"}</p>
                <p className="text-sm text-gray-600 flex items-center gap-1"><Mail size={12}/> {order.customer?.user?.email || order.customer?.email}</p>
                
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1 mb-1">
                    <MapPin size={10}/> Shipping To
                  </p>
                  <p className="text-sm text-gray-700 leading-snug">
                    {displayAddress || <span className="text-red-400 italic">No address found in DB</span>}
                  </p>
                </div>
              </div>
            </section>

            {/* Items Section - FIXED LOGIC HERE */}
            <section>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <Package size={14}/> Items Summary
              </h3>
              <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
                <div className="divide-y max-h-60 overflow-y-auto">
                  {/* We check both cases for property naming */}
                  {(order.orderDetails || order.order_details)?.length > 0 ? (
                    (order.orderDetails || order.order_details).map((item: any) => (
                      <div key={item.id} className="p-3 flex justify-between items-center text-sm">
                        <span className="font-medium text-gray-700">
                          {item.product?.name || "Unknown Product"} 
                          <span className="text-gray-400 text-xs ml-2 font-bold">×{item.qty}</span>
                        </span>
                        <span className="text-indigo-600 font-bold">Tk {item.orderPrice}</span>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-400 text-sm italic">No items found for this order</div>
                  )}
                </div>
                <div className="p-3 bg-gray-50 border-t border-gray-200 flex justify-between items-center font-bold text-gray-900">
                  <span className="text-xs uppercase">Grand Total</span>
                  <span className="text-lg">Tk {order.total}</span>
                </div>
              </div>
            </section>
          </div>

          {/* Column 2: Management */}
          <div className="space-y-6">
            <section className="space-y-4">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <Truck size={14}/> Dispatch & Status
              </h3>
              
              <div className="space-y-3">
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
                      <option key={dm.id} value={dm.id}>
                        {dm.user?.name || dm.name || dm.user?.email}
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
               <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Notifications</h3>
               <div className="space-y-3">
                 <div className="flex gap-2">
                   <input className="flex-1 p-2 text-xs border rounded bg-white" value={emails.customer} onChange={e => setEmails({...emails, customer: e.target.value})} placeholder="Customer Email" />
                   <button onClick={() => handleAction(async () => orderService.sendMailToCustomer(order.customer.userId, emails.customer), "Sent!")} className="p-2 bg-indigo-500 text-white rounded"><Send size={14}/></button>
                 </div>
                 <div className="flex gap-2">
                   <input className="flex-1 p-2 text-xs border rounded bg-white" value={emails.staff} onChange={e => setEmails({...emails, staff: e.target.value})} placeholder="Staff Email" />
                   <button onClick={() => handleAction(async () => orderService.sendMailToDM(order.id, emails.staff), "Sent!")} className="p-2 bg-gray-700 text-white rounded"><Send size={14}/></button>
                 </div>
               </div>
            </section>
          </div>

        </div>
      </div>
    </div>
  );
}