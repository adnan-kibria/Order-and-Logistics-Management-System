"use client";

import SideBar from "../components/sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <SideBar />
      <main className="flex-1 min-w-0 p-6 lg:p-10">
        {children}
      </main>
    </div>
  );
}