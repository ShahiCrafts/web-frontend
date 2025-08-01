import React, { useState, useEffect } from 'react';
import { Clock, Edit, Rocket, Info } from "lucide-react";
import { useFetchAllAdminNotifications } from '../../../hooks/admin/useAdminNotificationHook';
import Pagination from '../../common/Pagination'; // Assuming you have a Pagination component

export default function ScheduledNotifications() {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10); // Or whatever default limit you prefer

    // Use the hook to fetch notifications with status 'SCHEDULED'
    const { data, isLoading, isError, error } = useFetchAllAdminNotifications({
        page,
        limit,
        status: 'SCHEDULED', // Crucial filter to get only scheduled notifications
        // You might also want to add sorting here if not default in backend
    });

    const scheduledNotifications = data?.notifications || [];
    const totalNotifications = data?.pagination?.totalNotifications || 0;
    const totalPages = data?.pagination?.totalPages || 0;

    if (isError) {
        return (
            <div className="p-4 text-red-600 text-center">
                Error fetching scheduled notifications: {error.message}
            </div>
        );
    }

    // Helper to format recipient display
    const formatRecipients = (notification) => {
        if (notification.recipientType === "AllUsers") {
            return "All Users";
        }
        if (notification.recipientType === "SingleUser") {
            // Assuming recipientIds is an array of user IDs
            return `${notification.recipientIds?.length || 0} Users`;
        }
        // Add other recipient types if needed, e.g., SpecificGroup
        return notification.recipientType || "N/A";
    };

    return (
        <div className="p-4 sm:p-6 bg-gray-50 rounded-lg border border-gray-200 space-y-6">
            <div className="flex items-center gap-3">
                <Clock className="w-6 h-6 text-yellow-500" />
                <div>
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                        Scheduled Notifications
                    </h2>
                    <p className="text-sm text-gray-500">
                        Notifications scheduled for future delivery
                    </p>
                </div>
            </div>

            {isLoading ? (
                <div className="py-10 text-center text-gray-500">Loading scheduled notifications...</div>
            ) : scheduledNotifications.length === 0 ? (
                <div className="py-8 text-center text-gray-500">
                    <Info size={40} className="mx-auto text-gray-400 mb-3" />
                    <h3 className="font-semibold text-gray-700">No Scheduled Notifications</h3>
                    <p className="text-sm text-gray-500">There are no notifications scheduled for future delivery.</p>
                </div>
            ) : (
                scheduledNotifications.map((n) => (
                    <div
                        key={n._id} // Use _id from MongoDB
                        className="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6"
                    >
                        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
                            <div className="flex-1">
                                <div className="flex flex-wrap items-center gap-3 mb-2">
                                    <h3 className="text-base sm:text-lg font-semibold text-gray-800">
                                        {n.title}
                                    </h3>
                                    <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-[#FF5C00]/90 text-white">
                                        Scheduled
                                    </span>
                                </div>
                                <p className="text-gray-600">{n.message}</p> {/* Use n.message for description */}
                                <div className="text-xs text-gray-500 mt-2">
                                    Recipients: {formatRecipients(n)} | {/* Dynamic recipients */}
                                    Scheduled: {n.scheduledAt ? new Date(n.scheduledAt).toLocaleString() : 'N/A'} | {/* Format scheduledAt */}
                                    Created by: {n.createdBy?.fullName || n.senderId?.fullName || 'N/A'} {/* Use senderId.fullName */}
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2 mt-2 lg:mt-0">
                                <button
                                    className="text-sm font-semibold border border-gray-300 text-gray-700 hover:bg-gray-100 px-4 py-2 rounded-md flex items-center gap-2 transition-colors"
                                    // TODO: Add actual edit functionality
                                >
                                    <Edit className="w-4 h-4" /> Edit
                                </button>

                                <button
                                    className="text-sm font-semibold text-white px-4 py-2 rounded-md flex items-center gap-2 bg-[#FF5C00] hover:bg-[#e35300] transition-colors"
                                    // TODO: Add actual send now functionality (e.g., a mutation to change status to SENT)
                                >
                                    <Rocket className="w-4 h-4" /> Send Now
                                </button>
                            </div>
                        </div>
                    </div>
                ))
            )}

            {totalNotifications > 0 && (
                <div className="mt-6">
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
        </div>
    );
}
