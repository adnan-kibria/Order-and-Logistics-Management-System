"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, User, Mail, Phone, Shield, Truck, Package, Search, Eye } from "lucide-react";
import { UserService, User as UserType } from "../../_services/user.service";
import Link from "next/link";

export default function UsersPage() {
  const [users, setUsers] = useState<UserType[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [userType, setUserType] = useState<"deliveryman" | "inventory_manager">("deliveryman");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  // Fetch all users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter users based on search term
  useEffect(() => {
    if (searchTerm === "") {
      setFilteredUsers(users);
    } else {
      setFilteredUsers(
        users.filter(
          (user) =>
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.profile?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.role.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, users]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await UserService.getAllUsersWithRelations();
      // Ensure data is an array
      if (Array.isArray(data)) {
        setUsers(data);
        setFilteredUsers(data);
      } else {
        console.error("Invalid data format received:", data);
        // toast.error("Invalid data format received from server");
        setUsers([]);
        setFilteredUsers([]);
      }
    } catch (error: any) {
      console.error("Error fetching users:", error);
    //   toast.error("Failed to fetch users: " + (error.response?.data?.message || error.message));
      setUsers([]);
      setFilteredUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (userType === "deliveryman") {
        await UserService.createDeliveryman(formData);
        // toast.success("Deliveryman created successfully!");
      } else {
        await UserService.createInventoryManager(formData);
        // toast.success("Inventory Manager created successfully!");
      }
      setShowAddModal(false);
      setFormData({ name: "", email: "", password: "", phone: "" });
      fetchUsers();
    } catch (error: any) {
    //   toast.error("Failed to create user: " + (error.response?.data?.message || error.message));
    }
  };

  const handleDeleteUser = async (email: string, role: string) => {
    if (!confirm(`Are you sure you want to delete this ${role}?`)) {
      return;
    }

    try {
      await UserService.deleteUser(email);
    //   toast.success("User deleted successfully!");
      fetchUsers();
    } catch (error: any) {
    //   toast.error("Failed to delete user: " + (error.response?.data?.message || error.message));
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Shield className="w-5 h-5 text-purple-600" />;
      case "deliveryman":
        return <Truck className="w-5 h-5 text-blue-600" />;
      case "inventory_manager":
        return <Package className="w-5 h-5 text-green-600" />;
      case "customer":
        return <User className="w-5 h-5 text-indigo-600" />;
      default:
        return <User className="w-5 h-5 text-gray-600" />;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-800";
      case "deliveryman":
        return "bg-blue-100 text-blue-800";
      case "inventory_manager":
        return "bg-green-100 text-green-800";
      case "customer":
        return "bg-indigo-100 text-indigo-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">All Users</h1>
          <p className="text-gray-600 mt-1">Manage all system users ({users.length} total)</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" />
          <span>Add User</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by email, name, or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Profile
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <User className="w-12 h-12 text-gray-400 mb-3" />
                      <p className="text-gray-500 font-medium">No users found</p>
                      <p className="text-sm text-gray-400 mt-1">
                        {searchTerm ? "Try adjusting your search" : "Get started by adding a user"}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.userId} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center shadow-sm">
                          <Mail className="w-6 h-6 text-indigo-600" />
                        </div>
                        <div>
                          <Link
                            href={`/admin/users/${user.userId}`}
                            className="text-sm font-semibold text-gray-900 hover:text-indigo-600 transition-colors"
                          >
                            {user.email}
                          </Link>
                          <p className="text-xs text-gray-500 mt-0.5">ID: {user.userId.slice(0, 8)}...</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        {getRoleIcon(user.role)}
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${getRoleBadgeColor(
                            user.role
                          )}`}
                        >
                          {user.role.replace("_", " ").toUpperCase()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {user.profile && user.profile.name ? (
                        <div>
                          <p className="text-sm font-medium text-gray-900">{user.profile.name}</p>
                          {user.profile.phone && (
                            <p className="text-xs text-gray-500 flex items-center space-x-1 mt-1">
                              <Phone className="w-3 h-3" />
                              <span>{user.profile.phone}</span>
                            </p>
                          )}
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400 italic">No profile</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <Link
                          href={`/admin/users/${user.userId}`}
                          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="View details"
                        >
                          <Eye className="w-5 h-5" />
                        </Link>
                        {user.role !== "admin" && (
                          <button
                            onClick={() => handleDeleteUser(user.email, user.role)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete user"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Add New User</h2>
              <p className="text-sm text-gray-500 mt-1">Create a new deliveryman or inventory manager</p>
            </div>
            <form onSubmit={handleAddUser} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  User Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setUserType("deliveryman")}
                    className={`px-4 py-3 rounded-lg border-2 transition-all ${
                      userType === "deliveryman"
                        ? "border-blue-500 bg-blue-50 text-blue-700 shadow-sm"
                        : "border-gray-300 text-gray-700 hover:border-gray-400"
                    }`}
                  >
                    <Truck className="w-5 h-5 mx-auto mb-1" />
                    <span className="text-sm font-medium">Deliveryman</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setUserType("inventory_manager")}
                    className={`px-4 py-3 rounded-lg border-2 transition-all ${
                      userType === "inventory_manager"
                        ? "border-green-500 bg-green-50 text-green-700 shadow-sm"
                        : "border-gray-300 text-gray-700 hover:border-gray-400"
                    }`}
                  >
                    <Package className="w-5 h-5 mx-auto mb-1" />
                    <span className="text-sm font-medium">Inventory Manager</span>
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
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
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="user@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="Min 8 chars, 1 uppercase, 1 number, 1 special char"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Must contain uppercase, lowercase, number, and special character
                </p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="+880 1XXX-XXXXXX"
                />
              </div>
              <div className="flex space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium shadow-sm"
                >
                  Create User
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
