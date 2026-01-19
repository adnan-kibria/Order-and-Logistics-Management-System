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
    trackOrders: async () => {
        try {
            const res = await api.get('order/track'); //temporary cId=2
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
}
