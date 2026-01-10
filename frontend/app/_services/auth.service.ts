import api from "../lib/axios";
import { User } from "../_types/user";

export const AuthService = {
    // use the backend's POST /auth/login route
    signIn: async (user: User) => {
        const res = await api.post("/auth/login", user);
        return res.data;
    },
    // remove or keep if you implement /auth/user on backend
    user: async () => {
        const res = await api.post("/auth/user");
        return res.data;
    },
    logout: async () => {
        const res = await api.post("/auth/logout");
        return res.data;
    },
};