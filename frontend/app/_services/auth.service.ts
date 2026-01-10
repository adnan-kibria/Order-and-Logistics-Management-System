import api from "../lib/axios";
import { User } from "../_types/user";

export const AuthService = {
    signIn: async (user: User) => {
        const res = await api.post("/auth/login", user);
        return res.data;
    },
    user: async () => {
        const res = await api.post("/auth/user");
        return res.data;
    },
    logout: async () => {
        const res = await api.post("/auth/logout");
        return res.data;
    },
};