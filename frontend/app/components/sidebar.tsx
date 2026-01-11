"use client";

import { LayoutDashboard, Users, ShoppingCart, User, ChevronDown, ChevronRight, Menu, X, LogOut, User as UserIcon  } from "lucide-react";
import Link from "next/link";
import { cn } from "../lib/utils";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AuthService } from "../_services/auth.service";

export const navItem = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  {
    name: "Users",
    href: "/admin/users",
    icon: Users,
    children: [
      { name: "Customer", href: "/admin/users/customer", icon: User },
      { name: "Deliveryman", href: "/admin/users/deliveryman", icon: User },
      { name: "Inventory", href: "/admin/users/inventorymanager", icon: User },
    ],
  },
  { name: "Order", href: "/admin/order", icon: ShoppingCart },
];

export function SidebarItem({ item, pathname, isOpen, onToggle, onCloseSidebar }: SidebarItemProps) {
  const Icon = item.icon;
  const isActive = pathname === item.href || (item.children && pathname.startsWith(item.href));
  
  return (
    <div className="w-full">
      <div className="flex items-center">
        <Link
          href={item.href}
          onClick={onCloseSidebar}
          className={cn(
            "flex-1 flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all text-sm",
            isActive ? "bg-indigo-50 text-indigo-600 font-semibold" : "text-gray-600 hover:bg-gray-50"
          )}
        >
          <Icon className="w-5 h-5" />
          <span>{item.name}</span>
        </Link>

        {item.children && (
          <button onClick={onToggle} className="p-2 text-gray-400 hover:text-indigo-600">
            {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
        )}
      </div>

      {item.children && isOpen && (
        <div className="ml-9 mt-1 space-y-1 border-l border-gray-100">
          {item.children.map((child: any) => (
            <Link
              key={child.href}
              href={child.href}
              onClick={onCloseSidebar}
              className={cn(
                "block py-2 px-4 text-sm transition-colors",
                pathname === child.href ? "text-indigo-600 font-medium" : "text-gray-500 hover:text-indigo-600"
              )}
            >
              {child.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function SideBar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [usersOpen, setUsersOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    AuthService.user().then(setUser).catch(() => router.push("/signin"));
    if (pathname.includes("/users")) setUsersOpen(true);
  }, [pathname, router]);

  const handleLogout = async () => {
    await AuthService.logout();
    localStorage.clear();
    router.push("/signin");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <button onClick={() => setSidebarOpen(true)} className="lg:hidden fixed top-4 left-4 z-40 p-2 bg-white shadow-sm border rounded-md">
        <Menu size={24} className="text-gray-600" />
      </button>
      {sidebarOpen && <div className="fixed inset-0 bg-black/20 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r transform transition-transform lg:translate-x-0 lg:static lg:block",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-full flex flex-col p-4">
          <div className="flex items-center justify-between mb-8 px-2">
            <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Admin Panel
            </h2>
            <X className="lg:hidden cursor-pointer text-gray-400" onClick={() => setSidebarOpen(false)} />
          </div>

          <nav className="flex-1 space-y-1">
            {navItem.map((item) => (
              <SidebarItem
                key={item.href}
                item={item}
                pathname={pathname}
                isOpen={item.name === "Users" && usersOpen}
                onToggle={() => setUsersOpen(!usersOpen)}
                onCloseSidebar={() => setSidebarOpen(false)}
              />
            ))}
          </nav>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center gap-3 px-2 mb-4">
              <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white">
                <UserIcon size={18}/>
              </div>
              <div className="text-sm truncate">
                <p className="font-semibold text-gray-900">{user?.role || "Admin"}</p>
                <p className="text-gray-500 text-xs truncate">{user?.email}</p>
              </div>
            </div>
            <button onClick={handleLogout} className="w-full flex items-center gap-2 p-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors">
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}