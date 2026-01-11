import api from "../lib/axios";

export const CategoryService = {
    getAll: async () => {
        try {
            const res = await api.get("category/all");
            return res.data;
        }
        catch (err) {
            return err;
        }
    }
}