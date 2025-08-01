import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
    Home,
    TrendingUp,
    Compass,
    Globe,
    Plus,
    Settings,
    ChevronDown,
} from "lucide-react";

// Define the header height consistently
// **IMPORTANT**: Adjust this value if your PublicHeader's actual height changes
const HEADER_HEIGHT_PX = 69; // Based on your header's current styling.

const isPathActive = (pathname, path, subItems = []) => {
    if (!path) return false;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return subItems.some(item => item.path && pathname.startsWith(item.path));
};

function SidebarHeading({ label }) {
    return (
        <div className="px-4 pt-6 pb-2">
            <h3 className="text-xs font-semibold uppercase text-slate-500 tracking-wider">
                {label}
            </h3>
        </div>
    );
}

function SidebarItem({ item, active, isSubItem = false, onClick }) {
    const { icon, label, path } = item;

    return (
        <Link
            to={path}
            onClick={onClick}
            className={`
                group flex items-center gap-3 px-4 py-2.5 w-full
                transition-all duration-200 relative
                ${active
                    ? "bg-orange-50 text-orange-600 border-l-4 border-orange-500 font-semibold rounded-none"
                    : "text-slate-600 hover:text-orange-500 hover:bg-slate-50 rounded-lg"}
                ${isSubItem ? "pl-6" : ""}
            `}
        >
            <div className="flex items-center gap-3 pl-2">
                <div className={`${active ? "text-orange-600" : "text-slate-400 group-hover:text-orange-500"}`}>
                    {icon}
                </div>
            </div>
            <span className={`truncate ${isSubItem ? "text-[14px]" : "text-[15px]"} ${active ? "font-semibold text-orange-600" : ""}`}>
                {label}
            </span>
        </Link>
    );
}

