// components/ReportsTabContent.jsx
import React from 'react';
import clsx from 'clsx';
import { Flag, Plus, Search } from 'lucide-react';
import { ReportCard } from './ReportCard';
import { LuxuryButton } from './LuxuryButton';
import { useFetchUserPosts } from '../../hooks/user/useProfileTan';

export function ReportsTabContent({ userId }) {
    const { data: postsResponse, isLoading, isError, error } = useFetchUserPosts(userId, { type: 'Report Issue' });

    const reportIssues = postsResponse?.data || [];

    // --- DEBUG START ---
    console.log('ReportsTabContent: Fetched postsResponse:', postsResponse);
    console.log('ReportsTabContent: Filtered reportIssues (should contain your report):', reportIssues);
    console.log('ReportsTabContent: Number of report issues:', reportIssues.length);
    if (reportIssues.length > 0) {
        console.log('ReportsTabContent: First report issue object:', reportIssues[0]);
        console.log('ReportsTabContent: Status of first report:', reportIssues[0].status);
    }
    // --- DEBUG END ---

    const pendingReports = reportIssues.filter(r => r.status === 'ACTIVE').length;
    const inProgressReports = reportIssues.filter(r => r.status === 'UNDER_REVIEW').length;
    const resolvedReports = reportIssues.filter(r => ['ACTION_TAKEN', 'CLOSED'].includes(r.status)).length;

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-48">
                <p className="text-gray-600">Loading reports...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex justify-center items-center h-48">
                <p className="text-red-500">Error loading reports: {error?.message || 'Failed to fetch reports.'}</p>
            </div>
        );
    }

    return (
        <section className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                        <Flag className="w-4 h-4 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                        Report Tracker
                    </h2>
                </div>
                <div className="flex items-center gap-3">
                    <LuxuryButton variant="secondary" size="sm">
                        <Search className="w-4 h-4 mr-2" />
                        Search
                    </LuxuryButton>
                    <LuxuryButton size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        New Report
                    </LuxuryButton>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-gray-200/50">
                    <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className="text-sm font-medium text-gray-700">Pending</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mt-2">
                        {pendingReports}
                    </div>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-gray-200/50">
                    <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <span className="text-sm font-medium text-gray-700">In Progress</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mt-2">
                        {inProgressReports}
                    </div>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-gray-200/50">
                    <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm font-medium text-gray-700">Resolved</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mt-2">
                        {resolvedReports}
                    </div>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-gray-200/50">
                    <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                        <span className="text-sm font-medium text-gray-700">Total</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mt-2">{reportIssues.length}</div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* --- DEBUG START --- */}
                {console.log('ReportsTabContent: Mapping reports - reportIssues.length:', reportIssues.length)}
                {/* --- DEBUG END --- */}
                {reportIssues.length > 0 ? (
                    reportIssues.map((report) => (
                        <ReportCard key={report._id} report={report} />
                    ))
                ) : (
                    <div className="md:col-span-2 text-center text-gray-500 py-8">
                        <p>No report issues found for this user.</p>
                        <p className="mt-2 text-sm">Submit a new report to get started!</p>
                    </div>
                )}
            </div>
        </section>
    );
}