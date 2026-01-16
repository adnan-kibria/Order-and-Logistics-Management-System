import { IOrder } from "@/app/_interfaces/order/order-details.interface";
import { orderService } from "@/app/_services/order.service";

export default async function OrderDetails({ params }: { params: Promise<{ oId: string }> }) {
    const { oId } = await params;
    const order: IOrder = await orderService.getOrderById(oId);

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 px-4 py-10">
            <div className="max-w-6xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-semibold text-gray-900">Order Details</h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Order ID: <span className="font-medium">#{order.id}</span>
                        </p>
                    </div>

                    <span className="mt-4 sm:mt-0 inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium 
                           bg-linear-to-r from-indigo-500 to-blue-500 text-white shadow">
                        {order.orderStatus.status}
                    </span>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="bg-white rounded-2xl shadow-sm p-6 border">
                        <p className="text-sm text-gray-500">Product Total</p>
                        <p className="text-2xl font-semibold text-gray-900 mt-1">
                            TK {Math.round(order.productTotal)}
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm p-6 border">
                        <p className="text-sm text-gray-500">Shipping Charge</p>
                        <p className="text-2xl font-semibold text-gray-900 mt-1">
                            TK {Math.round(order.shippingCharge)}
                        </p>
                    </div>

                    <div className="bg-linear-to-r from-indigo-500 to-blue-600 rounded-2xl shadow-sm p-6 text-white">
                        <p className="text-sm opacity-90">Total Amount</p>
                        <p className="text-2xl font-semibold mt-1">
                            TK {Math.round(order.total)}
                        </p>
                    </div>
                </div>

                {/* Customer & Shipping Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Customer Info */}
                    <div className="bg-white rounded-2xl shadow-sm p-6 border">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h2>
                        <div className="space-y-2 text-sm text-gray-700">
                            <p><span className="font-medium">Name:</span> {order.customer.name}</p>
                            <p><span className="font-medium">Phone:</span> {order.customer.phone}</p>
                        </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="bg-white rounded-2xl shadow-sm p-6 border">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Shipping Address</h2>
                        <div className="space-y-2 text-sm text-gray-700">
                            <p><span className="font-medium">City:</span> {order.customer.shippingAddress.city}</p>
                            <p><span className="font-medium">Location:</span> {order.customer.shippingAddress.location}</p>
                            <p><span className="font-medium">Details:</span> {order.customer.shippingAddress.details}</p>
                        </div>
                    </div>
                </div>

                {/* Order Items Table */}
                <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
                    <div className="px-6 py-4 border-b">
                        <h2 className="text-lg font-semibold text-gray-900">Ordered Products</h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Qty</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Discount</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subtotal</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-200">
                                {order.orderDetails.map((item) => {
                                    const subtotal = item.qty * item.orderPrice;

                                    return (
                                        <tr key={item.id} className="hover:bg-gray-50 transition">
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                                {item.product.name}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-700">
                                                TK {Math.round(item.orderPrice)}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-700">
                                                {item.qty}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-700">
                                                TK {item.product.discount}
                                            </td>
                                            <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                                                TK {Math.round(subtotal)}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Status Info */}
                <div className="bg-white rounded-2xl shadow-sm p-6 border">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Timeline</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-700">
                        <p><span className="font-medium">Placed At:</span> {new Date(order.date).toLocaleString()}</p>
                        <p>
                            <span className="font-medium">Delivered At:</span>{" "}
                            {order.deliveredAt ? new Date(order.deliveredAt).toLocaleString() : "Not Delivered"}
                        </p>
                        <p>
                            <span className="font-medium">Cancelled At:</span>{" "}
                            {order.cancelledAt ? new Date(order.cancelledAt).toLocaleString() : "Not Cancelled"}
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
}
