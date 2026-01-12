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

    }
}