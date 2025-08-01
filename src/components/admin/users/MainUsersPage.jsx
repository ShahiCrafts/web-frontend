// src/components/admin/users/MainUsersPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Users, UserCheck, UserPlus, BarChart2, Search, Download } from 'lucide-react';
import Card from '../../../components/admin/contents/Card'; // Assuming this Card component works
import UserAccounts from './UserAccounts'; // Assuming this component exists
import { useFetchUsers, useUserEngagementAnalytics } from '../../../hooks/admin/useUserTan'; // Updated import

// Helper for consistent growth rate display
const formatGrowthDetails = (growthRate) => {
    const numericGrowth = parseFloat(growthRate);
    if (isNaN(numericGrowth) || numericGrowth === 0) {
        return <span className="text-gray-500">Stable</span>; // Or "No change"
    }
    const colorClass = numericGrowth > 0 ? "text-green-600" : "text-red-600";
    const sign = numericGrowth > 0 ? "+" : "";
    return <span className={colorClass}>{sign}{numericGrowth.toFixed(1)}% from last month</span>;
};

export default function MainUsersPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [showDownloadMenu, setShowDownloadMenu] = useState(false);
    const downloadRef = useRef(null);

    const { data: allUsersData, isLoading: isUsersLoading, isError: isUsersError } = useFetchUsers({ limit: -1 });
    const { data: userEngagementData, isLoading: isEngagementLoading, isError: isEngagementError, error: engagementError } = useUserEngagementAnalytics();

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 300);
        return () => clearTimeout(handler);
    }, [searchTerm]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (downloadRef.current && !downloadRef.current.contains(event.target)) {
                setShowDownloadMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleDownload = (type) => {
        setShowDownloadMenu(false);
        alert(`Download as ${type}`);
    };

    if (isEngagementLoading || isUsersLoading) {
        return (
            <div className="bg-slate-50 font-sans min-h-screen flex items-center justify-center">
                <div className="text-gray-600">Loading user analytics...</div>
            </div>
        );
    }

    if (isEngagementError || isUsersError) {
        console.error("Error loading user analytics:", engagementError);
        return (
            <div className="bg-slate-50 font-sans min-h-screen flex items-center justify-center">
                <div className="text-red-600">Error loading user data: {engagementError?.message || 'Please try again.'}</div>
            </div>
        );
    }

    const engagementMetrics = userEngagementData || {};
    const avgEngagementLikes = parseFloat(engagementMetrics.averageEngagement?.avgLikesPerPost) || 0;
    const avgEngagementComments = parseFloat(engagementMetrics.averageEngagement?.avgCommentsPerPost) || 0;

    return (
        <div className="bg-slate-50 font-sans">
            <div className="max-w-7xl mx-auto">
                <div className="bg-white rounded-xl shadow-lg p-5 sm:p-6">
                    <header className="mb-6 pb-4 border-b border-gray-200">
                        <h1 className="text-xl font-bold text-gray-900">User Management</h1>
                        <p className="text-sm text-gray-600 mt-1">
                            Manage citizens, moderators, and organization accounts.
                        </p>
                    </header>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <Card
                            title="Total Users"
                            value={engagementMetrics.totalUsers ?? 0}
                            icon={<Users className="w-5 h-5" />}
                            details={formatGrowthDetails(engagementMetrics.userGrowthRate)}
                        />
                        <Card
                            title="Active Users"
                            value={engagementMetrics.activeUsers ?? 0}
                            icon={<UserCheck className="w-5 h-5" />}
                            details={
                                engagementMetrics.totalUsers > 0
                                    ? `${((engagementMetrics.activeUsers / engagementMetrics.totalUsers) * 100).toFixed(1)}% of total users`
                                    : "0% of total users"
                            }
                        />
                        <Card
                            title="New This Month"
                            value={engagementMetrics.newUsersThisMonth ?? 0}
                            icon={<UserPlus className="w-5 h-5" />}
                            details={formatGrowthDetails(engagementMetrics.userGrowthRate)}
                        />
                        <Card
                            title="Avg. Engagement"
                            value={`${avgEngagementLikes.toFixed(1)} likes/post`}
                            icon={<BarChart2 className="w-5 h-5" />}
                            details={`Avg. ${avgEngagementComments.toFixed(1)} comments/post`}
                        />
                    </div>

                    <div className="flex justify-end items-center mb-4 gap-2">
                        <div className="relative w-full max-w-[260px]">
                            <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search users..."
                                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none"
                            />
                        </div>

                        <div className="relative" ref={downloadRef}>
                            <button
                                onClick={() => setShowDownloadMenu(prev => !prev)}
                                style={{ backgroundColor: '#ff5c00' }}
                                className="flex items-center justify-center text-white p-2 rounded-md hover:bg-[#e64f00] focus:outline-none"
                            >
                                <Download className="w-4 h-4" />
                            </button>
                            {showDownloadMenu && (
                                <div className="absolute right-0 mt-2 w-24 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                                    <button onClick={() => handleDownload('xls')} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100">.xls</button>
                                    <button onClick={() => handleDownload('pdf')} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100">.pdf</button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Renders all users by default (no role prop) */}
                    <UserAccounts search={debouncedSearchTerm} /> 
                </div>
            </div>
        </div>
    );
}