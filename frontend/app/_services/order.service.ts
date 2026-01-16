import { get } from "http";
import { ICartItem } from "../_interfaces/order/cart-item.interface";
import api from "../lib/axios";

export const orderService = {
    placeOrder: async (cartItem: ICartItem[]) => {
        try {
            const res = await api.post("order/place", { orderItems: cartItem });
            return res.data;
        }
        catch (err) {

            throw err;
        }
    },

    GetMyOrders: async () => {
        try {
            const res = await api.post('order/my-orders');
            return res.data;
        }
        catch (err) {
            throw err;
        }

    },
    getOrderById: async (oId: string) => {
        try {

            const res = await api.get(`order/${Number(oId)}`);
            return res.data;
        }
        catch (err) {
            throw err;
        }
    },

    //kibria
    getOrders: async () => {
        const res = await api.get("/order/get-all-orders");
        return res.data;
    },

    getDeliverymen: async () => {
        const res = await api.get("/users/all-deliverymen");
        return res.data;
    },

    confirmOrder: (id: number) => api.patch(`/order/confirm-order/${id}`),
    cancelOrder: (id: number) => api.patch(`/order/cancel-order/${id}`),
    processOrder: (id: number) => api.patch(`/order/process-order/${id}`),

    assignDeliveryman: (orderId: number, dmId: number) => 
        api.patch(`/order/assign-deliveryman/${orderId}/${dmId}`),

    sendMailToDM: (orderId: number, email: string) => 
        api.post(`/order/sendMailToDeliveryMan/${orderId}/${email}`),

    sendMailToCustomer: (userId: string, email: string) => 
        api.post(`/order/sendMailToCustomer/${userId}/${email}`),
}
