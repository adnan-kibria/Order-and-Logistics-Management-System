"use client";
import { useState, useEffect } from "react";
import { X, User, MapPin, Package, Truck } from "lucide-react";
import { AdminService } from "../_services/admin.service";

export default function OrderViewModal({ order: initialOrder, isOpen, onClose, deliverymen, onUpdate }: any) {
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<any>(null);
  const [selectedDeliverymanId, setSelectedDeliverymanId] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  useEffect(() => {
    if (isOpen && initialOrder?.id) {
      setOrder(null);
      fetchOrderDetails();
    }
  }, [isOpen, initialOrder?.id]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      console.log("Fetching order details for order ID:", initialOrder.id);
      const fullOrder = await AdminService.getOrderDetails(initialOrder.id);
      console.log("Received order details:", fullOrder);
      setOrder(fullOrder);
      setSelectedDeliverymanId(fullOrder.deliveryman?.id?.toString() || "");
      setSelectedStatus("");
    } catch (err) {
      console.error("Failed to fetch order details:", err);
      alert("Failed to load order details");
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      if (selectedDeliverymanId && selectedDeliverymanId !== order.deliveryman?.id?.toString()) {
        await AdminService.assignDeliveryman(order.id, parseInt(selectedDeliverymanId));
      }

      if (selectedStatus) {
        if (selectedStatus === "confirm") {
          await AdminService.confirmOrder(order.id);
        } else if (selectedStatus === "process") {
          await AdminService.processOrder(order.id);
        } else if (selectedStatus === "cancel") {
          await AdminService.cancelOrder(order.id);
        }
      }

      alert("Order updated successfully!");
      await onUpdate();
      onClose();
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update order");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !order) {
    return loading && isOpen ? (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div className="bg-white p-8 rounded-xl">
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    ) : null;
  }

  const addr = order.customer?.shippingAddress;
  const fullAddress = addr
    ? `${addr.details || ""} ${addr.location || ""}, ${addr.city || ""}`
    : "No address provided";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center bg-gray-50">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Order Details</h2>
            <p className="text-xs text-gray-500">Order ID: #{order.id}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-200 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto grid md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <section>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <User size={14} /> Customer
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="font-bold text-gray-800">{order.customer?.name || "N/A"}</p>
                <p className="text-sm text-gray-600">{order.customer?.user?.email || "N/A"}</p>
              </div>
            </section>

            <section>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <MapPin size={14} /> Shipping Address
              </h3>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-sm text-gray-700 leading-relaxed">{fullAddress}</p>
              </div>
            </section>

            <section>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Package size={14} /> Order Items
              </h3>
              <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                <div className="divide-y max-h-48 overflow-y-auto">
                  {order.orderDetails?.map((item: any) => (
                    <div key={item.id} className="p-3 flex justify-between items-center text-sm">
                      <div>
                        <span className="font-medium text-gray-800">{item.product?.name}</span>
                        <span className="text-gray-400 text-xs ml-2">× {item.qty}</span>
                      </div>
                      <span className="text-gray-700 font-semibold">Tk {item.orderPrice}</span>
                    </div>
                  ))}
                  <div className="p-3 flex justify-between items-center text-sm">
                    <span className="font-medium text-gray-800">Shipping Charge</span>
                    <span className="text-gray-700 font-semibold">Tk {order.shippingCharge}</span>
                  </div>
                </div>
                <div className="p-3 bg-gray-50 flex justify-between items-center font-bold border-t">
                  <span className="text-xs uppercase text-gray-600">Grand Total</span>
                  <span className="text-lg text-gray-900">Tk {order.total+order.shippingCharge}</span>
                </div>
              </div>
            </section>
          </div>
          <div className="space-y-6">
            <section>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                Current Status
              </h3>
              <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                <p className="text-sm font-semibold text-gray-800">{order.orderStatus?.status || "Unknown"}</p>
              </div>
            </section>
            <section>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Truck size={14} /> Assign Deliveryman
              </h3>
              <select
                className="w-full p-2.5 border border-gray-300 rounded-md text-sm bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                value={selectedDeliverymanId}
                onChange={(e) => setSelectedDeliverymanId(e.target.value)}
                disabled={loading}
              >
                <option value="">-- Select Deliveryman --</option>
                {deliverymen.map((dm: any) => (
                  <option key={dm.id} value={dm.id}>
                    {dm.name}
                  </option>
                ))}
              </select>
              {order.deliveryman && (
                <p className="text-xs text-gray-500 mt-2">
                  Current: <span className="font-semibold">{order.deliveryman.name}</span>
                </p>
              )}
            </section>
            <section>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                Change Order Status
              </h3>
              <select
                className="w-full p-2.5 border border-gray-300 rounded-md text-sm bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                disabled={loading}
              >
                <option value="">-- Select Action --</option>
                <option value="confirm">Confirm Order</option>
                <option value="process">Process Order</option>
                <option value="cancel">Cancel Order</option>
              </select>
            </section>
            <button
              onClick={handleUpdate}
              disabled={loading}
              className="w-full py-3 bg-indigo-600 text-white font-bold rounded-lg shadow-md hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Updating..." : "Update Order"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}