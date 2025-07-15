import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import {
    Search, CheckCircle, XCircle, Eye, Users, MapPin, Paperclip, Phone, Mail, Edit,
    Clock, ChevronDown, ChevronUp, X, CalendarDays, Tag, Briefcase, UserCog,
    ListFilter, TrendingUp, TrendingDown, BookOpen as BookOpenIcon
} from 'lucide-react';

import { useListPendingCommunities, useReviewCommunity } from '../../hooks/useCommunitiesTan';
import { useAuth } from '../../context/AuthProvider';

const successColor = '#22c55e';
const dangerColor = '#ef4444';
const warningColor = '#eab308';
const infoColor = '#3b82f6';

const getStatusBadgeClass = (status) => {
    switch (status) {
        case 'pending': return `bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-0.5 rounded-full`;
        case 'approved': return `bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded-full`;
        case 'rejected': return `bg-red-100 text-red-800 text-xs font-medium px-2 py-0.5 rounded-full`;
        default: return `bg-gray-100 text-gray-800 text-xs font-medium px-2 py-0.5 rounded-full`;
    }
};

function CommunityRequestItem({ community, onViewDetails, onApprove, onReject, isMutating }) {
    const creatorFullName = community.owners?.[0]?.fullName || 'Unknown User';
    const creatorRole = community.owners?.[0]?.role || 'N/A';
    const CreatorIcon = creatorRole === 'official' ? Briefcase : UserCog;

    return (
        <div className="bg-white p-4 border border-gray-200 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0 md:space-x-4 animate-fadeInUp relative overflow-hidden">
            <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${community.status === 'pending' ? 'bg-yellow-400' :
                community.status === 'approved' ? 'bg-green-500' :
                    'bg-red-500'
                }`}></div>

            <div className="flex-grow pl-3">
                <div className="flex items-center mb-1">
                    <h3 className="text-lg font-semibold text-gray-900">{community.name}</h3>
                    <span className={`ml-3 ${getStatusBadgeClass(community.status)}`}>
                        {community.status}
                    </span>
                </div>

                <div className="text-xs text-gray-600 ml-10 flex flex-wrap gap-x-3 gap-y-1">
                    <span className="flex items-center">
                        <CreatorIcon size={14} className="mr-1 text-gray-500" />
                        {creatorFullName} ({creatorRole.split(' ')[0]})
                    </span>
                    <span className="flex items-center">
                        <CalendarDays size={14} className="mr-1 text-gray-500" />
                        {new Date(community.createdAt).toLocaleDateString()}
                    </span>
                    <span className="flex items-center">
                        <Tag size={14} className="mr-1 text-gray-500" />
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-blue-50 text-blue-700">{community.category}</span>
                    </span>
                </div>
                <p className="text-sm text-gray-700 mt-2 ml-10 line-clamp-2">{community.description}</p>
            </div>

            <div className="flex flex-col items-start md:items-end space-y-2 w-full md:w-auto">
                <button
                    onClick={() => onViewDetails(community)}
                    className="flex items-center justify-center px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors w-full md:w-28 rounded"
                    title="View Details"
                >
                    <Eye size={14} className="mr-1" /> Details
                </button>
                <div className="flex space-x-2 w-full md:w-auto">
                    <button
                        // --- FIX HERE: Changed 'approved' to 'approve' ---
                        onClick={() => onApprove(community._id, community.name, 'approve')}
                        className={`flex-1 flex items-center justify-center px-3 py-1.5 text-sm font-semibold text-white transition-colors rounded ${
                            community.status === 'approved' || isMutating
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-green-500 hover:bg-green-600'
                            }`}
                        title="Approve"
                        disabled={community.status === 'approved' || isMutating}
                    >
                        <CheckCircle size={14} className="mr-1" /> Approve
                    </button>
                    <button
                        // --- FIX HERE: Changed 'rejected' to 'reject' ---
                        onClick={() => onReject(community._id, community.name, 'reject')}
                        className={`flex-1 flex items-center justify-center px-3 py-1.5 text-sm font-semibold text-white transition-colors rounded ${
                            community.status === 'rejected' || isMutating
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-red-500 hover:bg-red-600'
                            }`}
                        title="Reject"
                        disabled={community.status === 'rejected' || isMutating}
                    >
                        <XCircle size={14} className="mr-1" /> Reject
                    </button>
                </div>
            </div>
        </div>
    );
}

function DetailModal({ community, onClose, onUpdateStatus, onSaveAdminNotes, isMutating }) {
    const [adminNotes, setAdminNotes] = useState(community.adminNotes || community.rejectionReason || '');
    const modalRef = useRef();

    useEffect(() => {
        const handleEscape = (event) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [onClose]);

    const handleStatusUpdate = (action) => { // This 'action' parameter is the one we need to ensure is base verb
        let reason = '';
        if (action === 'rejected') { // Still compare against 'rejected' here because it's a constant
            reason = prompt(`Enter reason for rejecting "${community.name}" (optional):`, adminNotes);
            if (reason === null) return;
        }
        // --- FIX HERE: Ensure base verb is passed to onUpdateStatus ---
        onUpdateStatus(community._id, action, reason); // action will be 'approve' or 'reject'
    };

    const handleSaveNotes = () => {
        onSaveAdminNotes(community._id, adminNotes);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4 backdrop-blur-sm animate-fadeIn">
            <div ref={modalRef} className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-scaleIn border border-gray-100">
                <div className="flex justify-between items-center p-4 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-800">Community Details: <span className="text-blue-600">{community.name}</span></h2>
                    <button onClick={onClose} className="p-1 rounded-sm hover:bg-gray-100 transition-colors">
                        <X size={20} className="text-gray-600" />
                    </button>
                </div>

                <div className="p-5 space-y-4 text-gray-700">
                    {community.avatarUrl && (
                        <div className="mb-3 text-center">
                            <img src={community.avatarUrl} alt="Community Logo" className="w-24 h-24 rounded-full object-cover shadow-sm border border-gray-200 inline-block" />
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 text-sm">
                        <div>
                            <p className="font-semibold flex items-center mb-0.5 text-gray-800"><UserCog size={15} className="mr-2 text-gray-500" />Creator:</p>
                            <p className="ml-5 text-gray-700">{community.owners?.[0]?.fullName || 'Unknown User'} ({community.owners?.[0]?.role || 'N/A'})</p>
                        </div>
                        <div>
                            <p className="font-semibold flex items-center mb-0.5 text-gray-800"><CalendarDays size={15} className="mr-2 text-gray-500" />Creation Date:</p>
                            <p className="ml-5 text-gray-700">{new Date(community.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div>
                            <p className="font-semibold flex items-center mb-0.5 text-gray-800"><Tag size={15} className="mr-2 text-gray-500" />Category:</p>
                            <p className="ml-5 inline-flex items-center px-2 py-0.5 rounded text-sm bg-blue-100 text-blue-800">{community.category}</p>
                        </div>
                        {community.privacy && (
                            <div>
                                <p className="font-semibold flex items-center mb-0.5 text-gray-800"><Eye size={15} className="mr-2 text-gray-500" />Privacy:</p>
                                <p className="ml-5 text-gray-700 capitalize">{community.privacy}</p>
                            </div>
                        )}
                        {community.location && (
                            <div>
                                <p className="font-semibold flex items-center mb-0.5 text-gray-800"><MapPin size={15} className="mr-2 text-gray-500" />Location:</p>
                                <p className="ml-5 text-gray-700">{community.location}</p>
                            </div>
                        )}
                        {community.rules?.length > 0 && (
                            <div>
                                <p className="font-semibold flex items-center mb-0.5 text-gray-800"><BookOpenIcon size={15} className="mr-2 text-gray-500" />Rules:</p>
                                <ul className="ml-5 space-y-0.5">
                                    {community.rules.map((rule, index) => (
                                        <li key={index} className="text-gray-700">{rule}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {community.tags?.length > 0 && (
                            <div>
                                <p className="font-semibold flex items-center mb-0.5 text-gray-800"><Tag size={15} className="mr-2 text-gray-500" />Tags:</p>
                                <p className="ml-5 text-gray-700">{community.tags.join(', ')}</p>
                            </div>
                        )}
                    </div>

                    <div className="mt-3 p-3 bg-gray-50 border border-gray-200 rounded">
                        <p className="font-semibold flex items-center mb-1 text-gray-800"><Eye size={15} className="mr-2 text-gray-500" />Description:</p>
                        <p className="ml-5 leading-relaxed text-gray-700">{community.description || "No description provided."}</p>
                    </div>

                    {community.attachments && community.attachments.length > 0 && (
                        <div className="mt-3">
                            <p className="font-semibold flex items-center mb-1 text-gray-800"><Paperclip size={15} className="mr-2 text-gray-500" />Attachments:</p>
                            <ul className="ml-5 space-y-0.5">
                                {community.attachments.map((file, index) => (
                                    <li key={index}>
                                        <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center">
                                            <Paperclip size={12} className="mr-1" />{file.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 text-sm">
                        {community.contact && community.contact.email && (
                            <div>
                                <p className="font-semibold flex items-center mb-0.5 text-gray-800"><Mail size={15} className="mr-2 text-gray-500" />Contact Email:</p>
                                <p className="ml-5 text-gray-700">{community.contact.email}</p>
                            </div>
                        )}
                        {community.contact && community.contact.phone && (
                            <div>
                                <p className="font-semibold flex items-center mb-0.5 text-gray-800"><Phone size={15} className="mr-2 text-gray-500" />Contact Phone:</p>
                                <p className="ml-5 text-gray-700">{community.contact.phone}</p>
                            </div>
                        )}
                    </div>

                    <div className="mt-4">
                        <label htmlFor="admin-notes" className="font-semibold flex items-center mb-1.5 text-gray-800">
                            <Edit size={15} className="mr-2 text-gray-500" />Admin Notes:
                        </label>
                        <textarea
                            id="admin-notes"
                            className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-200 focus:border-blue-300 text-gray-800 text-sm"
                            rows="3"
                            value={adminNotes}
                            onChange={(e) => setAdminNotes(e.target.value)}
                            placeholder="Add internal remarks here..."
                            disabled={isMutating}
                        ></textarea>
                        <button
                            onClick={handleSaveNotes}
                            className="mt-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded hover:bg-gray-200 transition-colors disabled:opacity-50"
                            disabled={isMutating}
                        >
                            Save Notes
                        </button>
                    </div>
                </div>

                <div className="p-4 border-t border-gray-200 flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2 bg-gray-50">
                    <button
                        // --- FIX HERE: Pass 'approve' (base verb) ---
                        onClick={() => handleStatusUpdate('approve')}
                        className={`flex items-center justify-center px-4 py-2 text-sm font-semibold text-white transition-colors rounded ${
                            community.status === 'approved' || isMutating
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-green-500 hover:bg-green-600'
                            }`}
                        disabled={community.status === 'approved' || isMutating}
                    >
                        <CheckCircle size={16} className="mr-1.5" /> Approve
                    </button>
                    <button
                        // --- FIX HERE: Pass 'reject' (base verb) ---
                        onClick={() => handleStatusUpdate('reject')}
                        className={`flex items-center justify-center px-4 py-2 text-sm font-semibold text-white transition-colors rounded ${
                            community.status === 'rejected' || isMutating
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-red-500 hover:bg-red-600'
                            }`}
                        disabled={community.status === 'rejected' || isMutating}
                    >
                        <XCircle size={16} className="mr-1.5" /> Reject
                    </button>
                    <button
                        onClick={onClose}
                        className="flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 bg-white hover:bg-gray-100 transition-colors text-sm font-semibold rounded"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

// Stat Card Component (Minimalist, Rectangular)
function StatCard({ title, count, icon: Icon, color, trendPercentage, trendDirection }) {
    const formattedCount = count >= 1000 ? `${(count / 1000).toFixed(1)}k` : count;
    const TrendIcon = trendDirection === 'up' ? TrendingUp : TrendingDown;
    const trendColorClass = trendDirection === 'up' ? 'text-green-600' : 'text-red-600';
    const trendBgClass = trendDirection === 'up' ? 'bg-green-100' : 'bg-red-100';

    return (
        <div className="flex-1 p-4 border border-gray-200 rounded-xl bg-white flex flex-col justify-between shadow-sm animate-fadeIn">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: color + '1A' }}>
                        <Icon size={16} style={{ color: color }} />
                    </div>
                    <p className="text-sm font-medium text-gray-700">{title}</p>
                </div>
                <span className="text-xs text-gray-500">All Time</span>
            </div>

            <p className="text-3xl font-bold text-gray-900">{formattedCount}</p>

            <div className="flex items-center text-xs mt-2">
                <span className={`flex items-center ${trendColorClass} font-semibold mr-1`}>
                    <TrendIcon size={12} className="mr-0.5" />
                    {trendPercentage}%
                </span>
                <span className="text-gray-500"> {trendDirection === 'up' ? 'Increase' : 'Decrease'}</span>
            </div>
        </div>
    );
}


// Main Dashboard Component
function CommunityApprovalDashboard() {
    const [filter, setFilter] = useState('pending'); // Default filter to 'pending'
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCommunity, setSelectedCommunity] = useState(null);
    const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);

    // --- Hooks for fetching data and mutations ---
    const { user } = useAuth(); // Auth context for user role and token
    const {
        data: fetchedCommunitiesData,
        isLoading,
        isError,
        error,
        refetch // Function to manually refetch communities
    } = useListPendingCommunities(); // This hook now only fetches pending communities as per its name

    // Review mutation hook
    const reviewCommunityMutation = useReviewCommunity();

    useEffect(() => {
        // This ensures the dropdown closes if clicked outside
        const handleClickOutside = (event) => {
            if (isFilterDropdownOpen && !event.target.closest('.relative.w-full.sm\\:w-auto')) {
                setIsFilterDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isFilterDropdownOpen]);

    const communities = fetchedCommunitiesData?.pendingCommunities || [];

    const handleApprove = (communityId, communityName) => {
        toast.promise(
          reviewCommunityMutation.mutateAsync({ communityId, action: 'approve' }), // Pass 'approve'
          {
            loading: `Approving "${communityName}"...`,
            success: `Community "${communityName}" approved!`,
            error: `Failed to approve "${communityName}".`,
          }
        );
      };

      const handleReject = (communityId, communityName) => {
        const reason = prompt(`Enter reason for rejecting "${communityName}" (optional):`);
        if (reason === null) return;
        toast.promise(
          reviewCommunityMutation.mutateAsync({ communityId, action: 'reject', rejectionReason: reason }), // Pass 'reject'
          {
            loading: `Rejecting "${communityName}"...`,
            success: `Community "${communityName}" rejected!`,
            error: `Failed to reject "${communityName}".`,
          }
        );
      };


    // Filter communities based on search term and selected status filter
    const filteredCommunities = communities.filter(community => {
        const matchesSearch =
            community.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (community.owners?.[0]?.fullName || '').toLowerCase().includes(searchTerm.toLowerCase());

        const matchesFilter = filter === 'All' || (community.status && community.status.toLowerCase() === filter.toLowerCase());

        return matchesFilter && matchesSearch;
    });

    // Handle status updates and real-time updates from action buttons in list/modal
    // This is called by CommunityRequestItem and DetailModal
    const handleUpdateStatus = (communityId, action, reason = '') => {
        toast.promise(
            reviewCommunityMutation.mutateAsync({ communityId, action, rejectionReason: reason }),
            {
                loading: `Updating status...`,
                success: `Community status updated!`,
                error: `Failed to update status.`,
            }
        ).finally(() => {
            setSelectedCommunity(null); // Close modal after action regardless of success/error
        });
    };

    const handleSaveAdminNotes = (communityId, notes) => {
        console.log(`Saving notes for community ${communityId}:`, notes);
        toast.success("Admin notes saved (frontend-only for now)!");
    };

    // Calculate counts for StatCards
    const counts = {
        All: communities.length,
        Pending: communities.length,
        Approved: 0,
        Rejected: 0,
    };

    // Dummy trend data for StatCards
    const statCardTrends = {
        All: { percentage: 2.5, direction: 'up' },
        Pending: { percentage: 1.2, direction: 'up' },
        Approved: { percentage: 0.8, direction: 'up' },
        Rejected: { percentage: 0.5, direction: 'down' },
    };

    // Basic role check for access (ideally also protected by router/backend)
    if (!user || user.role !== 'admin') {
        return (
            <div className="px-6 py-5 min-h-screen flex items-center justify-center text-center text-red-500">
                <p>Access Denied: You must be an administrator to view this page.</p>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="px-6 py-5 min-h-screen flex items-center justify-center text-center text-gray-600">
                <p>Loading pending community requests...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="px-6 py-5 min-h-screen flex items-center justify-center text-center text-red-500">
                <p>Error loading requests: {error.message}</p>
            </div>
        );
    }

    // --- CONSOLE LOGS FOR DEBUGGING ---
    console.log('CommunityApprovalDashboard Render:');
    console.log('  Filter:', filter);
    console.log('  Search Term:', searchTerm);
    console.log('  Fetched Communities (Raw from hook):', fetchedCommunitiesData);
    console.log('  Parsed Communities (communities array):', communities);
    console.log('  Filtered Communities (displayed list):', filteredCommunities);
    console.log('  Counts:', counts);
    // --- END CONSOLE LOGS ---

    return (
        <div className="flex flex-col font-inter antialiased">
            {/* Main Content Area */}
            <div className="flex-1">
                {/* Header */}
                <header className="bg-white shadow-sm border border-gray-100 p-6 mb-6 flex flex-col md:flex-row items-center rounded-xl justify-between space-y-4 md:space-y-0 md:space-x-6">
                    <h1 className="text-3xl font-extrabold text-gray-900 leading-tight">Community Requests</h1>
                    <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4 w-full md:w-auto">
                        <div className="relative w-full sm:w-80">
                            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search community or creator..."
                                className="pl-10 pr-3 py-2 border-b border-gray-300 focus:border-blue-400 focus:outline-none w-full text-gray-700 text-sm bg-transparent"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="relative w-full sm:w-auto">
                            <button
                                onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                                className="flex items-center justify-between px-3 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors w-full sm:w-40 text-sm font-medium border border-gray-200 rounded"
                            >
                                <ListFilter size={16} className="mr-2 text-gray-500" />
                                <span>{filter} Requests</span>
                                {isFilterDropdownOpen ? <ChevronUp size={16} className="ml-2" /> : <ChevronDown size={16} className="ml-2" />}
                            </button>
                            {isFilterDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg z-10 border border-gray-200 rounded animate-slideDown origin-top-right">
                                    {['All', 'Pending', 'Approved', 'Rejected'].map(option => (
                                        <button
                                            key={option}
                                            onClick={() => {
                                                setFilter(option);
                                                setIsFilterDropdownOpen(false);
                                            }}
                                            className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-50 transition-colors text-sm"
                                        >
                                            {option}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Stat Cards Section */}
                <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 animate-fadeIn">
                    <StatCard
                        title="Total Requests"
                        count={counts.All}
                        icon={ListFilter}
                        color={infoColor} // Blue
                        trendPercentage={statCardTrends.All.percentage}
                        trendDirection={statCardTrends.All.direction}
                    />
                    <StatCard
                        title="Pending Requests"
                        count={counts.Pending}
                        icon={Clock}
                        color={warningColor} // Yellow
                        trendPercentage={statCardTrends.Pending.percentage}
                        trendDirection={statCardTrends.Pending.direction}
                    />
                    <StatCard
                        title="Approved Requests"
                        count={counts.Approved}
                        icon={CheckCircle}
                        color={successColor} // Green
                        trendPercentage={statCardTrends.Approved.percentage}
                        trendDirection={statCardTrends.Approved.direction}
                    />
                    <StatCard
                        title="Rejected Requests"
                        count={counts.Rejected}
                        icon={XCircle}
                        color={dangerColor} // Red
                        trendPercentage={statCardTrends.Rejected.percentage}
                        trendDirection={statCardTrends.Rejected.direction}
                    />
                </section>

                {/* Community Request List */}
                <section className="space-y-4">
                    {filteredCommunities.length > 0 ? (
                        filteredCommunities.map((community) => (
                            <CommunityRequestItem
                                key={community._id}
                                community={community}
                                onViewDetails={setSelectedCommunity}
                                onApprove={handleApprove} // Pass handleApprove directly
                                onReject={handleReject}   // Pass handleReject directly
                                isMutating={reviewCommunityMutation.isPending}
                            />
                        ))
                    ) : (
                        <div className="text-center py-10 text-gray-500 text-lg bg-white border border-gray-100 rounded animate-fadeIn">
                            <p>No community requests found matching your criteria.</p>
                            <p className="text-sm mt-2">Try adjusting your filters or search term.</p>
                        </div>
                    )}
                </section>
            </div>

            {/* Detail Modal Render */}
            {selectedCommunity && (
                <DetailModal
                    community={selectedCommunity}
                    onClose={() => setSelectedCommunity(null)}
                    onUpdateStatus={handleUpdateStatus}
                    onSaveAdminNotes={handleSaveAdminNotes}
                    isMutating={reviewCommunityMutation.isPending}
                />
            )}
        </div>
    );
}

export default CommunityApprovalDashboard;