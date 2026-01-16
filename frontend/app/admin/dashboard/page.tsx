"use client";

import { useState, useEffect } from "react";
import { ShoppingCart, Wallet, Users } from "lucide-react";
import { AdminService } from "../../_services/admin.service";
import StatCard from "@/app/components/stats-card";

const getStatusColor = (status: string = "") => {
  const s = status.toLowerCase();
  if (s.includes("delivered")) return "bg-green-100 text-green-800";
  if (s.includes("cancel")) return "bg-red-100 text-red-800";
  if (s.includes("on the way") || s.includes("assigned")) return "bg-blue-100 text-blue-800";
  if (s.includes("process") || s.includes("confirm")) return "bg-yellow-100 text-yellow-800";
  return "bg-gray-100 text-gray-800";
};

export default function AdminDashboard() {
  const [data, setData] = useState({ stats: null as any, orders: [] as any[] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([AdminService.getDashboardStats(), AdminService.getAllOrders()])
      .then(([stats, orders]) => setData({ stats, orders }))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
        <p className="text-gray-500 animate-pulse">Loading dashboard...</p>
      </div>
    );
  }

  const { stats, orders } = data;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Overview</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Orders" value={stats?.totalOrders || 0} icon={ShoppingCart} />
        <StatCard title="Total Users" value={stats?.totalUsers || 0} icon={Users} />
        <StatCard 
          title="Total Revenue" 
          value={`$${Number(stats?.totalRevenue || 0).toFixed(2)}`} 
          icon={Wallet} 
        />
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Recent Orders</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {["Order ID", "Customer Name", "Amount", "Status", "Date"].map((head) => (
                  <th key={head} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-gray-500">No orders found</td></tr>
              ) : (
                orders.map((order: any) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{order.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.customer?.name || "N/A"}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ${Number(order.total || 0).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.orderStatus?.status)}`}>
                        {order.orderStatus?.status || "Unknown"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {order.date ? new Date(order.date).toLocaleDateString() : "N/A"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}