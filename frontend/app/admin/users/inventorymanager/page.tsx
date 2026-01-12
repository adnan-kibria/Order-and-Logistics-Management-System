/**
 * Inventory Managers Management Page
 * Displays only inventory managers with their information
 * Allows admin to view inventory manager details, add new managers, and delete managers
 * Uses CSR (Client-Side Rendering) for dynamic data fetching
 */

"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Package, Mail, Phone, Search, Eye, Truck, User } from "lucide-react";
import { UserService } from "../../../_services/user.service";
import { User as UserType } from "../../../_interfaces/user.interface";
//import toast from "react-hot-toast";
import Link from "next/link";

export default function InventoryManagerPage() {
  const [managers, setManagers] = useState<UserType[]>([]);
  const [filteredManagers, setFilteredManagers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchManagers();
  }, []);

  const fetchManagers = async () => {
    try {
      setLoading(true);
      const data = await UserService.getAllUsersWithRelations();
      // Ensure data is an array and filter inventory managers
      if (Array.isArray(data)) {
        const managerData = data.filter((user) => user.role === "inventorymanager");
        setManagers(managerData);
        setFilteredManagers(managerData);
      } else {
        console.error("Invalid data format received:", data);
        //toast.error("Invalid data format received from server");
        setManagers([]);
        setFilteredManagers([]);
      }
    } catch (error: any) {
      console.error("Error fetching inventory managers:", error);
      //toast.error("Failed to fetch inventory managers: " + (error.response?.data?.message || error.message));
      setManagers([]);
      setFilteredManagers([]);
    } finally {
      setLoading(false);
    }
  };


  const handleDeleteManager = async (email: string) => {
    if (!confirm("Are you sure you want to delete this inventory manager?")) {
      return;
    }

    try {
      await UserService.deleteUser(email);
    //   toast.success("Inventory Manager deleted successfully!");
      fetchManagers();
    } catch (error: any) {
    //   toast.error("Failed to delete inventory manager: " + (error.response?.data?.message || error.message));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading inventory managers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Inventory Managers</h1>
          <p className="text-gray-600 mt-1">Manage inventory personnel ({managers.length} total)</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search inventory managers by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Managers Grid */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredManagers.length === 0 ? (
          <div className="col-span-full">
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 font-medium text-lg">No inventory managers found</p>
              <p className="text-sm text-gray-400 mt-2">
                {searchTerm ? "Try adjusting your search" : "Get started by adding an inventory manager"}
              </p>
            </div>
          </div>
        ) : (
          filteredManagers.map((manager) => (
            <div
              key={manager.userId}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center">
                    <Package className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {manager.profile?.name || manager.email || "No Name"}
                    </h3>
                    <p className="text-xs text-gray-500">
                      ID: {manager.userId ? manager.userId.slice(0, 8) + "..." : "N/A"}
                    </p>
                  </div>
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                  MANAGER
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span className="truncate">{manager.email}</span>
                </div>
                {manager.profile?.phone && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{manager.profile.phone}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <Link
                  href={`/admin/users/${manager.userId}`}
                  className="flex items-center space-x-2 px-3 py-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors text-sm font-medium"
                >
                  <Eye className="w-4 h-4" />
                  <span>View Details</span>
                </Link>
                <button
                  onClick={() => handleDeleteManager(manager.email)}
                  className="flex items-center space-x-2 px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))
        )} */}
      {/* </div> */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-blue-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Inventory Manager
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {filteredManagers.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <User className="w-12 h-12 text-gray-400 mb-3" />
                      <p className="text-gray-500 font-medium">No inventory managers found</p>
                      <p className="text-sm text-gray-400 mt-1">
                        {searchTerm ? "Try adjusting your search" : "Get started by adding an inventory manager"}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredManagers.map((manager) => (
                  <tr key={manager.userId} className="hover:bg-blue-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full flex items-center justify-center shadow-sm">
                          <User className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <Link
                            href={`/admin/users/${manager.userId}`}
                            className="text-sm font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                          >
                            {manager.profile?.name || manager.email || "No Name"}
                          </Link>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Mail className="w-4 h-4" />
                          <span className="truncate">{manager.email}</span>
                        </div>
                        {manager.profile?.phone && (
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Phone className="w-4 h-4" />
                            <span>{manager.profile.phone}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <Link
                          href={`/admin/users/${manager.userId}`}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View details"
                        >
                          <Eye className="w-5 h-5" />
                        </Link>
                        <button
                          onClick={() => handleDeleteManager(manager.email)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete manager"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
