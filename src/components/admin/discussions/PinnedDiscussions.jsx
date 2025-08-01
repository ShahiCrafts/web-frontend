import React, { useState, useEffect, useRef } from 'react';
import { Users, MessageSquare, Clock, MoreHorizontal, Pin, Eye, Trash2 } from 'lucide-react';
import { useFetchDiscussions, useToggleDiscussionPinStatus } from '../../../hooks/admin/useDiscussionHook'; // <-- Import hooks
import Pagination from '../../common/Pagination';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

// Reusable UI components from AllDiscussions.jsx
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

// ActionsDropdown component is needed here to allow unpinning
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


export default function PinnedDiscussions() {
    // We can assume a new `isPinned` query parameter is handled by the backend.
    const queryParams = { isPinned: true };
    const { data, isLoading, isError, error } = useFetchDiscussions(queryParams);
    const discussions = data?.discussions || [];
    const totalCount = data?.totalDiscussions || 0;
    const totalPages = data?.totalPages || 0;
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);


    if (isError) {
        return <p className="text-center text-red-600">Error fetching pinned discussions: {error.message}</p>;
    }
    
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-lg font-bold text-gray-900 flex items-center">
                    <Pin className="w-6 h-6 mr-3 text-blue-600" /> Pinned Discussions
                </h2>
                <p className="text-gray-500 mt-1 text-base">Important discussions highlighted for the community</p>
            </div>
            
            <div className="space-y-4">
                {isLoading ? (
                    <div className="text-center p-8 text-gray-500">Loading pinned discussions...</div>
                ) : discussions.length === 0 ? (
                    <div className="text-center p-8 text-gray-500">No pinned discussions found.</div>
                ) : (
                    discussions.map(d => (
                        <div key={d._id} className="bg-white border-l-4 border-blue-500 p-5 rounded-r-lg shadow-sm">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center space-x-3">
                                    <h3 className="text-lg font-bold text-gray-900">{d.title}</h3>
                                    {d.status === 'ACTIVE' && <CategoryTag className="bg-green-100 text-green-800 border border-green-200">Active</CategoryTag>}
                                    {d.status === 'CLOSED' && <CategoryTag className="bg-orange-100 text-orange-800 border border-orange-200">Closed</CategoryTag>}
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