import React, { useState } from 'react';
import { CheckCircle, Info } from "lucide-react";
import { useFetchAllAdminNotifications } from '../../../hooks/admin/useAdminNotificationHook';
import Pagination from '../../common/Pagination'; // Assuming you have a Pagination component

export default function SentNotifications() {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10); // Or whatever default limit you prefer

    // Use the hook to fetch notifications with status 'SENT'
    const { data, isLoading, isError, error } = useFetchAllAdminNotifications({
        page,
        limit,
        status: 'SENT', // Crucial filter to get only sent notifications
    });

    const sentNotifications = data?.notifications || [];
    const totalNotifications = data?.pagination?.totalNotifications || 0;
    const totalPages = data?.pagination?.totalPages || 0;

    if (isError) {
        return (
            <div className="p-4 text-red-600 text-center">
                Error fetching sent notifications: {error.message}
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
        return notification.recipientType || "N/A";
    };

    return (
        <div className="p-6 bg-gray-50 rounded-lg border border-gray-200 space-y-6">
            <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-500" />
                <div>
                    <h2 className="text-xl font-semibold">
                        Sent Notifications
                    </h2>
                    <p className="text-sm text-gray-500">
                        Successfully delivered notifications with performance metrics
                    </p>
                </div>
            </div>

            {isLoading ? (
                <div className="py-10 text-center text-gray-500">Loading sent notifications...</div>
            ) : sentNotifications.length === 0 ? (
                <div className="py-8 text-center text-gray-500">
                    <Info size={40} className="mx-auto text-gray-400 mb-3" />
                    <h3 className="font-semibold text-gray-700">No Sent Notifications</h3>
                    <p className="text-sm text-gray-500">There are no notifications that have been sent yet.</p>
                </div>
            ) : (
                sentNotifications.map((n) => (
                    <div
                        key={n._id} // Use _id from MongoDB
                        className="bg-white border border-gray-200 rounded-lg p-6"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-lg font-semibold">
                                    {n.title}
                                </h3>
                                <p className="text-gray-600 mt-1">{n.message}</p> {/* Use n.message for description */}
                            </div>
                            <button
                                className="text-sm font-semibold"
                                style={{ color: "#FF5C00" }}
                                // TODO: Add functionality to link to a detailed analytics page
                            >
                                View Analytics
                            </button>
                        </div>
                        <div className="grid grid-cols-3 gap-6 border-y border-gray-200 py-4 mb-4">
                            <div>
                                <div className="text-2xl font-bold">
                                    {formatRecipients(n)}
                                </div>
                                <div className="text-sm text-gray-500">Recipients</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold">
                                    0% {/* Placeholder as this data is not in your schema */}
                                </div>
                                <div className="text-sm text-gray-500">Open Rate</div>
                            </div>
                            <div>
                                <div className="text-2xl font-bold">
                                    0% {/* Placeholder as this data is not in your schema */}
                                </div>
                                <div className="text-sm text-gray-500">Click Rate</div>
                            </div>
                        </div>
                        <div className="text-xs text-gray-400">
                            Sent: {n.sentAt ? new Date(n.sentAt).toLocaleString() : 'N/A'} | {/* Format sentAt */}
                            By: {n.senderId?.fullName || 'N/A'} | {/* Use n.senderId.fullName */}
                            Channels: Push {/* Placeholder for channels */}
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
