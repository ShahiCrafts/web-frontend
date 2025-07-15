import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  Calendar,
  ShieldCheck,
  ChevronDown,
  ChevronRight,
  UserCircle,
  Vote,
  GitPullRequestArrow,
  Bell,
  Settings,
  Tags,
  Shield,
  Palette,
  Building2,
  Sparkles,
  Activity,
  TrendingUp
} from "lucide-react";

const isPathActive = (pathname, path, subItems = []) => {
  if (!path) return false;
  if (path !== '/' && pathname.startsWith(path)) return true;
  return subItems.some(item => item.path && pathname.startsWith(item.path));
};

function SidebarHeading({ label }) {
  return (
    <div className="px-4 pt-6 pb-3 relative">
      <h3 className="text-xs font-bold uppercase text-slate-500 tracking-wider">
        {label}
      </h3>
    </div>
  );
}

export default function AdminSidebar({ sidebarOpen, setSidebarOpen }) {
  const location = useLocation();
  const [hoveredItem, setHoveredItem] = useState(null);

  const closeSidebar = () => setSidebarOpen && setSidebarOpen(false);

  const navItems = [
    { type: 'heading', label: 'General' },
    {
      icon: <LayoutDashboard size={20} />,
      label: "Overview",
      path: "/admin/overview",
      color: "from-blue-500 to-cyan-500",
      description: "Dashboard & analytics"
    },
    { type: 'heading', label: 'Community Management' },
    {
      icon: <Users size={20} />,
      label: "User Management",
      path: "/admin/users",
      color: "from-green-500 to-emerald-500",
      description: "Manage community members",
      subItems: [
        { label: "All Users", path: "/admin/users/all", icon: <Users size={16} /> },
        { label: "Citizens", path: "/admin/users/citizens", icon: <UserCircle size={16} /> },
        { label: "Organizations", path: "/admin/users/organizations", icon: <Building2 size={16} /> },
      ],
    },
    {
      icon: <MessageSquare size={20} />,
      label: "Discussions",
      path: "/admin/discussions",
      color: "from-purple-500 to-violet-500",
      description: "Community conversations"
    },
    {
      icon: <GitPullRequestArrow size={20} />,
      label: "Community Requests",
      path: "/admin/communities",
      color: "from-lime-500 to-green-500",
      description: "Community Management"
    },
    {
      icon: <Calendar size={20} />,
      label: "Events",
      path: "/admin/events",
      color: "from-orange-500 to-red-500",
      description: "Community events"
    },
    {
      icon: <Vote size={20} />,
      label: "Polls & Surveys",
      path: "/admin/polls",
      color: "from-pink-500 to-rose-500",
      description: "Community feedback"
    },
    {
      icon: <ShieldCheck size={20} />,
      label: "Content Moderation",
      count: 8,
      path: "/admin/flags",
      color: "from-amber-500 to-orange-500",
      description: "Review flagged content",
      urgent: true
    },
    { type: 'heading', label: 'Administration' },
    {
      icon: <Shield size={20} />,
      label: "Roles & Permissions",
      path: "/admin/roles",
      color: "from-indigo-500 to-blue-500",
      description: "Access control"
    },
    {
      icon: <Bell size={20} />,
      label: "Notifications",
      path: "/admin/notifications",
      color: "from-teal-500 to-cyan-500",
      description: "System notifications"
    },
    {
      icon: <Tags size={20} />,
      label: "Categories & Tags",
      path: "/admin/categories",
      color: "from-lime-500 to-green-500",
      description: "Content organization"
    },
    {
      icon: <Building2 size={20} />,
      label: "Tenants",
      path: "/admin/tenants",
      color: "from-gray-500 to-slate-500",
      description: "Multi-tenant management"
    },
    {
      icon: <Settings size={20} />,
      label: "Settings",
      path: "/admin/settings",
      color: "from-slate-500 to-gray-500",
      description: "System configuration"
    },
  ];

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden transition-opacity duration-300"
          aria-hidden="true"
          onClick={closeSidebar}
        />
      )}

      <aside
        className={`fixed top-16 left-0
          h-screen lg:h-[calc(100vh-4rem)]
          w-72 flex flex-col overflow-hidden
          bg-white/95 backdrop-blur-xl border-r border-gray-200/50
          transform transition-all duration-300 ease-in-out
          z-50 shadow-2xl
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static`}
      >
        <nav className="flex-grow p-2 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          {navItems.map((item, index) => {
            if (item.type === 'heading') {
              return <SidebarHeading key={index} label={item.label} />
            }
            return item.subItems ? (
              <SidebarDropdown
                key={item.label}
                item={item}
                active={isPathActive(location.pathname, item.path, item.subItems)}
                onClick={closeSidebar}
              />
            ) : (
              <SidebarItem
                key={item.label}
                item={item}
                active={isPathActive(location.pathname, item.path)}
                onClick={closeSidebar}
                onHover={setHoveredItem}
                isHovered={hoveredItem === item.label}
              />
            )
          })}
        </nav>

        <div className="p-4 border-t border-gray-200/50 bg-gradient-to-r from-gray-50/50 to-slate-50/50 backdrop-blur-sm">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-2">
              <Sparkles size={14} className="text-orange-500" />
              <span className="font-medium">OnGo Admin</span>
            </div>
            <div className="flex items-center gap-1">
              <Activity size={12} className="text-green-500" />
              <span>Online</span>
            </div>
          </div>
        </div>
      </aside>

      <style jsx>{`
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        .scrollbar-thumb-gray-300::-webkit-scrollbar-thumb {
          background-color: #d1d5db;
          border-radius: 3px;
        }
        .scrollbar-thumb-gray-300::-webkit-scrollbar-thumb:hover {
          background-color: #9ca3af;
        }
        .scrollbar-track-transparent::-webkit-scrollbar-track {
          background: transparent;
        }
      `}</style>
    </>
  );
}

