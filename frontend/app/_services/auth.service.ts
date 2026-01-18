import api from "../lib/axios";
import { User } from "../_types/user";
import { RegisterCustomer } from "../_interfaces/customer/register-customer.interface";

export const AuthService = {
    register: async (customer: RegisterCustomer) => {
        try {
            const res = await api.post("customers/register", customer);
            return res.data;
        }
        catch (err) {
            throw new Error("Registration failed");
        }
    },
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