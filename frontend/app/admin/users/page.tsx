import { User, Phone, Shield, Truck, Package, } from "lucide-react";
import { UserService } from "../../_services/user.service";
import { User as UserType } from "../../_interfaces/user.interface";
import Link from "next/link";
import { SearchBar } from "@/app/components/search-bar";
import { ActionButtons } from "@/app/components/actions";
import { AddUserButton } from "@/app/components/add-user-button";

export default async function UsersPage(props: {
  searchParams: Promise<{ search?: string }>;
}) {
  const searchParams = await props.searchParams;
  const searchTerm = searchParams.search || "";

  let users: UserType[] = [];

  try {
    const data = await UserService.getAllUsersWithRelations();
    users = Array.isArray(data) ? data : [];

    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      users = users.filter(
        (user) =>
          user.email.toLowerCase().includes(lowerTerm) ||
          user.profile?.name?.toLowerCase().includes(lowerTerm) ||
          user.role.toLowerCase().includes(lowerTerm)
      );
    }
  } catch (error) {
    console.error("Error fetching users:", error);
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin": return <Shield className="w-5 h-5 text-purple-600" />;
      case "deliveryman": return <Truck className="w-5 h-5 text-blue-600" />;
      case "inventory_manager": return <Package className="w-5 h-5 text-green-600" />;
      default: return <User className="w-5 h-5 text-gray-600" />;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin": return "bg-purple-100 text-purple-800";
      case "deliveryman": return "bg-blue-100 text-blue-800";
      case "inventory_manager": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">All Users</h1>
          <p className="text-gray-600 mt-1">Manage all system users ({users.length} total)</p>
        </div>
        <AddUserButton />
      </div>
      <SearchBar defaultValue={searchTerm} />
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Profile</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">No users found</td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.userId} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div>
                          <Link
                            href={`/admin/users/${user.userId}`}
                            className="text-sm font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                          >
                            {user.profile?.name || user.email || "No Name"}
                          </Link>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        {getRoleIcon(user.role)}
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${getRoleBadgeColor(user.role)}`}>
                          {user.role.replace("_", " ").toUpperCase()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {user.profile?.name ? (
                        <div>
                          <p className="text-sm font-medium text-gray-900">{user.profile.name}</p>
                          <p className="text-xs text-gray-500 flex items-center gap-1"><Phone className="w-3 h-3"/>{user.profile.phone}</p>
                        </div>
                      ) : <span className="text-xs text-gray-400 italic">No profile</span>}
                    </td>
                    <td className="px-6 py-4">
                      <ActionButtons email={user.email} userId={user.userId} />
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