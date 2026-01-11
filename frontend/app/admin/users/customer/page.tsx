/**
 * Customers Management Page
 * Displays only customers with their order history and shipping information
 * Allows admin to view customer details and delete customers
 * Uses CSR (Client-Side Rendering) for dynamic data fetching
 */

"use client";

import { useState, useEffect } from "react";
import { Trash2, User, Mail, Phone, ShoppingCart, Search, Eye, MapPin } from "lucide-react";
import { UserService } from "../../../_services/user.service";
import { User as UserType } from "../../../_interfaces/user.interface";
// import toast from "react-hot-toast";
import Link from "next/link";

export default function CustomerPage() {
  const [customers, setCustomers] = useState<UserType[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredCustomers(customers);
    } else {
      setFilteredCustomers(
        customers.filter(
          (customer) =>
            customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.profile?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.profile?.phone?.includes(searchTerm)
        )
      );
    }
  }, [searchTerm, customers]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const data = await UserService.getAllUsersWithRelations();
      // Ensure data is an array and filter customers
      if (Array.isArray(data)) {
        const customerData = data.filter((user) => user.role === "customer");
        setCustomers(customerData);
        setFilteredCustomers(customerData);
      } else {
        console.error("Invalid data format received:", data);
        // toast.error("Invalid data format received from server");
        setCustomers([]);
        setFilteredCustomers([]);
      }
    } catch (error: any) {
      console.error("Error fetching customers:", error);
    //   toast.error("Failed to fetch customers: " + (error.response?.data?.message || error.message));
      setCustomers([]);
      setFilteredCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCustomer = async (email: string) => {
    if (!confirm("Are you sure you want to delete this customer?")) {
      return;
    }

    try {
      await UserService.deleteUser(email);
    //   toast.success("Customer deleted successfully!");
      fetchCustomers();
    } catch (error: any) {
    //   toast.error("Failed to delete customer: " + (error.response?.data?.message || error.message));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading customers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
          <p className="text-gray-600 mt-1">Manage all customer accounts ({customers.length} total)</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search customers by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Customers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCustomers.length === 0 ? (
          <div className="col-span-full">
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 font-medium text-lg">No customers found</p>
              <p className="text-sm text-gray-400 mt-2">
                {searchTerm ? "Try adjusting your search" : "No customers registered yet"}
              </p>
            </div>
          </div>
        ) : (
          filteredCustomers.map((customer) => (
            <div
              key={customer.userId}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {customer.profile?.name || customer.email || "No Name"}
                    </h3>
                    <p className="text-xs text-gray-500">
                      ID: {customer.userId ? customer.userId.slice(0, 8) + "..." : "N/A"}
                    </p>
                  </div>
                </div>
                <span className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-semibold">
                  CUSTOMER
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span className="truncate">{customer.email}</span>
                </div>
                {customer.profile?.phone && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{customer.profile.phone}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <Link
                  href={`/admin/users/${customer.userId}`}
                  className="flex items-center space-x-2 px-3 py-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors text-sm font-medium"
                >
                  <Eye className="w-4 h-4" />
                  <span>View Details</span>
                </Link>
                <button
                  onClick={() => handleDeleteCustomer(customer.email)}
                  className="flex items-center space-x-2 px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
