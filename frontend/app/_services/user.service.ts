import { CreateDeliverymanData } from "../_interfaces/create-deliverman-data.interface";
import { CreateInventoryManagerData } from "../_interfaces/create-invmanager-data.interface";
import { User } from "../_interfaces/user.interface";
import api from "../lib/axios";


export const UserService = {
  getAllUsersWithRelations: async (): Promise<User[]> => {
    try {
      const res = await api.get("/users/with-relations");

      if (Array.isArray(res.data)) {
        return res.data;
      }
      return [];
    } catch (error: any) {
      console.error("Error fetching users with relations:", error);
      return [];
    }
  },

  getAllUsers: async (): Promise<any[]> => {
    const res = await api.get("/users");
    return res.data || [];
  },

  getUserById: async (userId: string): Promise<any> => {
    const res = await api.get(`/users/${userId}`);
    return res.data;
  },

  getUserProfileByAdmin: async (userId: string): Promise<any> => {
    try {
      const res = await api.get(`/users/admin/${userId}`);
      return res.data;
    }
    catch (err) {
      throw err;
    }
  },

  createDeliveryman: async (data: CreateDeliverymanData): Promise<any> => {
    const res = await api.post("/users/create", {
      email: data.email,
      password: data.password,
      role: "deliveryman",
      name: data.name,
      phone: data.phone,
    });
    return res.data;
  },

  createInventoryManager: async (data: CreateInventoryManagerData): Promise<any> => {
    const res = await api.post("/users/create", {
      email: data.email,
      password: data.password,
      role: "inventorymanager",
      name: data.name,
      phone: data.phone,
    });
    return res.data;
  },

  deleteUser: async (email: string): Promise<{ message: string }> => {
    const res = await api.delete(`/users/delete-user/${email}`);
    return res.data;
  },
};

