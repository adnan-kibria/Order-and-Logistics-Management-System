/**
 * User Details Page (Dynamic Route)
 * Displays detailed information about a specific user
 * Shows user profile, role-specific information, and statistics
 * Uses CSR (Client-Side Rendering) for dynamic data fetching
 */

"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Mail,
  Phone,
  User,
  Shield,
  Truck,
  Package,
  ShoppingCart,
  Calendar,
  MapPin,
  TrendingUp,
} from "lucide-react";
import { UserService } from "../../../_services/user.service";
// import toast from "react-hot-toast";
import Link from "next/link";

export default function UserDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params.userId as string;
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserDetails();
  }, [userId]);

  const fetchUserDetails = async () => {
    try {
      setLoading(true);
      const data = await UserService.getUserProfileByAdmin(userId);
      setUser(data);
    } catch (error: any) {
    //   toast.error("Failed to fetch user details: " + (error.response?.data?.message || error.message));
      router.push("/admin/users");
    } finally {
      setLoading(false);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Shield className="w-8 h-8 text-purple-600" />;
      case "deliveryman":
        return <Truck className="w-8 h-8 text-blue-600" />;
      case "inventory_manager":
        return <Package className="w-8 h-8 text-green-600" />;
      case "customer":
        return <ShoppingCart className="w-8 h-8 text-indigo-600" />;
      default:
        return <User className="w-8 h-8 text-gray-600" />;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "deliveryman":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "inventory_manager":
        return "bg-green-100 text-green-800 border-green-200";
      case "customer":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading user details...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 text-lg font-medium">User not found</p>
        <Link
          href="/admin/users"
          className="text-indigo-600 hover:underline mt-4 inline-block font-medium"
        >
          ← Back to Users
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Details</h1>
          <p className="text-gray-600 mt-1">View comprehensive user information</p>
        </div>
      </div>

      {/* User Profile Card */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div className="flex items-start space-x-6">
            <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center shadow-md">
              {getRoleIcon(user.role)}
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-4">
                <h2 className="text-3xl font-bold text-gray-900">
                  {user.profile?.name || "No Name"}
                </h2>
                <span
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold border ${getRoleBadgeColor(
                    user.role
                  )}`}
                >
                  {user.role.replace("_", " ").toUpperCase()}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3 text-gray-600">
                  <Mail className="w-5 h-5" />
                  <span className="font-medium">{user.email}</span>
                </div>
                {user.profile?.phone && (
                  <div className="flex items-center space-x-3 text-gray-600">
                    <Phone className="w-5 h-5" />
                    <span className="font-medium">{user.profile.phone}</span>
                  </div>
                )}
                <div className="flex items-center space-x-3 text-gray-600">
                  <Calendar className="w-5 h-5" />
                  <span className="text-sm">User ID: {user.userId}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Role-Specific Information Cards */}
      {user.role === "customer" && user.profile && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Customer Statistics</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-indigo-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Total Orders</p>
                  <p className="text-3xl font-bold text-indigo-600 mt-1">
                    {user.profile.totalOrders || 0}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-indigo-400" />
              </div>
            </div>
          </div>

          {user.profile.shippingAddress && (
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Shipping Address</h3>
              </div>
              <div className="space-y-2 text-gray-700">
                <p className="font-medium">{user.profile.shippingAddress.city}</p>
                <p className="text-sm">{user.profile.shippingAddress.location}</p>
                {user.profile.shippingAddress.details && (
                  <p className="text-sm text-gray-500 italic">{user.profile.shippingAddress.details}</p>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {user.role === "deliveryman" && user.profile && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Truck className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Deliveryman Statistics</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Completed Deliveries</p>
              <p className="text-3xl font-bold text-blue-600">
                {user.profile.deliveriesCompleted || 0}
              </p>
            </div>
            <div className="p-4 bg-cyan-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Active Deliveries</p>
              <p className="text-3xl font-bold text-cyan-600">0</p>
            </div>
            <div className="p-4 bg-sky-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Total Assigned</p>
              <p className="text-3xl font-bold text-sky-600">
                {user.profile.deliveriesCompleted || 0}
              </p>
            </div>
          </div>
        </div>
      )}

      {user.role === "inventory_manager" && user.profile && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Inventory Manager Information</h3>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">Manager Details</p>
            <p className="text-gray-900 font-medium">
              This inventory manager is responsible for managing product inventory and stock levels.
            </p>
          </div>
        </div>
      )}

      {/* Back Button */}
      <div className="flex justify-end">
        <Link
          href="/admin/users"
          className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
        >
          Back
        </Link>
      </div>
    </div>
  );
}
