import React, { useState, useEffect, useRef } from 'react';
import { Search, Lock, Users, MessageSquare, Clock, MoreHorizontal, Pin, Flag, Plus, ChevronDown, Eye, Trash2 } from 'lucide-react';
import { useFetchDiscussions, useToggleDiscussionPinStatus } from '../../../hooks/admin/useDiscussionHook';
import { useFetchCategories } from '../../../hooks/admin/useCategoryTan'; // <-- Import the category hook
import Pagination from '../../common/Pagination';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const CategoryTag = ({ children, className }) => (
    <span className={`text-xs font-medium px-2 py-1 rounded-md ${className}`}>
        {children}
    </span>
);

const Tag = ({ children }) => (
    <span className="bg-gray-100 text-gray-600 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full">
        #{children}
    </span>
);

const IconWrapper = ({ icon: Icon, text, className = "text-gray-500" }) => (
    <div className={`flex items-center text-sm ${className}`}>
        <Icon className="w-4 h-4 mr-1.5" />
        <span>{text}</span>
    </div>
);

// ActionsDropdown component remains the same
const ActionsDropdown = ({ discussion }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [dropdownRef]);

    const togglePinMutation = useToggleDiscussionPinStatus();

    const handlePinClick = () => {
        setIsOpen(false);
        togglePinMutation.mutate(discussion._id, {
            onSuccess: () => {
                toast.success(`Discussion "${discussion.title}" has been ${discussion.isPinned ? 'unpinned' : 'pinned'}!`);
            },
            onError: (err) => {
                toast.error(`Failed to toggle pin status: ${err.message || 'Server error'}`);
            }
        });
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-500 hover:text-gray-800 p-2 rounded-full hover:bg-gray-100 transition-colors">
                <MoreHorizontal className="w-5 h-5" />
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                    <button onClick={handlePinClick} className="flex items-center w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100">
                        <Pin className="w-4 h-4 mr-2 text-gray-500" />
                        {discussion.isPinned ? 'Unpin Discussion' : 'Pin Discussion'}
                    </button>
                    <Link to={`/admin/discussions/${discussion._id}`} className="flex items-center w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100">
                        <Eye className="w-4 h-4 mr-2 text-gray-500" />
                        View Discussion
                    </Link>
                    <button onClick={() => toast.error("Not implemented yet")} className="flex items-center w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-red-50">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Discussion
                    </button>
                </div>
            )}
        </div>
    );
};

