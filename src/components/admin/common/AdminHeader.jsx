import React, { useState, useEffect, useRef } from "react";
import {
  Menu,
  Search,
  ChevronDown,
  Bell,
  X,
  User,
  LogOut,
  Command,
} from "lucide-react";
import { useAuth } from "../../../context/AuthProvider"; // Import useAuth hook

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
  // toggleTheme prop is no longer needed as dark mode toggle is removed
}) {
  const { user, signOut } = useAuth(); // Use the auth hook to get user and signOut function
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  // isDarkMode state and handleThemeToggle are removed as per request
  const [searchFocused, setSearchFocused] = useState(false);
  const [notificationCount] = useState(3); // Keep notification count for demo
  const profileMenuRef = useRef(null);
  const mobileSearchRef = useRef(null);

  // Use user data from AuthContext
  const currentUser = user;

  const isLoggingOut = false; // This can be managed by your signOut mutation if applicable

  useOnClickOutside(profileMenuRef, () => setProfileMenuOpen(false));
  useOnClickOutside(mobileSearchRef, () => setMobileSearchOpen(false));

  const iconSize = 20;
  const name = currentUser?.fullName || currentUser?.email || "Anonymous User";
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
    return `hsl(${hue}, 70%, 50%)`;
  };

  const handleLogout = () => {
    signOut(); // Call the signOut function from AuthContext
    console.log("User logged out.");
  };

  const Avatar = () => {
    if (customer?.profileImage) {
      return (
        <div className="relative group">
          <img
            src={customer.profileImage}
            alt="User Avatar"
            className="w-10 h-10 rounded-full object-cover cursor-pointer transition-all duration-300 group-hover:ring-4 group-hover:ring-orange-500/20 group-hover:scale-105"
            onClick={() => setProfileMenuOpen(!profileMenuOpen)}
          />
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full ring-2 ring-white"></div>
        </div>
      );
    }
    return (
      <div className="relative group">
        <div
          onClick={() => setProfileMenuOpen(!profileMenuOpen)}
          className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white cursor-pointer transition-all duration-300 group-hover:ring-4 group-hover:ring-orange-500/20 group-hover:scale-105 shadow-lg"
          style={{
            backgroundColor: getColorFromName(name),
            background: `linear-gradient(135deg, ${getColorFromName(name)}, ${getColorFromName(name + "salt")})`
          }}
        >
          {getInitials(name)}
        </div>
        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full ring-2 ring-white"></div>
      </div>
    );
  };

  const iconButtonStyle = "p-2.5 rounded-xl hover:bg-gray-100/80 transition-all duration-200 hover:scale-105 backdrop-blur-sm";

  return (
    <header className="h-16 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 flex items-center justify-between px-4 sm:px-6 relative z-50">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className={`text-gray-700 ${iconButtonStyle} relative overflow-hidden group`}
          aria-label="Toggle Sidebar"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <Menu size={iconSize} className="relative z-10 transition-transform duration-200 group-hover:rotate-12" />
        </button>

        <div className="flex items-center group cursor-pointer">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-red-500 to-purple-600 font-bold text-lg flex items-center select-none">
            .OnGo Desk
          </span>
          <ChevronDown
            className="ml-1 text-gray-600 transition-transform duration-200 group-hover:rotate-180"
            size={16}
            aria-label="Branding dropdown"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Desktop Search */}
        <div className="hidden sm:block relative group">
          <div className={`absolute inset-0 bg-gradient-to-r from-orange-500/20 to-purple-500/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${searchFocused ? 'opacity-100' : ''}`}></div>
          <div className="relative">
            <Search
              className={`absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors duration-200 ${searchFocused ? 'text-orange-500' : 'text-gray-500'}`}
              size={16}
              aria-hidden="true"
            />
            <input
              type="text"
              placeholder="Search or type command..."
              className={`pl-10 pr-20 py-2.5 rounded-xl bg-gray-100/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-orange-500/50 text-sm w-full md:w-[320px] transition-all duration-300 focus:bg-white focus:shadow-lg ${searchFocused ? 'shadow-lg' : ''}`}
              aria-label="Search input"
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 shadow-sm pointer-events-none">
              <Command className="text-gray-600" size={12} />
              <span className="text-xs text-gray-600 font-medium">K</span>
            </div>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="sm:hidden" ref={mobileSearchRef}>
          <button
            onClick={() => setMobileSearchOpen(true)}
            className={`text-gray-700 ${iconButtonStyle} relative overflow-hidden group`}
            aria-label="Open search"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <Search size={iconSize} className="relative z-10 transition-transform duration-200 group-hover:scale-110" />
          </button>

          {mobileSearchOpen && (
            <div
              className="absolute top-0 left-0 w-full h-16 bg-white/95 backdrop-blur-xl shadow-lg flex items-center px-4 animate-in slide-in-from-top duration-300"
              style={{
                animation: 'slideDown 0.3s ease-out'
              }}
            >
              <Search className="text-orange-500 mr-3" size={18} />
              <input
                type="text"
                placeholder="Search..."
                autoFocus
                className="flex-grow bg-transparent outline-none text-sm text-gray-800 placeholder-gray-500"
                aria-label="Mobile search input"
              />
              <button
                onClick={() => setMobileSearchOpen(false)}
                aria-label="Close search"
                className="ml-3 text-gray-700 p-1 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                <X size={iconSize} />
              </button>
            </div>
          )}
        </div>

        {/* Notifications */}
        <button
          className={`relative text-gray-700 ${iconButtonStyle} group overflow-hidden`}
          aria-label="Notifications"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <Bell size={iconSize} className="relative z-10 transition-transform duration-200 group-hover:rotate-12" />
          {notificationCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full ring-2 ring-white animate-pulse">
              {notificationCount > 9 ? '9+' : notificationCount}
            </span>
          )}
        </button>

        {/* Profile Menu */}
        <div className="relative" ref={profileMenuRef}>
          <Avatar />

          {profileMenuOpen && (
            <div
              className="absolute top-12 right-0 w-72 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl text-sm z-50 origin-top-right border border-gray-200/50 overflow-hidden"
              style={{
                animation: 'slideIn 0.2s ease-out'
              }}
            >
              <div className="px-5 py-4 border-b border-gray-200/50 bg-gradient-to-r from-orange-500/5 to-purple-500/5">
                <div className="flex items-center gap-3">
                  <Avatar />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 truncate">{name}</p>
                    <p className="text-xs text-gray-500 truncate">{email}</p>
                  </div>
                </div>
              </div>

              {/* Removed My Profile and Settings links */}

              <div className="py-2 border-t border-gray-200/50">
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="flex items-center w-full px-5 py-3 text-red-600 hover:bg-gradient-to-r hover:from-red-500/10 hover:to-pink-500/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 group"
                >
                  <LogOut size={16} className="mr-3 transition-transform duration-200 group-hover:scale-110" />
                  <span className="font-medium">
                    {isLoggingOut ? "Logging out..." : "Logout"}
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes slideDown {
          from {
            transform: translateY(-100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes slideIn {
          from {
            transform: scale(0.95) translateY(-10px);
            opacity: 0;
          }
          to {
            transform: scale(1) translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </header>
  );
}
