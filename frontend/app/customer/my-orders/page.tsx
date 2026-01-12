import { IOrder } from "@/app/_interfaces/order.interface";
import { orderService } from "@/app/_services/order.service";
import ViewDetailsBtn from "@/app/components/view-details-btn";
import { EyeIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default async function MyOrders() {
    const orders: IOrder[] = await orderService.GetMyOrders();

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 py-12 px-6">
            <div className="max-w-7xl mx-auto">
                {/* Breadcrumb */}
                <nav className="mb-4 text-sm text-gray-500">Home / Account / Orders</nav>

                {/* Page Header */}
                <div className="mb-10 flex items-center gap-3">
                    <EyeIcon className="w-8 h-8 text-blue-600" />
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900">My Orders</h1>
                        <p className="mt-1 text-sm text-gray-600">
                            Track your purchases, delivery status, and payment details.
                        </p>
                    </div>
                </div>

                {/* Orders Table Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    {orders.length === 0 ? (
                        <div className="p-12 text-center">
                            <EyeIcon className="w-12 h-12 mx-auto text-gray-400" />
                            <p className="mt-4 text-gray-500">You have no orders yet.</p>
                            <button className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                                Start Shopping
                            </button>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 text-sm">
                                <thead className="bg-gray-100 sticky top-0 ">
                                    <tr className="">
                                        <th className="px-6 py-3 text-left font-semibold text-gray-700">Order ID</th>
                                        <th className="px-6 py-3 text-left font-semibold text-gray-700">Date</th>
                                        <th className="px-6 py-3 text-left font-semibold text-gray-700">Product Total</th>
                                        <th className="px-6 py-3 text-left font-semibold text-gray-700">Shipping</th>
                                        <th className="px-6 py-3 text-left font-semibold text-gray-700">Total</th>
                                        <th className="px-6 py-3 text-left font-semibold text-gray-700">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {orders.map((order) => {
                                        const isCancelled = !!order.cancelledAt;
                                        const isDelivered = !!order.deliveredAt;

                                        let statusText = "Pending";
                                        let statusClass = "bg-yellow-100 text-yellow-700";

                                        if (isDelivered) {
                                            statusText = "Delivered";
                                            statusClass = "bg-green-100 text-green-700";
                                        } else if (isCancelled) {
                                            statusText = "Cancelled";
                                            statusClass = "bg-red-100 text-red-700";
                                        }

                                        return (
                                            <tr key={order.id} className="odd:bg-gray-50 hover:shadow-sm transition">
                                                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                                                    #{order.id}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                                    {new Date(order.date).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                                                    TK {order.productTotal.toFixed(2)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                                                    TK {order.shippingCharge.toFixed(2)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-900">
                                                    TK {order.total.toFixed(2)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap flex items-center gap-3">
                                                    <span
                                                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${statusClass}`}
                                                    >
                                                        <span className="w-2 h-2 rounded-full bg-current"></span>
                                                        {statusText}
                                                    </span>
                                                    <Link href={`my-orders/${order.id}`}
                                                    
                                                        className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium
                                                         text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50
                                                         transition focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    >
                                                        <EyeIcon className="w-4 h-4" />
                                                        View Details
                                                    </Link>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}