function SidebarDropdown({ item, active, onClick }) {
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(active);
    const { icon, label, subItems } = item;

    const handleToggle = (e) => {
        e.preventDefault();
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        setIsOpen(active);
    }, [active]);

    return (
        <div>
            <div
                onClick={handleToggle}
                className={`
                    group flex items-center justify-between px-4 py-2.5 w-full cursor-pointer
                    transition-all duration-200 relative
                    ${active ? "bg-orange-50 text-orange-600 font-semibold border-l-4 border-orange-500 rounded-none" : "text-slate-600 hover:text-orange-500 hover:bg-slate-50 rounded-lg"}
                `}
            >
                <div className="flex items-center gap-3">
                    <div className={`${active ? "text-orange-600" : "text-slate-400 group-hover:text-orange-500"}`}>
                        {icon}
                    </div>
                    <span className="text-sm">{label}</span>
                </div>
                <div className={`transition-transform duration-300 ${isOpen ? "rotate-180 text-orange-500" : "rotate-0 text-slate-400 group-hover:text-orange-500"}`}>
                    <ChevronDown size={16} />
                </div>
            </div>

            <div className={`overflow-hidden transition-all duration-500 ease-out ${isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
                <div className="pt-1 pb-1 space-y-1">
                    {subItems.map((subItem, index) => (
                        <div
                            key={subItem.label}
                            className="animate-fadeInUp"
                            style={{
                                animationDelay: `${index * 50}ms`,
                                animationFillMode: 'both',
                            }}
                        >
                            <SidebarItem
                                item={subItem}
                                active={isPathActive(location.pathname, subItem.path)}
                                isSubItem={true}
                                onClick={onClick}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default function PublicSidebar({ sidebarOpen, setSidebarOpen }) {
    const location = useLocation();

    const navItems = [
        {
            type: 'group', items: [
                { icon: <Home size={18} />, label: "Home", path: "/citizen/home" },
                { icon: <TrendingUp size={18} />, label: "Popular", path: "/citizen/popular" },
                { icon: <Compass size={18} />, label: "Explore", path: "/citizen/explore" },
                { icon: <Globe size={18} />, label: "All", path: "/all" },
            ]
        },
        { type: 'heading', label: 'Custom Feeds' },
        {
            type: 'group', items: [
                { icon: <Plus size={18} />, label: "Create a custom feed", path: "/custom-feed" },
            ]
        },
        { type: 'heading', label: 'Communities' },
        {
            type: 'group', items: [
                { icon: <Plus size={18} />, label: "Create a community", path: "/create-community" },
                { icon: <Settings size={18} />, label: "Manage communities", path: "/citizen/manage" },
                {
                    icon: <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-blue-500 to-blue-400 shadow-sm" />,
                    label: "r/CityPlanning",
                    path: "/r/CityPlanning"
                },
                {
                    icon: <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-green-500 to-green-400 shadow-sm" />,
                    label: "r/Environment",
                    path: "/r/Environment"
                },
            ]
        },
    ];

    const closeSidebar = () => setSidebarOpen && setSidebarOpen(false);

    return (
        <>
            {/* Sidebar Overlay: Fixed, starts below the header, and has a Z-index LOWER than the header */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm lg:hidden transition-all duration-300 z-49" // z-index 49 (LOWER than header's z-50)
                    style={{ top: `${HEADER_HEIGHT_PX}px` }} // Starts below the header
                    aria-hidden="true"
                    onClick={closeSidebar}
                />
            )}

            {/* Sidebar itself: Fixed, starts below the header, takes remaining height, same z-index as header */}
            <aside className={`
                fixed top-[${HEADER_HEIGHT_PX}px] left-0 // Starts exactly below the header
                w-64 h-screen // Takes the remaining viewport height
                bg-white border-r border-slate-200/60
                z-50 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent // Same z-index as header, so it doesn't overlap header elements
                transition-transform duration-500 ease-out
                ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
            `}>
                {/* No internal header offset div needed here, as the 'top' positioning already handles it. */}

                <nav className="flex-grow pt-4 pb-6 px-0 overflow-y-auto relative z-10 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent space-y-1">
                    {navItems.map((section, index) => {
                        if (section.type === 'heading') {
                            return (
                                <div
                                    key={index}
                                    className="animate-fadeInUp"
                                    style={{
                                        animationDelay: `${index * 100}ms`,
                                        animationFillMode: 'both'
                                    }}
                                >
                                    <SidebarHeading label={section.label} />
                                </div>
                            );
                        }
                        if (section.type === 'group') {
                            return section.items.map((item, idx) => (
                                <div
                                    key={item.label + idx}
                                    className="animate-fadeInUp"
                                    style={{
                                        animationDelay: `${(index * 100) + (idx * 50)}ms`,
                                        animationFillMode: 'both'
                                    }}
                                >
                                    {item.subItems ? (
                                        <SidebarDropdown
                                            item={item}
                                            active={isPathActive(location.pathname, item.path, item.subItems)}
                                            onClick={closeSidebar}
                                        />
                                    ) : (
                                        <SidebarItem
                                            item={item}
                                            active={isPathActive(location.pathname, item.path)}
                                            onClick={closeSidebar}
                                        />
                                    )}
                                </div>
                            ));
                        }
                        return null;
                    })}
                </nav>

                <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white/80 to-transparent pointer-events-none" />

                <style dangerouslySetInnerHTML={{
                    __html: `
            @keyframes fadeInUp {
              from {
                opacity: 0;
                transform: translateY(20px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
            .animate-fadeInUp {
              animation: fadeInUp 0.6s ease-out forwards;
            }
            .scrollbar-thin::-webkit-scrollbar {
              width: 4px;
            }
            .scrollbar-thumb-slate-300::-webkit-scrollbar-thumb {
              background-color: #cbd5e1;
              border-radius: 2px;
            }
            .scrollbar-track-transparent::-webkit-scrollbar-track {
              background: transparent;
            }
            `
                }} />
            </aside>
        </>
    );
}