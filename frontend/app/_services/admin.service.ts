import { Order } from "../_interfaces/admin-order.interface";
import { DashboardStats } from "../_interfaces/dashboard-stats.interface";
import api from "../lib/axios";

export const AdminService = {
  getAllOrders: async (): Promise<Order[]> => {
    try {
      const res = await api.get("/order/get-all-orders");
      return res.data || [];
    } catch (error) {
      console.error("Error fetching orders:", error);
      return [];
    }
  },

  getDashboardStats: async (): Promise<DashboardStats> => {
    try {
      const orders = await AdminService.getAllOrders();
      const usersRes = await api.get("/users");
      const users = usersRes.data || [];

      const deliveredOrders = orders.filter(
        (order) => order.orderStatus?.id === 9
      );
      const totalRevenue = deliveredOrders.reduce(
        (sum, order) => sum + order.total,
        0
      );

      return {
        totalOrders: orders.length,
        totalUsers: users.length,
        totalRevenue: totalRevenue,
      };
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      return {
        totalOrders: 0,
        totalUsers: 0,
        totalRevenue: 0,
      };
    }
  },

  confirmOrder: async (orderId: number): Promise<Order> => {
    const res = await api.patch(`/order/confirm-order/${orderId}`);
    return res.data;
  },

  cancelOrder: async (orderId: number): Promise<Order> => {
    const res = await api.patch(`/order/cancel-order/${orderId}`);
    return res.data;
  },

  assignDeliveryman: async (orderId: number, deliverymanId: number): Promise<Order> => {
    const res = await api.patch(`/order/assign-deliveryman/${orderId}/${deliverymanId}`);
    return res.data;
  },

  getOrdersByStatus: async (statusId: number): Promise<Order[]> => {
    const res = await api.get(`/order/get-orders/${statusId}`);
    return res.data || [];
  },

  getTotalSales: async (filter: "daily" | "weekly" | "monthly"): Promise<{ total: number }> => {
    const res = await api.get(`/order/total-sales/${filter}`);
    return res.data;
  },
};

