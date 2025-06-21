import React, { useState } from "react";
import AdminHeader from "../admin/AdminHeader";
import AdminSidebar from "../admin/AdminSidebar";
import { Outlet } from "react-router-dom";

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <AdminHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex flex-1 overflow-hidden">
        <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main
          className="flex-1 overflow-y-auto h-[calc(100vh-64px)] px-3 py-3"
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
