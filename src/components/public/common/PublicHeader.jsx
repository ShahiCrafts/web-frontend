import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from "react-router-dom";
import {
    Plus,
    MessageSquareText,
    ChevronDown,
    Menu,
    Search,
    User,
    LayoutDashboard,
    Activity,
    LifeBuoy,
    MessageSquareText as FeedbackIcon,
    LogOut,
    Moon,
    Sun,
} from 'lucide-react';
import logo from '../../../assets/logo.png';
import { useAuth } from '../../../context/AuthProvider';
import { AnimatePresence, motion } from "framer-motion";
import { useLogoutTan } from "../../../hooks/useLoginTan";
import { useNavigate } from 'react-router-dom';
import { CustomAvatar } from '../../../pages/profile/CustomAvatar';

const useOnClickOutside = (ref, handler) => {
    useEffect(() => {
        const listener = (event) => {
            if (!ref.current || !event.target || ref.current.contains(event.target)) return;
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

export default function PublicHeader({
    sidebarOpen,
    setSidebarOpen,
    customer,
    toggleTheme,
    onCreatePostClick
}) {
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);
    const [searchFocused, setSearchFocused] = useState(false);
    const profileMenuRef = useRef(null);
    const { user: currentUser } = useAuth();
    const { mutate: logoutUser } = useLogoutTan();
    const navigate = useNavigate();

    useOnClickOutside(profileMenuRef, () => setProfileMenuOpen(false));

    const name = currentUser?.fullName || "Anonymous User";
    const email = currentUser?.email || "user@example.com";

    // These functions are unused in the current render logic within PublicHeader,
    // but they are part of the original CustomAvatar component's internal logic.
    // Keeping them here for completeness if they were meant to be used for avatar within header directly.
    const getInitials = (name) =>
        name?.split(" ").map((n) => n[0]).join("").toUpperCase();

    const getColorFromName = (name) => {
        const hash = Array.from(name).reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const hue = hash % 360;
        return `hsl(${hue}, 65%, 50%)`;
    };

    const handleLogout = () => {
        logoutUser();
        setProfileMenuOpen(false); // Close menu on logout
    };

    const ProfileDropdown = () => (
        <motion.div
            ref={profileMenuRef}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute top-full mt-2 right-0 w-64 bg-white/95 backdrop-blur-xl border border-gray-200/50 rounded-xl shadow-xl z-50 overflow-hidden"
        >
            <div className="px-4 py-4 border-b border-gray-100/50 bg-gradient-to-r from-gray-50/50 to-white/50">
                <div className="flex items-center gap-3">
                    <CustomAvatar
                        fullName={name}
                        imageUrl={customer?.profileImage || currentUser?.profileImage}
                        size="w-9 h-9"
                    />
                    <div>
                        <p className="text-sm font-semibold text-gray-900 leading-tight">{name}</p>
                        <p className="text-xs text-gray-500">{email}</p>
                    </div>
                </div>
            </div>
            <ul className="py-2">
                <li>
                    <motion.button
                        whileHover={{ backgroundColor: "rgba(249, 250, 251, 0.8)" }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:text-gray-900 transition-colors duration-200 flex items-center gap-2"
                        onClick={() => {
                            navigate('/citizen/profile')
                            setProfileMenuOpen(false);
                        }}
                    >
                        <User size={18} className="text-gray-500" />
                        Profile Settings
                    </motion.button>
                </li>
                <li>
                    <motion.button
                        whileHover={{ backgroundColor: "rgba(249, 250, 251, 0.8)" }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:text-gray-900 transition-colors duration-200 flex items-center gap-2"
                        onClick={() => { setProfileMenuOpen(false); /* Add navigation to help/support */ }}
                    >
                        <LifeBuoy size={18} className="text-gray-500" />
                        Help & Support
                    </motion.button>
                </li>
                {/* Theme Toggle option */}
                {toggleTheme && (
                    <li>
                        <motion.button
                            whileHover={{ backgroundColor: "rgba(249, 250, 251, 0.8)" }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:text-gray-900 transition-colors duration-200 flex items-center gap-2"
                            onClick={() => {
                                toggleTheme();
                                setProfileMenuOpen(false);
                            }}
                        >
                            {/* You might want to pass current theme to show appropriate icon */}
                            {/* For now, just a generic toggle icon or a single theme icon */}
                            <Sun size={18} className="text-gray-500" /> {/* Or a dynamic icon */}
                            Toggle Theme
                        </motion.button>
                    </li>
                )}
                <li className="border-t border-gray-100 mt-2 pt-2">
                    <motion.button
                        whileHover={{ backgroundColor: "rgba(254, 242, 242, 0.8)" }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full text-left px-4 py-3 text-sm text-red-600 hover:text-red-700 transition-colors duration-200 flex items-center gap-2"
                        onClick={handleLogout}
                    >
                        <LogOut size={18} className="text-red-500" />
                        Logout
                    </motion.button>
                </li>
            </ul>
        </motion.div>
    );

    return (
        // Changed z-index from z-50 (implicit from sticky) to an explicit higher value
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-full bg-white/80 backdrop-blur-xl border-b border-gray-200/50 py-3 z-[60] sticky top-0" // Explicit z-index: 60
        >
            <div className="w-full max-w-7xl flex items-center justify-between mx-auto relative px-4 sm:px-6 md:px-6 lg:px-0">
                {/* Mobile Left Section (Hamburger Menu & Logo/Dropdown) */}
                <div className="flex items-center gap-3 md:hidden">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="text-gray-700 p-2 rounded-xl hover:bg-gray-100/80 transition-all duration-200"
                        aria-label="Toggle Sidebar"
                    >
                        <Menu size={24} />
                    </motion.button>
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="flex items-center gap-2 select-none cursor-pointer"
                        onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                    >
                        <img src={logo.src || logo} alt="logo" className="w-8 h-8 rounded-full shadow-lg" />
                        <span className="text-lg font-bold bg-gradient-to-r from-[#FF5C00] to-[#FF8A00] bg-clip-text text-transparent">
                            .OnGoDesk
                        </span>
                        <motion.div
                            animate={{ rotate: profileMenuOpen ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <ChevronDown size={18} className="text-gray-600" />
                        </motion.div>
                    </motion.div>
                </div>

                {/* Desktop Logo */}
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="hidden md:flex items-center gap-3 cursor-pointer"
                >
                    <motion.img
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.8 }}
                        src={logo.src || logo}
                        alt="logo"
                        className="w-8 h-8 rounded-full shadow-lg"
                    />
                    <span className="text-xl font-bold bg-gradient-to-r from-[#FF5C00] to-[#FF8A00] bg-clip-text text-transparent">
                        .OnGoDesk
                    </span>
                </motion.div>

                {/* Search */}
                <div className="flex-1 mx-4 hidden md:flex justify-center">
                    <div className="relative w-full max-w-md">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                            <Search size={16} />
                        </div>
                        <input
                            type="text"
                            placeholder="Search .OnGoDesk"
                            onFocus={() => setSearchFocused(true)}
                            onBlur={() => setSearchFocused(false)}
                            className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-gray-50/80 border border-transparent focus:border-[#FF5C00]/30 focus:bg-white/90 focus:outline-none transition-all placeholder-gray-500 ${searchFocused ? "shadow ring-2 ring-[#FF5C00]/10" : "hover:bg-gray-100"
                                }`}
                        />
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                    {/* Mobile Actions */}
                    <div className="relative flex md:hidden items-center gap-2">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="text-gray-600 p-2 rounded-xl hover:bg-gray-100/80 transition-all duration-200"
                            aria-label="Search"
                        >
                            <Search size={22} />
                        </motion.button>

                        {/* Mobile Profile Dropdown (triggered by logo click now, but keeping this div structure for consistency if separate button is desired) */}
                        <div
                            className="relative cursor-pointer p-1 rounded-xl hover:bg-gray-100/80 transition-all duration-200"
                            onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                        >
                            <CustomAvatar
                                fullName={name}
                                imageUrl={customer?.profileImage || currentUser?.profileImage}
                                size="w-9 h-9"
                            />
                        </div>
                        <AnimatePresence>
                            {profileMenuOpen && <ProfileDropdown />}
                        </AnimatePresence>
                    </div>

                    {/* Desktop Actions */}
                    <div className="hidden md:flex items-center gap-3">
                        <motion.button
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            className="hidden md:flex items-center gap-1 text-xs font-medium px-4 py-2 rounded-xl bg-gray-50/80 hover:bg-gradient-to-r hover:from-[#FF5C00] hover:to-[#FF8A00] hover:text-white text-gray-700 border border-gray-200 transition"
                            onClick={() => {
                                onCreatePostClick?.();
                            }}
                        >
                            <Plus size={18} />
                            <span className="hidden lg:inline text-sm">Create Post</span>
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            className="hover:bg-gray-100/80 p-2.5 rounded-xl transition-all duration-200 relative group"
                        >
                            <MessageSquareText className="text-gray-700 group-hover:text-[#FF5C00] transition-colors" size={20} />
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"
                            />
                        </motion.button>

                        {/* Desktop Profile Dropdown Trigger */}
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="relative hidden lg:flex items-center gap-3 cursor-pointer px-3 py-2 rounded-xl hover:bg-gray-100/80 transition-all duration-200"
                            onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                        >
                            <CustomAvatar
                                fullName={name}
                                imageUrl={customer?.profileImage || currentUser?.profileImage}
                                size="w-9 h-9"
                            />
                            <div className="text-sm text-gray-800 leading-tight select-none">
                                <p className="font-semibold">{name}</p>
                                <p className="text-xs text-transparent bg-gradient-to-r from-[#FF5C00] to-[#FF8A00] bg-clip-text font-medium">
                                    12 OGD Pts.
                                </p>
                            </div>
                            <motion.div
                                animate={{ rotate: profileMenuOpen ? 180 : 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <ChevronDown size={16} className="text-gray-600" />
                            </motion.div>
                            <AnimatePresence>
                                {profileMenuOpen && <ProfileDropdown />}
                            </AnimatePresence>
                        </motion.div>
                    </div>
                </div>
            </div>
        </motion.nav>
    );
}