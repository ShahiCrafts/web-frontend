import React from 'react';
import {
    Bell,
    Megaphone,
    CalendarDays,
    Users,
    CheckCircle,
    MessageSquare,
    Reply,
    Heart
} from 'lucide-react';
import { useNotifications } from '../../../hooks/admin/useNotificationTan';
import { formatTime } from '../../../pages/discussion/timeHelpers';
import toast from 'react-hot-toast';

export default function Notifications() {
    const {
        notifications,
        isLoading,
        error,
        counts,
        markAsRead,
        markAllAsRead,
    } = useNotifications({});

    const unreadCount = counts?.unread || 0;

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'like_post':
            case 'like_comment':
                return <Heart className="w-5 h-5 text-rose-500" />;
            case 'comment_post':
                return <MessageSquare className="w-5 h-5 text-blue-500" />;
            case 'reply_comment':
                return <Reply className="w-5 h-5 text-cyan-500" />;
            case 'admin_announcement':
                return <Megaphone className="w-5 h-5 text-indigo-500" />;
            case 'event_reminder':
                return <CalendarDays className="w-5 h-5 text-green-500" />;
            case 'follow':
                return <Users className="w-5 h-5 text-purple-500" />;
            case 'issue_status_update':
            case 'poll_closed':
                return <Bell className="w-5 h-5 text-orange-500" />;
            default:
                return <Bell className="w-5 h-5 text-gray-500" />;
        }
    };

    const handleMarkAsReadClick = (id) => markAsRead(id);

    const handleMarkAllAsReadClick = () => {
        if (unreadCount === 0) {
            toast.info("No unread notifications to mark.");
            return;
        }
        markAllAsRead();
        toast.success("All notifications marked as read!");
    };

    return (
        <div className="bg-white rounded-xl drop-shadow-sm border border-gray-100 max-w-sm mx-auto overflow-hidden">
            <div className="bg-gradient-to-br from-white to-gray-50 border-b border-gray-200 px-5 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-1.5 h-7 bg-green-500 rounded-full"></div>
                    <div className="flex items-center relative">
                        <h2 className="text-[18px] font-bold text-gray-900">Notifications</h2>
                        {unreadCount > 0 && (
                            <span className="ml-2 bg-red-500 text-white text-xs font-semibold px-2.5 py-0.5 rounded-full min-w-[24px] text-center">
                                {unreadCount}
                            </span>
                        )}
                    </div>
                </div>

                <button
                    onClick={handleMarkAllAsReadClick}
                    className={`flex items-center gap-1.5 text-sm font-medium transition-colors duration-200 ${
                        unreadCount > 0
                            ? 'text-blue-600 hover:text-blue-800 hover:underline'
                            : 'text-gray-400 cursor-not-allowed opacity-80'
                    }`}
                    disabled={unreadCount === 0}
                    title={unreadCount > 0 ? "Mark all notifications as read" : "No unread notifications"}
                >
                    <CheckCircle className="w-4 h-4" />
                    Mark all as read
                </button>
            </div>

            <div className="max-h-96 overflow-y-auto custom-scrollbar divide-y divide-gray-100">
                <style>
                    {`
                    .custom-scrollbar::-webkit-scrollbar { display: none; }
                    .custom-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                    @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
                    .animate-fade-in { animation: fade-in 0.3s ease-out; }
                    @keyframes bounce-custom {
                        0%, 100% { transform: scale(1); }
                        50% { transform: scale(1.1); }
                    }
                    .animate-bounce-custom {
                        animation: bounce-custom 1.5s infinite ease-in-out;
                    }
                `}
                </style>

                {isLoading ? (
                    <div className="text-center py-10 text-gray-400 text-sm">
                        <div className="spinner-border animate-spin inline-block w-6 h-6 border-4 rounded-full border-blue-500 border-r-transparent mb-2" role="status" />
                        <p>Loading notifications...</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-10 text-red-500 text-sm">
                        <p>Error: {error.message || "Failed to load notifications."}</p>
                        <p className="text-xs text-red-400 mt-1">Please try again later.</p>
                    </div>
                ) : notifications.length > 0 ? (
                    notifications.map((notif) => (
                        <div
                            key={notif._id}
                            onClick={() => handleMarkAsReadClick(notif._id)}
                            className={`group relative px-5 py-4 transition-all duration-300 cursor-pointer flex items-start gap-4 ${
                                notif.read
                                    ? 'bg-white hover:bg-gray-50'
                                    : 'bg-blue-50 hover:bg-blue-100 animate-fade-in'
                            }`}
                        >
                            <div className={`p-2.5 rounded-full shadow-sm transition-all duration-200 flex-shrink-0 ${
                                notif.read
                                    ? 'bg-gray-100 group-hover:bg-gray-200'
                                    : 'bg-white group-hover:shadow-md'
                            }`}>
                                {getNotificationIcon(notif.type)}
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-3 mb-1">
                                    <h3 className={`font-semibold text-base leading-tight ${
                                        notif.read ? 'text-gray-700' : 'text-gray-900'}`}>
                                        {notif.title}
                                    </h3>
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        <span className={`text-xs ${notif.read ? 'text-gray-500' : 'text-gray-600'}`}>
                                            {formatTime(notif.createdAt)}
                                        </span>
                                        {!notif.read && (
                                            <div className="w-2.5 h-2.5 bg-blue-500 rounded-full shadow-sm animate-pulse self-center" />
                                        )}
                                    </div>
                                </div>
                                <p className={`text-sm leading-normal ${notif.read ? 'text-gray-600' : 'text-gray-700'}`}>
                                    {notif.message || notif.contextPreview}
                                </p>
                            </div>

                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                {!notif.read && (
                                    <>
                                        <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] rounded-lg" />
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleMarkAsReadClick(notif._id);
                                            }}
                                            className="relative text-xs px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-blue-600 hover:bg-blue-50 hover:border-blue-400 font-medium transition-colors shadow-lg z-10"
                                        >
                                            Mark read
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-10 text-gray-500 text-sm">
                        <Bell className="w-8 h-8 mx-auto text-gray-300 mb-2" />
                        <p>No notifications to display at the moment.</p>
                        <p className="text-xs mt-1 text-gray-400">Come back later for updates!</p>
                    </div>
                )}
            </div>

            <div className="px-5 py-4 border-t border-gray-200 flex justify-center">
                <button
                    onClick={() => toast.info("Redirect to notifications page")}
                    className="w-full text-center text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors hover:underline p-2"
                >
                    View all notifications
                </button>
            </div>
        </div>
    );
}