function SidebarDropdown({ item, active, onClick }) {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(active);
  const [isDropdownHovered, setIsDropdownHovered] = useState(false);
  const { icon, label, count, subItems, color, description, urgent } = item;

  const handleToggle = (e) => {
    e.preventDefault();
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (active) {
      setIsOpen(true);
    } else {
      const anySubItemActive = subItems.some(subItem => isPathActive(location.pathname, subItem.path));
      if (!anySubItemActive) {
        setIsOpen(false);
      }
    }
  }, [active, location.pathname, subItems]);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsDropdownHovered(true)}
      onMouseLeave={() => setIsDropdownHovered(false)}
    >
      <div
        onClick={handleToggle}
        className={`group flex items-center justify-between rounded-xl p-3 cursor-pointer transition-all duration-200 mx-2 relative overflow-hidden
          ${active
            ? 'bg-gradient-to-r from-orange-500/10 to-purple-500/10 text-gray-900 shadow-lg'
            : 'hover:bg-gray-50 text-gray-700 hover:shadow-md'
          }
          ${isDropdownHovered ? 'scale-105 shadow-lg' : ''}
        `}
      >
        <div className={`absolute inset-0 bg-gradient-to-r ${color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>

        <div className="flex items-center space-x-3 relative z-10">
          <div className={`p-2 rounded-lg transition-all duration-200 ${active ? `bg-gradient-to-r ${color} text-white shadow-lg` : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'}`}>
            {React.cloneElement(icon, { size: 18 })}
          </div>
          <div className="flex-1 min-w-0">
            <span className={`text-sm font-semibold block ${active ? 'text-gray-900' : 'text-gray-700'}`}>
              {label}
            </span>
            {description && (
              <span className="text-xs text-gray-500 block truncate mt-0.5">
                {description}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2 relative z-10">
          {count && (
            <span className={`text-xs font-bold rounded-full px-2 py-1 transition-all duration-200 ${
              urgent
                ? 'bg-red-500 text-white animate-pulse'
                : active
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-200 text-gray-600 group-hover:bg-gray-300'
            }`}>
              {count}
            </span>
          )}
          <div className={`p-1 rounded-lg transition-all duration-200 ${isOpen ? 'rotate-180' : ''}`}>
            <ChevronDown size={16} className="text-gray-500" />
          </div>
        </div>
      </div>

      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="pl-6 pr-2 pt-2 pb-1 space-y-1">
          {subItems.map((subItem, index) => (
            <SidebarItem
              key={subItem.label}
              item={subItem}
              active={location.pathname === subItem.path}
              isSubItem={true}
              onClick={() => onClick()}
              delay={index * 50}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function SidebarItem({ item, active, isSubItem = false, onClick, onHover, isHovered, delay = 0 }) {
  const { icon, label, path, count, color, description, urgent } = item;

  return (
    <Link
      to={path}
      onClick={onClick}
      onMouseEnter={() => onHover && onHover(label)}
      onMouseLeave={() => onHover && onHover(null)}
      className={`group flex items-center justify-between rounded-xl cursor-pointer transition-all duration-200 relative overflow-hidden
        ${isSubItem ? 'p-2 mx-2' : 'p-3 mx-2'}
        ${active
          ? isSubItem
            ? 'bg-gradient-to-r from-orange-500/10 to-purple-500/10 text-gray-900 shadow-md'
            : 'bg-gradient-to-r from-orange-500/10 to-purple-500/10 text-gray-900 shadow-lg'
          : 'hover:bg-gray-50 text-gray-700 hover:shadow-md'
        }
        ${isHovered ? 'scale-105 shadow-lg' : ''}
      `}
      style={{ animationDelay: `${delay}ms` }}
    >
      {color && (
        <div className={`absolute inset-0 bg-gradient-to-r ${color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
      )}

      <div className="flex items-center space-x-3 relative z-10 flex-1 min-w-0">
        {icon && (
          <div className={`${isSubItem ? 'p-1.5' : 'p-2'} rounded-lg transition-all duration-200 flex-shrink-0 ${
            active
              ? color
                ? `bg-gradient-to-r ${color} text-white shadow-lg`
                : 'bg-gray-900 text-white shadow-lg'
              : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
          }`}>
            {React.cloneElement(icon, { size: isSubItem ? 14 : 18 })}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <span className={`${isSubItem ? 'text-sm' : 'text-sm'} font-semibold block ${active ? 'text-gray-900' : 'text-gray-700'}`}>
            {label}
          </span>
          {description && !isSubItem && (
            <span className="text-xs text-gray-500 block truncate mt-0.5">
              {description}
            </span>
          )}
        </div>
      </div>

      {count && (
        <span className={`text-xs font-bold rounded-full px-2 py-1 transition-all duration-200 relative z-10 flex-shrink-0 ${
          urgent
            ? 'bg-red-500 text-white animate-pulse'
            : active
              ? 'bg-gray-900 text-white'
              : 'bg-gray-200 text-gray-600 group-hover:bg-gray-300'
        }`}>
          {count}
        </span>
      )}
    </Link>
  );
}