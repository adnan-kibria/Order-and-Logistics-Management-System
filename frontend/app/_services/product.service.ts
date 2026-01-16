import { ICartItem } from "../_interfaces/order/cart-item.interface";
import api from "../lib/axios";

export const ProductsService = {
    getAll: async () => {
        try {
            const res = await api.get("products/all");
            return res.data;
        }
        catch (err) {
            return err;
        }
    },

    getCartProducts: async (cartProducts: ICartItem[]) => {
        try {
            const res = await api.post("products/cart-products", cartProducts);
            return res.data;
        }
        catch (err) {
            return err;
        }
    }

}