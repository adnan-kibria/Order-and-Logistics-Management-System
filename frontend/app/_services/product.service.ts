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
    }
}