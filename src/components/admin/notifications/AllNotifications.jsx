import React, { useState, useEffect, useRef } from 'react';
import { Search, MoreHorizontal, Plus, ChevronDown, Calendar, Info } from "lucide-react";
import { useFetchAllAdminNotifications } from '../../../hooks/admin/useAdminNotificationHook';
import Pagination from '../../common/Pagination';
import CreateNotificationModal from './CreateNotificationModal'; // <--- Import the new modal component

const StatusBadge = ({ status }) => {
    const statusClasses = {
        'SENT': 'bg-green-100 text-green-800',
        'SCHEDULED': 'bg-yellow-100 text-yellow-800',
        'DRAFT': 'bg-gray-100 text-gray-800',
        'ARCHIVED': 'bg-gray-100 text-gray-800',
    };
    const text = status ? status.charAt(0).toUpperCase() + status.slice(1).toLowerCase() : 'Unknown';
    const classes = statusClasses[status] || statusClasses.DRAFT;
    return (
        <span className={`inline-block px-3 py-0.5 text-xs font-semibold rounded-full ${classes}`}>
            {text}
        </span>
    );
};

const PriorityBadge = ({ priority }) => {
    const styles = {
        high: "bg-red-100 text-red-800",
        medium: "bg-yellow-100 text-yellow-800",
        low: "bg-blue-100 text-blue-800",
    };
    const classes = styles[priority] || "bg-gray-100 text-gray-800";
    const text = priority ? priority.charAt(0).toUpperCase() + priority.slice(1) : "N/A";
    return (
        <span
            className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${classes}`}
        >
            {text}
        </span>
    );
};

export default function AllNotifications() {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [typeFilter, setTypeFilter] = useState('');
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false); // <--- New state for modal

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 300);
        return () => clearTimeout(handler);
    }, [searchTerm]);

    const { data, isLoading, isError, error } = useFetchAllAdminNotifications({
        page,
        limit,
        search: debouncedSearchTerm,
        status: statusFilter,
        type: typeFilter,
    });

    const notifications = data?.notifications || [];
    const totalNotifications = data?.pagination?.totalNotifications || 0;
    const totalPages = data?.pagination?.totalPages || 0;

    if (isError) {
        return <div className="p-4 text-red-600 text-center">Error fetching notifications: {error.message}</div>;
    }

    return (
        <div className="bg-white rounded-lg">
            <div className="p-2">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800">
                            Notification Center
                        </h2>
                        <p className="text-sm text-gray-500">
                            Manage all platform notifications and communications
                        </p>
                    </div>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-orange-600 rounded-md hover:bg-orange-700"
                        style={{ backgroundColor: "#FF5C00" }}
                    >
                        <Plus className="w-4 h-4" />
                        Create Notification
                    </button>
                </div>
                <div className="flex items-center gap-4 mb-6">
                    <div className="relative flex-grow">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search notifications..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                    </div>
                    <div className="relative">
                        <select 
                            value={statusFilter} 
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="appearance-none w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        >
                            <option value="">All Status</option>
                            <option value="SENT">Sent</option>
                            <option value="SCHEDULED">Scheduled</option>
                            <option value="DRAFT">Draft</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                    <div className="relative">
                         <select 
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}
                            className="appearance-none w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        >
                            <option value="">All Types</option>
                            <option value="admin_announcement">Announcement</option>
                            <option value="event_reminder">Event Reminder</option>
                            <option value="poll_closed">Poll Closed</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                </div>
            </div>
            <div className="overflow-x-auto px-2">
                <table className="min-w-full text-sm text-left text-gray-600">
                    <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                        <tr>
                            <th className="px-6 py-3 font-semibold">Notification</th>
                            <th className="px-6 py-3 font-semibold">Type</th>
                            <th className="px-6 py-3 font-semibold">Status</th>
                            <th className="px-6 py-3 font-semibold">Recipients</th>
                            <th className="px-6 py-3 font-semibold">Performance</th>
                            <th className="px-6 py-3 font-semibold">Created</th>
                            <th className="px-6 py-3 font-semibold text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {isLoading ? (
                            <tr><td colSpan="7" className="py-10 text-center text-gray-500">Loading notifications...</td></tr>
                        ) : notifications.length === 0 ? (
                            <tr><td colSpan="7" className="py-8 text-center text-gray-500"><Info size={40} className="mx-auto text-gray-400 mb-3" /><h3 className="font-semibold text-gray-700">No Notifications Found</h3><p className="text-sm text-gray-500">No notifications match your search or filters.</p></td></tr>
                        ) : (
                            notifications.map((n) => (
                                <tr key={n._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <Calendar className="w-5 h-5 text-gray-400 flex-shrink-0" aria-hidden="true" />
                                            <div>
                                                <div className="font-semibold text-gray-800">{n.title}</div>
                                                <div className="text-xs text-gray-500">{n.message}</div>
                                                <div className="mt-1 flex items-center gap-2">
                                                    <PriorityBadge priority="high" /> {/* Placeholder priority */}
                                                    <span className="text-xs text-gray-500">by {n.senderId?.fullName || 'N/A'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 text-xs font-semibold text-gray-600 bg-gray-100 rounded">
                                            {n.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <StatusBadge status={n.status} />
                                    </td>
                                    <td className="px-6 py-4 font-semibold text-gray-800">
                                        {n.recipientType === "AllUsers" ? "All Users" : `${n.recipientType} (${n.recipientIds?.length || 0} users)` }
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-gray-500">--</span> {/* Performance placeholder */}
                                    </td>
                                    <td className="px-6 py-4">{new Date(n.createdAt).toLocaleDateString('en-US', { dateStyle: 'short' })}</td>
                                    <td className="px-6 py-4 text-center">
                                        <button className="text-gray-500 hover:text-gray-800">
                                            <MoreHorizontal className="w-5 h-5" aria-hidden="true" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {notifications.length > 0 && (
                <div className="mt-6 px-2">
                    <Pagination
                        currentPage={page}
                        totalCount={totalNotifications}
                        itemsPerPage={limit}
                        totalPages={totalPages}
                        onPageChange={setPage}
                        onLimitChange={(newLimit) => {
                            setPage(1);
                            setLimit(newLimit);
                        }}
                    />
                </div>
            )}

            {/* Create Notification Modal */}
            <CreateNotificationModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
            />
        </div>
    );
}