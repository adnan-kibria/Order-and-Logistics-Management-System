import { ICartItem } from "../_interfaces/cart-item.interface";
import api from "../lib/axios";

export const orderService = {
    placeOrder: async (cartItem: ICartItem[]) => {
        try {
            // Backend expects an object with `orderItems` property
            const res = await api.post("order/place", { orderItems: cartItem });
            return res.data;
        }
        catch (err) {
            // rethrow so callers can handle the error (and so axios error details aren't swallowed)
            throw err;
        }
    },

    GetMyOrders: async () => {
        try {
            const res = await api.get(`order/my-orders`);
            return res.data;
        }
        catch (err) {
            throw err;
        }

    },

    // Kibria
    // Fetch all orders (SSR/CSR)
    getOrders: async () => {
        const res = await api.get("/order/get-all-orders");
        return res.data;
    },

    // Fetch all deliverymen for the assignment dropdown
    getDeliverymen: async () => {
        const res = await api.get("/users/all-deliverymen");
        return res.data;
    },

    // Workflow Actions
    confirmOrder: (id: number) => api.patch(`/order/confirm-order/${id}`),
    cancelOrder: (id: number) => api.patch(`/order/cancel-order/${id}`),
    processOrder: (id: number) => api.patch(`/order/process-order/${id}`),

    // Assign + Auto Mail
    assignAndMail: async (orderId: number, deliveryManId: number, email: string) => {
        // 1. Assign in DB (your existing logic)
        await api.patch(`/order/assign-deliveryman/${orderId}/${deliveryManId}`);
        // 2. Send Email (your existing logic)
        await api.post(`/order/sendMailToDeliveryMan/${orderId}`, { mail: email });
    }
}
