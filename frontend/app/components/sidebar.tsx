"use client";

import { LayoutDashboard, Users, ShoppingCart, LogOut, User, Menu, X, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AuthService } from "../_services/auth.service";

export default function SideBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showUsers, setShowUsers] = useState(true);
  const [user, setUser] = useState<any>(null);
  
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    AuthService.user()
      .then(setUser)
      .catch(() => router.push("/signin"));
  }, []);

  useEffect(() => {
    if (pathname.includes("/admin/users")) {
      setShowUsers(true);
    }
  }, [pathname]);

  const active = (path: string) => pathname === path || (path !== "/admin/dashboard" && pathname.startsWith(path)) 
    ? "bg-indigo-50 text-indigo-600 font-bold" 
    : "text-gray-600 hover:bg-gray-50";

  return (
    <>
      <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white border rounded-md">
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-indigo-500 p-4 transition-transform lg:translate-x-0 lg:static ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex flex-col h-full">
          <h1 className="text-xl font-bold text-indigo-600 mb-8 px-2">Admin Panel</h1>

          <nav className="flex-1 space-y-1">
            <Link href="/admin/dashboard" className={`flex items-center gap-3 p-2.5 rounded-lg text-sm ${active("/admin/dashboard")}`}>
              <LayoutDashboard size={18} /> Dashboard
            </Link>

            <div>
              <div className={`flex items-center justify-between rounded-lg ${active("/admin/users")}`}>
                <Link href="/admin/users" className="flex flex-1 items-center gap-3 p-2.5 text-sm">
                  <Users size={18} /> Users
                </Link>
                <button 
                  onClick={(e) => { e.preventDefault(); setShowUsers(!showUsers); }} 
                  className="p-2.5 hover:bg-indigo-100 rounded-r-lg transition-colors"
                >
                  <ChevronDown size={14} className={`transition-transform ${showUsers ? "rotate-180" : ""}`} />
                </button>
              </div>
              
              {showUsers && (
                <div className="ml-9 mt-1 space-y-1 border-l border-gray-300 pl-2">
                  <Link href="/admin/users/customer" className={`block p-2 text-xs ${pathname === "/admin/users/customer" ? "text-indigo-600 font-bold" : "text-gray-500 hover:text-indigo-600"}`}>Customer</Link>
                  <Link href="/admin/users/deliveryman" className={`block p-2 text-xs ${pathname === "/admin/users/deliveryman" ? "text-indigo-600 font-bold" : "text-gray-500 hover:text-indigo-600"}`}>Deliveryman</Link>
                  <Link href="/admin/users/inventorymanager" className={`block p-2 text-xs ${pathname === "/admin/users/inventorymanager" ? "text-indigo-600 font-bold" : "text-gray-500 hover:text-indigo-600"}`}>Inventory</Link>
                </div>
              )}
            </div>

            <Link href="/admin/order" className={`flex items-center gap-3 p-2.5 rounded-lg text-sm ${active("/admin/order")}`}>
              <ShoppingCart size={18} /> Orders
            </Link>
          </nav>

          <div className="pt-4 border-t border-gray-400">
            <div className="flex items-center gap-3 px-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-[10px] uppercase font-bold">
                {user?.role?.slice(0, 2) || "AD"}
              </div>
              <div className="text-xs truncate">
                <p className="font-bold text-gray-900">{user?.role || "Admin"}</p>
                <p className="text-gray-400">{user?.email}</p>
              </div>
            </div>
            <button onClick={() => { AuthService.logout(); router.push("/signin"); }} className="flex items-center gap-2 w-full p-2.5 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors">
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}