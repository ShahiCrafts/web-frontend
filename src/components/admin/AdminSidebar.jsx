import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  AlertCircle,
  Users,
  Map,
  Flag,
  Bell,
  BarChart,
  Settings,
  HelpCircle,
  Megaphone,
  Timer
} from "lucide-react";

export default function AdminSidebar({ sidebarOpen, setSidebarOpen }) {
  const location = useLocation();

  const navItems = [
    { icon: <LayoutDashboard size={18} />, label: "Dashboard", path: "/admin/dashboard" },
    { icon: <AlertCircle size={18} />, label: "Issue Management", path: "/admin/issues" },
    { icon: <Users size={18} />, label: "User Directory", path: "/admin/users" },
    { icon: <Map size={18} />, label: "Interactive Map", path: "/admin/map" },
    { icon: <Flag size={18} />, label: "Flagged Content", path: "/admin/flags" },
    { icon: <Bell size={18} />, label: "Notifications", path: "/admin/notifications" },
    { icon: <BarChart size={18} />, label: "Report & Analytics", path: "/admin/reports" },
    { icon: <Settings size={18} />, label: "System Settings", path: "/admin/settings" },
    { icon: <Megaphone size={18} />, label: "Announcements", path: "/admin/announcements" },
    { icon: <Timer size={18} />, label: "Community Events", path: "/admin/events" },
  ];

  return (
    <>
      {/* Fixed background overlay on mobile, closes sidebar on click */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 backdrop-blur-xs bg-white/5 lg:hidden" 
          aria-hidden="true"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-white shadow-md flex flex-col
        transform transition-transform duration-300 ease-in-out z-40 overflow-auto
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 lg:static lg:shadow-none`}
      >
        <nav className="p-4 space-y-4 flex-grow">
          {navItems.map(({ icon, label, path }) => (
            <SidebarItem
              key={label}
              icon={icon}
              label={label}
              path={path}
              active={location.pathname === path}
              onClick={() => setSidebarOpen(false)}
            />
          ))}
        </nav>

        <div className="p-4 mb-4">
          <SidebarItem
            icon={<HelpCircle size={18} />}
            label="Help Center"
            path="/login"
            active={false}
            onClick={() => setSidebarOpen(false)}
          />
        </div>
      </aside>
    </>
  );
}

function SidebarItem({ icon, label, path, active, onClick }) {
  return (
    <Link
      to={path}
      onClick={onClick}
      className={`flex items-center space-x-2 text-gray-700 font-semibold rounded p-2 cursor-pointer hover:bg-gray-100 ${active ? "bg-gray-100" : ""
        }`}
    >
      {icon}
      <span className="text-[15px] font-medium">{label}</span>
    </Link>
  );
}
