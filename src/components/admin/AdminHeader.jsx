import React, { useState, useEffect, useRef } from "react";
import {
  Menu,
  Search,
  ChevronDown,
  Bell,
  Keyboard,
  X,
  Sun,
  User,
  LogOut,
  Settings,
} from "lucide-react";
import { useAuth } from '../../auth/AuthProvider';
import { AnimatePresence, motion } from "framer-motion";
import { useLogoutTan } from "../../hooks/useLoginTan";

const useOnClickOutside = (ref, handler) => {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) return;
      handler(event);
    };
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
};

export default function AdminHeader({
  sidebarOpen,
  setSidebarOpen,
  customer,
  toggleTheme,
}) {
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);
  const mobileSearchRef = useRef(null);
  const { user: currentUser } = useAuth();


  const { mutate: logoutUser, isLoading: isLoggingOut } = useLogoutTan();

  useOnClickOutside(profileMenuRef, () => setProfileMenuOpen(false));
  useOnClickOutside(mobileSearchRef, () => setMobileSearchOpen(false));

  const iconSize = 20;
  const name = currentUser?.fullName || "Anonymous User";
  const email = currentUser?.email || "user@example.com";

  const getInitials = (name) =>
    name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  const getColorFromName = (name) => {
    const hash = Array.from(name).reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const hue = hash % 360;
    return `hsl(${hue}, 60%, 55%)`;
  };

  const Avatar = () => {
    if (customer?.profileImage) {
      return (
        <img
          src={customer.profileImage}
          alt="User Avatar"
          className="w-9 h-9 rounded-full object-cover cursor-pointer transition-all"
          onClick={() => setProfileMenuOpen(!profileMenuOpen)}
        />
      );
    }
    return (
      <div
        onClick={() => setProfileMenuOpen(!profileMenuOpen)}
        className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white cursor-pointer transition-all"
        style={{ backgroundColor: getColorFromName(name) }}
      >
        {getInitials(name)}
      </div>
    );
  };
  
  const handleLogout = () => {
    logoutUser();
  };

  const iconButtonStyle = "p-2 rounded-full hover:bg-gray-100 transition";

  return (
    <header className="h-16 bg-white flex items-center justify-between px-4 sm:px-6 relative z-50 shadow-sm">
      {/* Left */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className={`text-gray-700 ${iconButtonStyle}`}
          aria-label="Toggle Sidebar"
        >
          <Menu size={iconSize} />
        </button>
        <span className="text-orange-500 font-bold text-lg flex items-center select-none">
          .OnGo Desk
          <ChevronDown
            className="ml-1 text-gray-600 cursor-pointer"
            size={16}
            aria-label="Branding dropdown"
          />
        </span>
      </div>

      <div className="flex items-center gap-3 md:gap-5">
        <div className="hidden sm:block relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            size={16}
            aria-hidden="true"
          />
          <input
            type="text"
            placeholder="Search or type command..."
            className="pl-10 pr-20 py-2 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm w-full md:w-[320px] transition-all"
            aria-label="Search input"
          />
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1 bg-white rounded px-1.5 py-0.5 shadow-sm pointer-events-none">
            <Keyboard className="text-gray-600" size={12} />
            <span className="text-xs text-gray-600 font-sans">K</span>
          </div>
        </div>

        <div className="sm:hidden" ref={mobileSearchRef}>
          <button
            onClick={() => setMobileSearchOpen(true)}
            className={`text-gray-700 ${iconButtonStyle}`}
            aria-label="Open search"
          >
            <Search size={iconSize} />
          </button>

          <AnimatePresence>
            {mobileSearchOpen && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className="absolute top-0 left-0 w-full h-16 bg-white shadow-md flex items-center px-4"
              >
                <Search className="text-gray-500 mr-3" size={18} />
                <input
                  type="text"
                  placeholder="Search..."
                  autoFocus
                  className="flex-grow bg-transparent outline-none text-sm text-gray-800"
                  aria-label="Mobile search input"
                />
                <button
                  onClick={() => setMobileSearchOpen(false)}
                  aria-label="Close search"
                  className="ml-3 text-gray-700"
                >
                  <X size={iconSize} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button
          onClick={toggleTheme}
          className={`text-gray-700 ${iconButtonStyle}`}
          aria-label="Toggle theme"
        >
          <Sun size={iconSize} />
        </button>

        <button
          className={`relative text-gray-700 ${iconButtonStyle}`}
          aria-label="Notifications"
        >
          <Bell size={iconSize} />
          <span className="absolute top-0.5 right-0.5 block w-2 h-2 bg-green-500 rounded-full ring-2 ring-white" />
        </button>

        <div className="relative" ref={profileMenuRef}>
          <Avatar />
          <AnimatePresence>
            {profileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="absolute top-12 right-0 w-64 bg-white rounded-lg shadow-xl text-sm z-50 origin-top-right"
              >
                <div className="px-4 py-3 border-b border-gray-200">
                  <p className="font-semibold text-gray-800 truncate">{name}</p>
                  <p className="text-xs text-gray-500 truncate">{email}</p>
                </div>
                <div className="py-2">
                  <a href="#" className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100">
                    <User size={16} className="mr-3" /> My Profile
                  </a>
                  <a href="#" className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100">
                    <Settings size={16} className="mr-3" /> Settings
                  </a>
                </div>
                <div className="py-2 border-t border-gray-200">
                  <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <LogOut size={16} className="mr-3" />
                    {isLoggingOut ? "Logging out..." : "Logout"}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}