export default function AllDiscussions({ activeTab }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

    // Debounce the search term
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 300);
        return () => clearTimeout(handler);
    }, [searchTerm]);

    // Fetch the discussions data
    const queryParams = {
        page,
        limit,
        search: debouncedSearchTerm,
        sortBy: 'createdAt',
        sortOrder: 'desc',
    };
    if (activeTab === 'pinned') {
        queryParams.isPinned = true;
    } else if (activeTab === 'moderation') {
        queryParams.status = 'REPORTED';
    }
    if (statusFilter) {
        queryParams.status = statusFilter;
    }
    if (categoryFilter) {
        queryParams.categoryId = categoryFilter;
    }

    const { data: discussionsData, isLoading: isDiscussionsLoading, isError: isDiscussionsError, error: discussionsError } = useFetchDiscussions(queryParams);
    const discussions = discussionsData?.discussions || [];
    const totalCount = discussionsData?.totalDiscussions || 0;
    const totalPages = discussionsData?.totalPages || 0;

    // Fetch the categories data
    const { data: categoriesData, isLoading: isCategoriesLoading, isError: isCategoriesError } = useFetchCategories({});
    const categories = categoriesData?.categories || [];

    if (isDiscussionsError) {
        return <p className="text-center text-red-600">Error fetching discussions: {discussionsError.message}</p>;
    }
    if (isCategoriesError) {
        // Handle categories error separately so the page can still render
        console.error("Error fetching categories:", isCategoriesError);
    }

    return (
        <div className="space-y-6">
            {/* Header and Controls */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                    <h2 className="text-lg font-bold text-gray-900">Community Discussions</h2>
                    <p className="text-gray-500 mt-1 text-base">Manage discussion threads and community conversations</p>
                </div>
                <button className="flex items-center text-sm bg-[#ff5c00] text-white font-semibold px-4 py-2 rounded-lg mt-4 md:mt-0 hover:bg-[#e05100] transition-colors">
                    <Plus className="w-4 h-4 mr-2" />
                    Start Discussion
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search discussions..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white border border-gray-300 rounded-lg pl-10 pr-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#ff5c00]"
                    />
                </div>
                <div className="relative">
                    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="appearance-none w-full md:w-auto bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#ff5c00]">
                        <option value="">All Statuses</option>
                        <option value="ACTIVE">Active</option>
                        <option value="CLOSED">Closed</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
                <div className="relative">
                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="appearance-none w-full md:w-auto bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#ff5c00]"
                    >
                        <option value="">All Categories</option>
                        {isCategoriesLoading ? (
                            <option disabled>Loading...</option>
                        ) : (
                            categories.map(cat => (
                                <option key={cat._id} value={cat._id}>{cat.name}</option>
                            ))
                        )}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
            </div>

            {/* Discussion List */}
            <div className="space-y-4">
                {isDiscussionsLoading ? (
                    <div className="text-center p-8 text-gray-500">Loading discussions...</div>
                ) : discussions.length === 0 ? (
                    <div className="text-center p-8 text-gray-500">No discussions found.</div>
                ) : (
                    discussions.map(d => (
                        <div key={d._id} className="bg-white border border-gray-200 p-5 rounded-lg">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center space-x-3">
                                    {d.isPinned && <Pin className="w-5 h-5 text-orange-500" />}
                                    <h3 className="text-lg font-bold text-gray-900">{d.title}</h3>
                                </div>
                                <ActionsDropdown discussion={d} />
                            </div>
                            <p className="text-gray-600 mt-2 text-base">{d.content}</p>
                            <div className="flex flex-wrap items-center mt-4 text-gray-600 gap-x-4 gap-y-2">
                                <div className="flex items-center">
                                    <div className="w-6 h-6 rounded-full bg-gray-400 mr-2 flex items-center justify-center text-white text-xs font-bold">
                                        {d.authorId?.fullName?.charAt(0) || 'A'}
                                    </div>
                                    <span>{d.authorId?.fullName || 'Anonymous'}</span>
                                </div>
                                <CategoryTag className="bg-gray-100 text-gray-700">{d.categoryId?.name || 'Uncategorized'}</CategoryTag>
                                {d.status === 'CLOSED' && <CategoryTag className="bg-orange-100 text-orange-800 border border-orange-200">Closed</CategoryTag>}
                                {d.status === 'REPORTED' && <CategoryTag className="bg-red-100 text-red-800 border border-red-200">Reported</CategoryTag>}
                                {d.status === 'UNDER_REVIEW' && <CategoryTag className="bg-yellow-100 text-yellow-800 border border-yellow-200">Under Review</CategoryTag>}
                            </div>
                            <hr className="my-4 border-gray-200" />
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                                <div className="flex flex-wrap gap-2 mb-3 sm:mb-0">
                                    {d.tags && d.tags.map(tag => <Tag key={tag}>{tag}</Tag>)}
                                </div>
                                <div className="flex items-center space-x-4 text-gray-500">
                                    <IconWrapper icon={MessageSquare} text={`${d.commentsCount} replies`} />
                                    <IconWrapper icon={Users} text={`${d.votedUsers?.length || 0} participants`} />
                                    <IconWrapper icon={Clock} text={new Date(d.createdAt).toLocaleDateString()} />
                                </div>
                            </div>
                        </div>
                    ))
                )}
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