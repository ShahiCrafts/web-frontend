import React, { useState, useEffect, useRef } from 'react';
import { Search, MoreHorizontal, Eye, ThumbsUp, ThumbsDown, Plus, Library, Edit, Trash2, Archive, Info } from 'lucide-react';
import { useGetAllContents } from '../../../hooks/useReportContentHook';
import Pagination from '../../common/Pagination';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const StatusBadge = ({ status }) => {
    const statusClasses = {
        'ACTIVE': 'bg-green-100 text-green-800',
        'CLOSED': 'bg-gray-100 text-gray-800',
        'REPORTED': 'bg-red-100 text-red-800',
        'UNDER_REVIEW': 'bg-yellow-100 text-yellow-800',
        'DELETED': 'bg-gray-100 text-gray-800',
    };
    const statusText = {
        'ACTIVE': 'Published',
        'CLOSED': 'Closed',
        'REPORTED': 'Flagged',
        'UNDER_REVIEW': 'Under Review',
        'DELETED': 'Deleted',
    };

    const classes = statusClasses[status] || statusClasses.DELETED;
    const text = statusText[status] || 'Unknown';

    return (
        <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${classes}`}>
            {text}
        </span>
    );
};

export default function AllContent() {
    const [openMenuId, setOpenMenuId] = useState(null);
    const [menuPosition, setMenuPosition] = useState({});
    const menuRef = useRef(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 300);
        return () => clearTimeout(handler);
    }, [searchTerm]);

    // --- DEBUG LOGS FOR HOOK STATE ---
    const { data, isLoading, isError, error } = useGetAllContents({
        page,
        limit,
        search: debouncedSearchTerm,
        status: statusFilter,
        categoryId: categoryFilter,
    });
    console.log("useGetAllContents Hook State:");
    console.log("  isLoading:", isLoading);
    console.log("  isError:", isError);
    console.log("  Error Object:", error);
    console.log("  Data:", data);
    // ---------------------------------

    const posts = data?.posts || [];
    const totalPosts = data?.totalPosts || 0;
    const totalPages = data?.totalPages || 0;

    const handleMenuToggle = (id, event) => {
        event.stopPropagation();
        if (openMenuId === id) {
            setOpenMenuId(null);
        } else {
            setOpenMenuId(id);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setOpenMenuId(null);
            }
        };
        if (openMenuId !== null) {
            document.addEventListener('click', handleClickOutside);
        }
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [openMenuId]);

    if (isError) {
      return (
        <div className="p-4 text-red-600 text-center">
            <p>Error fetching content: {error.message}</p>
            {/* Display full error details for debugging */}
            <pre className="mt-4 text-left text-sm text-gray-800 bg-gray-100 p-4 rounded-md overflow-x-auto">
                {JSON.stringify(error, null, 2)}
            </pre>
        </div>
      );
    }
    
    // ... (rest of the component's JSX remains the same) ...
    return (
        <div>
            {/* Component Header & Actions */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <div className="mb-4 md:mb-0">
                    <h2 className="text-base font-semibold text-gray-800 flex items-center gap-2">
                        <Library className="w-5 h-5" style={{ color: '#FF5C00' }} />
                        Content Library
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">Manage all platform content and media.</p>
                </div>
                <div className="flex items-center space-x-2 w-full md:w-auto">
                    <div className="relative flex-grow md:flex-grow-0">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search content..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
                        />
                    </div>
                    <button
                        className="flex-shrink-0 flex items-center gap-2 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm"
                        style={{ backgroundColor: '#FF5C00' }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#E05100'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#FF5C00'}
                    >
                        <Plus size={18} />
                        Create
                    </button>
                </div>
            </header>

            {/* Content Table */}
            <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Content</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Engagement</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {isLoading ? (
                            <tr><td colSpan="7" className="py-10 text-center text-gray-500">Loading content...</td></tr>
                        ) : posts.length === 0 ? (
                            <tr><td colSpan="7" className="py-8 text-center text-gray-500"><Info size={40} className="mx-auto text-gray-400 mb-3" /><h3 className="font-semibold text-gray-700">No Content Found</h3><p className="text-sm text-gray-500">No content matches your search or filters.</p></td></tr>
                        ) : (
                            posts.map((item, index) => (
                                <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4"><p className="text-sm font-medium text-gray-900">{item.title}</p><p className="text-sm text-gray-600">{item.content}</p></td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.author?.fullName || 'N/A'}</td>
                                    <td className="px-6 py-4"><span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-800">{item.category?.name || 'N/A'}</span></td>
                                    <td className="px-6 py-4"><StatusBadge status={item.status} /></td>
                                    <td className="px-6 py-4 text-sm text-gray-700">
                                        <div className="flex items-center gap-3">
                                            <span className="flex items-center gap-1"><ThumbsUp size={16} /> {item.likesCount || 0}</span>
                                            <span className="flex items-center gap-1"><ThumbsDown size={16} /> {item.dislikesCount || 0}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{new Date(item.createdAt).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 text-center relative">
                                        <button onClick={(e) => handleMenuToggle(item._id, e, index === posts.length - 1)} className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors">
                                            <MoreHorizontal size={20} />
                                        </button>
                                        {openMenuId === item._id && (
                                            <div
                                                ref={menuRef}
                                                className="absolute right-0 w-38 bg-white rounded-md shadow-lg z-10 border border-gray-100 mt-2"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <ul className="py-1 text-sm">
                                                    <li><button className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center gap-3"><Eye size={16}/> View Details</button></li>
                                                    <li><button className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center gap-3"><Edit size={16}/> Edit</button></li>
                                                    <li><button className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center gap-3"><Archive size={16}/> Archive</button></li>
                                                    <li><hr className="my-1 border-gray-100" /></li>
                                                    <li><button className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 hover:text-red-700 flex items-center gap-3"><Trash2 size={16}/> Delete</button></li>
                                                </ul>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {posts.length > 0 && (
                <div className="mt-6">
                    <Pagination
                        currentPage={page}
                        totalCount={totalPosts}
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