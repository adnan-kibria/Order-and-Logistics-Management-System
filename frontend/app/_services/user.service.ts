/**
 * User Service
 * Handles all user-related API calls for admin user management
 * Includes: fetching users, creating users (deliveryman/inventory manager), deleting users
 */

import api from "../lib/axios";

export interface UserProfile {
  id: number;
  name: string;
  phone: string;
}

export interface User {
  userId: string;
  email: string;
  role: string;
  profile: UserProfile | null;
}

export interface CreateDeliverymanData {
  name: string;
  email: string;
  password: string;
  phone: string;
}

export interface CreateInventoryManagerData {
  name: string;
  email: string;
  password: string;
  phone: string;
}

export const UserService = {
  /**
   * Get all users with their role-specific profiles
   * Used for displaying users in the admin panel
   * Requires admin authentication
   */
  getAllUsersWithRelations: async (): Promise<User[]> => {
    try {
      const res = await api.get("/users/with-relations");
      // Ensure we return an array even if data is undefined
      if (Array.isArray(res.data)) {
        return res.data;
      }
      return [];
    } catch (error: any) {
      console.error("Error fetching users with relations:", error);
      // Return empty array on error instead of throwing
      return [];
    }
  },

  /**
   * Get all users (simple list)
   */
  getAllUsers: async (): Promise<any[]> => {
    const res = await api.get("/users");
    return res.data || [];
  },

  /**
   * Get user by ID
   */
  getUserById: async (userId: string): Promise<any> => {
    const res = await api.get(`/users/${userId}`);
    return res.data;
  },

  /**
   * Get user profile by admin (with detailed info)
   */
  getUserProfileByAdmin: async (userId: string): Promise<any> => {
    const res = await api.get(`/users/admin/${userId}`);
    return res.data;
  },

  /**
   * Create a new deliveryman
   * Admin can only create deliveryman and inventory manager
   * Backend expects three separate objects: user, deliveryMan, and inventoryManager
   */
  createDeliveryman: async (data: CreateDeliverymanData): Promise<any> => {
    const res = await api.post("/users/create", {
      // User object
      email: data.email,
      password: data.password,
      role: "deliveryman",
      // Deliveryman object
      name: data.name,
      phone: data.phone,
      // Empty inventory manager object (not used for deliveryman)
    });
    return res.data;
  },

  /**
   * Create a new inventory manager
   * Admin can only create deliveryman and inventory manager
   * Backend expects three separate objects: user, deliveryMan, and inventoryManager
   */
  createInventoryManager: async (data: CreateInventoryManagerData): Promise<any> => {
    const res = await api.post("/users/create", {
      // User object
      email: data.email,
      password: data.password,
      role: "inventory_manager",
      // Empty deliveryman object (not used for inventory manager)
      // Inventory manager object
      name: data.name,
      phone: data.phone,
    });
    return res.data;
  },

  /**
   * Delete a user by email
   * Admin can delete customers, deliverymen, and inventory managers
   */
  deleteUser: async (email: string): Promise<{ message: string }> => {
    const res = await api.delete(`/users/delete-user/${email}`);
    return res.data;
  },
};
