import React, { useState } from 'react';
import { Flag, Eye, Trash2, Info } from 'lucide-react'; // Added Info for empty state
import { useFetchModerationDiscussions } from '../../../hooks/admin/useDiscussionHook'; // <-- Import the hook
import Pagination from '../../common/Pagination'; // Assuming you have a pagination component
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function DiscussionModeration() {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [sortBy, setSortBy] = useState('latestReportedAt'); // Default sort to show most recent reports first
    const [sortOrder, setSortOrder] = useState('desc');

    // Fetch discussions with a status of 'REPORTED' using the new hook
    const { data, isLoading, isError, error } = useFetchModerationDiscussions({
        page,
        limit,
        sortBy,
        sortOrder,
    });

    const discussions = data?.discussions || [];
    const totalCount = data?.totalDiscussions || 0;
    const totalPages = data?.totalPages || 0;

    if (isError) {
        return <p className="text-center text-red-600 p-4">Error fetching reported discussions: {error.message}</p>;
    }

    const timeSince = (date) => {
        if (!date) return 'Unknown';
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + " years ago";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + " months ago";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + " days ago";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + " hours ago";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + " minutes ago";
        return "a moment ago";
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-lg font-bold text-gray-900 flex items-center mb-4">
                    <Flag className="w-6 h-6 mr-3 text-red-600" /> Reported Discussions Queue
                </h2>
                <div className="bg-white border border-gray-200 rounded-lg">
                    <ul className="divide-y divide-gray-200">
                        {isLoading ? (
                            <li className="p-4 text-center text-gray-500">Loading moderation queue...</li>
                        ) : discussions.length === 0 ? (
                            <li className="p-4 text-center text-gray-500">
                                <div className="flex flex-col items-center gap-3 max-w-sm mx-auto">
                                    <Info size={40} className="text-gray-400" />
                                    <h3 className="text-lg font-semibold text-gray-700">No Reported Discussions</h3>
                                    <p className="text-sm text-gray-500 text-center">
                                        The moderation queue is currently empty.
                                    </p>
                                </div>
                            </li>
                        ) : (
                            discussions.map(d => (
                                <li key={d._id} className="p-4 hover:bg-gray-50">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-base font-semibold text-gray-900 truncate">{d.title}</p>
                                            <div className="flex items-center text-base text-gray-500 mt-1">
                                                <Flag className="w-4 h-4 text-red-500 mr-1.5 flex-shrink-0" />
                                                <p className="truncate">
                                                    {/* Use the latestReportReason from the aggregation */}
                                                    <span className="font-semibold text-gray-700">Reason:</span> {d.latestReportReason || 'N/A'}
                                                </p>
                                            </div>
                                            <div className="flex items-center text-sm text-gray-500 mt-2">
                                                <span className="mr-2">
                                                    {/* Use the totalReports from the aggregation */}
                                                    <span className="font-medium text-gray-600">{d.totalReports} reports</span>
                                                </span>
                                                <span className="mr-2">•</span>
                                                <span>Posted by: <span className="font-medium text-gray-600">{d.author?.fullName || 'Anonymous'}</span></span>
                                            </div>
                                        </div>
                                        <div className="mt-4 sm:mt-0 sm:ml-4 flex items-center space-x-3 flex-shrink-0">
                                            {/* Use the latestReportedAt from the aggregation */}
                                            <span className="text-sm text-gray-400">{timeSince(d.latestReportedAt)}</span>
                                            <Link to={`/admin/discussions/${d._id}`} className="px-3 py-1 bg-gray-200 text-gray-700 text-sm font-semibold rounded-full hover:bg-gray-300">
                                                <Eye className="w-4 h-4" /> View
                                            </Link>
                                            <button 
                                                onClick={() => toast.error("Not implemented yet")} 
                                                className="px-3 py-1 bg-red-500 text-white text-sm font-semibold rounded-full hover:bg-red-600"
                                            >
                                                <Trash2 className="w-4 h-4" /> Remove
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            ))
                        )}
                    </ul>
                </div>
            </div>

            {discussions.length > 0 && (
                <div className="mt-6">
                    <Pagination
                        currentPage={page}
                        totalCount={totalCount}
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
};