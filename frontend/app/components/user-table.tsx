//kibria

import { User, Mail, Phone } from "lucide-react";
import Link from "next/link";
import { ActionButtons } from "@/app/components/actions";
import { UserTableProps } from "../_interfaces/user/user-table.interface";


export function UserTable({ data, searchTerm, typeLabel }: UserTableProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-blue-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                {typeLabel}
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
            {data.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-12 text-center text-gray-500">
                  <div className="flex flex-col items-center">
                    <User className="w-12 h-12 text-gray-400 mb-3" />
                    <p className="font-medium">No {typeLabel.toLowerCase()}s found</p>
                    {searchTerm && (
                      <p className="text-sm text-gray-400 mt-1">
                        No matches for "{searchTerm}"
                      </p>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              data.map((user) => (
                <tr key={user.userId} className="hover:bg-blue-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                      <Link
                        href={`/admin/users/${user.userId}`}
                        className="text-sm font-semibold text-gray-900 hover:text-blue-600"
                      >
                        {user.profile?.name || user.email || "No Name"}
                      </Link>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Mail size={14} /> {user.email}
                      </div>
                      {user.profile?.phone && (
                        <div className="flex items-center gap-2">
                          <Phone size={14} /> {user.profile.phone}
                        </div>
                      )}
                    </div>
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
  );
}