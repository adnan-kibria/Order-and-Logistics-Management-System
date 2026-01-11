/**
 * Deliverymen Management Page
 * Displays only deliverymen with their delivery statistics
 * Allows admin to view deliveryman details, add new deliverymen, and delete deliverymen
 * Uses CSR (Client-Side Rendering) for dynamic data fetching
 */

"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Truck, Mail, Phone, Search, Eye, Package } from "lucide-react";
import { UserService, User as UserType } from "../../../_services/user.service";
// import toast from "react-hot-toast";
import Link from "next/link";

export default function DeliverymanPage() {
  const [deliverymen, setDeliverymen] = useState<UserType[]>([]);
  const [filteredDeliverymen, setFilteredDeliverymen] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  useEffect(() => {
    fetchDeliverymen();
  }, []);

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredDeliverymen(deliverymen);
    } else {
      setFilteredDeliverymen(
        deliverymen.filter(
          (deliveryman) =>
            deliveryman.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            deliveryman.profile?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            deliveryman.profile?.phone?.includes(searchTerm)
        )
      );
    }
  }, [searchTerm, deliverymen]);

  const fetchDeliverymen = async () => {
    try {
      setLoading(true);
      const data = await UserService.getAllUsersWithRelations();
      // Ensure data is an array and filter deliverymen
      if (Array.isArray(data)) {
        const deliverymanData = data.filter((user) => user.role === "deliveryman");
        setDeliverymen(deliverymanData);
        setFilteredDeliverymen(deliverymanData);
      } else {
        console.error("Invalid data format received:", data);
        // toast.error("Invalid data format received from server");
        setDeliverymen([]);
        setFilteredDeliverymen([]);
      }
    } catch (error: any) {
      console.error("Error fetching deliverymen:", error);
    //   toast.error("Failed to fetch deliverymen: " + (error.response?.data?.message || error.message));
      setDeliverymen([]);
      setFilteredDeliverymen([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDeliveryman = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await UserService.createDeliveryman(formData);
    //   toast.success("Deliveryman created successfully!");
      setShowAddModal(false);
      setFormData({ name: "", email: "", password: "", phone: "" });
      fetchDeliverymen();
    } catch (error: any) {
      // toast.error("Failed to create deliveryman: " + (error.response?.data?.message || error.message));
    }
  };

  const handleDeleteDeliveryman = async (email: string) => {
    if (!confirm("Are you sure you want to delete this deliveryman?")) {
      return;
    }

    try {
      await UserService.deleteUser(email);
      // toast.success("Deliveryman deleted successfully!");
      fetchDeliverymen();
    } catch (error: any) {
      // toast.error("Failed to delete deliveryman: " + (error.response?.data?.message || error.message));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading deliverymen...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Deliverymen</h1>
          <p className="text-gray-600 mt-1">Manage delivery personnel ({deliverymen.length} total)</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" />
          <span>Add Deliveryman</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search deliverymen by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Deliverymen Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-blue-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Deliveryman
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
              {filteredDeliverymen.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <Truck className="w-12 h-12 text-gray-400 mb-3" />
                      <p className="text-gray-500 font-medium">No deliverymen found</p>
                      <p className="text-sm text-gray-400 mt-1">
                        {searchTerm ? "Try adjusting your search" : "Get started by adding a deliveryman"}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredDeliverymen.map((deliveryman) => (
                  <tr key={deliveryman.userId} className="hover:bg-blue-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full flex items-center justify-center shadow-sm">
                          <Truck className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <Link
                            href={`/admin/users/${deliveryman.userId}`}
                            className="text-sm font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                          >
                            {deliveryman.profile?.name || deliveryman.email || "No Name"}
                          </Link>
                          <p className="text-xs text-gray-500 mt-0.5">
                            ID: {deliveryman.userId ? deliveryman.userId.slice(0, 8) + "..." : "N/A"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Mail className="w-4 h-4" />
                          <span className="truncate">{deliveryman.email}</span>
                        </div>
                        {deliveryman.profile?.phone && (
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Phone className="w-4 h-4" />
                            <span>{deliveryman.profile.phone}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <Link
                          href={`/admin/users/${deliveryman.userId}`}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View details"
                        >
                          <Eye className="w-5 h-5" />
                        </Link>
                        <button
                          onClick={() => handleDeleteDeliveryman(deliveryman.email)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete deliveryman"
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

      {/* Add Deliveryman Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all">
            <div className="p-6 border-b border-gray-200 bg-blue-50">
              <div className="flex items-center space-x-3">
                <Truck className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">Add New Deliveryman</h2>
              </div>
              <p className="text-sm text-gray-500 mt-1">Create a new delivery personnel account</p>
            </div>
            <form onSubmit={handleAddDeliveryman} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="deliveryman@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Min 8 chars, 1 uppercase, 1 number, 1 special char"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="+880 1XXX-XXXXXX"
                />
              </div>
              <div className="flex space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
                >
                  Create Deliveryman
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setFormData({ name: "", email: "", password: "", phone: "" });
                  }}
                  className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
