import React, { useState, useEffect, useRef } from 'react';
import { Search, MoreHorizontal, Eye, ThumbsUp, Plus, Library, Flag, Edit, Trash2, BarChart, PieChart, FileText, CheckCircle, TrendingUp, ShieldAlert, EyeOff, Pencil, Archive } from 'lucide-react';

const contentData = [
    { id: 1, title: 'New Park Development Plans', description: 'Visual presentation...', author: 'David Wilson', category: 'Recreation', status: 'published', views: 2156, likes: 134, created: 'Jan 22, 2024' },
    { id: 2, title: 'Budget Proposal Discussion', description: 'A deep dive into the 2024...', author: 'Emily Carter', category: 'Budget', status: 'published', views: 1247, likes: 89, created: 'Jan 20, 2024' },
];
const StatusBadge = ({ status }) => (
    <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
);

export default function AllContent() {
    // State to manage which action menu is open
    const [openMenuId, setOpenMenuId] = useState(null);
    const [menuPosition, setMenuPosition] = useState({});
    const menuRef = useRef(null);

    const handleMenuToggle = (id, event, isLastRow) => {
        event.stopPropagation();
        if (openMenuId === id) {
            setOpenMenuId(null);
            return;
        }

        const buttonRect = event.currentTarget.getBoundingClientRect();
        const popoverHeight = 132; // Approximate height of the popover

        let position = {
            right: event.currentTarget.offsetWidth, // Position to the left of the button
            top: 0, 
        };

        // If it's the last row, always open upwards. Otherwise, check for space.
        if (isLastRow || buttonRect.bottom + popoverHeight > window.innerHeight) {
            position.top = 'auto';
            position.bottom = 0; // Position above the button
        }
        
        setMenuPosition(position);
        setOpenMenuId(id);
    };

    // Effect to close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = () => {
            setOpenMenuId(null);
        };
        if (openMenuId !== null) {
            document.addEventListener('click', handleClickOutside);
        }
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [openMenuId]);


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
                        <input type="text" placeholder="Search content..." className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-orange-500" />
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
            <div className="overflow-x-auto">
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
                        {contentData.map((item, index) => (
                            <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4"><p className="text-sm font-medium text-gray-900">{item.title}</p><p className="text-sm text-gray-600">{item.description}</p></td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.author}</td>
                                <td className="px-6 py-4"><span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-800">{item.category}</span></td>
                                <td className="px-6 py-4"><StatusBadge status={item.status} /></td>
                                <td className="px-6 py-4 text-sm text-gray-700"><div className="flex items-center gap-3"><span className="flex items-center gap-1"><Eye size={16} /> {item.views}</span><span className="flex items-center gap-1"><ThumbsUp size={16} /> {item.likes}</span></div></td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.created}</td>
                                <td className="px-6 py-4 text-center relative">
                                    <button onClick={(e) => handleMenuToggle(item.id, e, index === contentData.length - 1)} className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors">
                                        <MoreHorizontal size={20} />
                                    </button>
                                    {openMenuId === item.id && (
                                        <div 
                                            ref={menuRef}
                                            className="absolute w-38 bg-white rounded-md shadow-lg z-10 border border-gray-100" 
                                            style={menuPosition}
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <ul className="py-1 text-sm">
                                                <li><button className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center gap-3"><Eye size={16}/> View Details</button></li>
                                                <li><button className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center gap-3"><Archive size={16}/> Archive</button></li>
                                                <li><hr className="my-1 border-gray-100" /></li>
                                                <li><button className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 hover:text-red-700 flex items-center gap-3"><Trash2 size={16}/> Delete</button></li>
                                            </ul>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};