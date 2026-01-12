// app/admin/users/[userId]/page.tsx

import { 
  ArrowLeft, Mail, Phone, User, Shield, Truck, 
  Package, ShoppingCart, Calendar, MapPin, TrendingUp 
} from "lucide-react";
import { UserService } from "../../../_services/user.service";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";

// Helper functions moved outside the component
const getRoleIcon = (role: string) => {
  const r = role?.toLowerCase().replace("_", "") || "";
  switch (r) {
    case "admin": return <Shield className="w-8 h-8 text-purple-600" />;
    case "deliveryman": return <Truck className="w-8 h-8 text-blue-600" />;
    case "inventorymanager": return <Package className="w-8 h-8 text-green-600" />;
    case "customer": return <User className="w-8 h-8 text-indigo-600" />;
    default: return <User className="w-8 h-8 text-gray-600" />;
  }
};

const getRoleBadgeColor = (role: string) => {
  const r = role?.toLowerCase().replace("_", "") || "";
  switch (r) {
    case "admin": return "bg-purple-100 text-purple-800 border-purple-200";
    case "deliveryman": return "bg-blue-100 text-blue-800 border-blue-200";
    case "inventorymanager": return "bg-green-100 text-green-800 border-green-200";
    case "customer": return "bg-indigo-100 text-indigo-800 border-indigo-200";
    default: return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

// 1. Change the component to an async function (Server Component)
export default async function UserDetailsPage({ params }: { params: { userId: string } }) {
  const { userId } = params;
  let user = null;

  try {
    // 2. Fetch data directly on the server
    // Note: If your service requires a token, you'd get it like this:
    // const cookieStore = cookies();
    // const token = cookieStore.get('auth_token')?.value;
    user = await UserService.getUserProfileByAdmin(userId);
  } catch (error) {
    console.error("Failed to fetch user:", error);
  }

  // 3. Handle 404
  if (!user) {
    notFound(); 
  }

  // Normalize data access
  const nRole = user.role?.toLowerCase().replace("_", "") || "";
  const profile = user.profile || {};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        {/* Note: 'router.back()' is client-side. Using Link for SSR standard */}
        <Link
          href="/admin/users"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Details</h1>
          <p className="text-gray-600 mt-1">View comprehensive user information (SSR)</p>
        </div>
      </div>

      {/* Main Profile Card */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div className="flex items-start space-x-6">
            <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center shadow-md">
              {getRoleIcon(user.role)}
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-4">
                <h2 className="text-3xl font-bold text-gray-900">
                  {profile.name || "No Name"}
                </h2>
                <span className={`px-4 py-1.5 rounded-full text-sm font-semibold border ${getRoleBadgeColor(user.role)}`}>
                  {user.role?.replace("_", " ").toUpperCase()}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3 text-gray-600">
                  <Mail className="w-5 h-5" />
                  <span className="font-medium">{user.email}</span>
                </div>
                {profile.phone && (
                  <div className="flex items-center space-x-3 text-gray-600">
                    <Phone className="w-5 h-5" />
                    <span className="font-medium">{profile.phone}</span>
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
      {nRole === "customer" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center space-x-3 mb-4">
              <ShoppingCart className="w-6 h-6 text-indigo-600" />
              <h3 className="text-xl font-semibold text-gray-900">Customer Statistics</h3>
            </div>
            <div className="flex items-center justify-between p-4 bg-indigo-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Total Orders</p>
                <p className="text-3xl font-bold text-indigo-600 mt-1">{profile.totalOrders || 0}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-indigo-400" />
            </div>
          </div>

          {profile.shippingAddress && (
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center space-x-3 mb-4">
                <MapPin className="w-6 h-6 text-purple-600" />
                <h3 className="text-xl font-semibold text-gray-900">Shipping Address</h3>
              </div>
              <div className="space-y-2 text-gray-700">
                <p className="font-bold">{profile.shippingAddress.city}</p>
                <p className="text-sm">{profile.shippingAddress.location}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {nRole === "deliveryman" && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center space-x-3 mb-6">
            <Truck className="w-6 h-6 text-blue-600" />
            <h3 className="text-xl font-semibold text-gray-900">Deliveryman Statistics</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg text-center">
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-3xl font-bold text-blue-600">{profile.deliveriesCompleted || 0}</p>
            </div>
          </div>
        </div>
      )}

      {nRole === "inventorymanager" && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center space-x-3 mb-4">
            <Package className="w-6 h-6 text-green-600" />
            <h3 className="text-xl font-semibold text-gray-900">Inventory Scope</h3>
          </div>
          <p className="text-gray-700 bg-green-50 p-4 rounded-lg">
            Authorized to manage warehouse stock and logistics.
          </p>
        </div>
      )}

      {/* Footer Actions */}
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