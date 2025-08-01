import React, { useState } from 'react';
import {
    Newspaper,
    CalendarDays,
    Vote,
    MessageSquareWarning,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useInfiniteFetchPosts } from '../../../hooks/user/usePostTan';
import AllPosts from './AllPosts';
import CopyrightFooter from './CopyrightFooter';
import Notifications from './Notifications';

const filters = [
    { name: 'All Posts', icon: <Newspaper size={18} />, key: 'All Posts' },
    { name: 'Events', icon: <CalendarDays size={18} />, key: 'Events' },
    { name: 'Polls', icon: <Vote size={18} />, key: 'Polls' },
    { name: 'Reported Issues', icon: <MessageSquareWarning size={18} />, key: 'Reported Issues' },
];

export default function MainHomePage() {
    const [activeFilter, setActiveFilter] = useState('All Posts');
    const navigate = useNavigate();

    const {
        data,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status,
    } = useInfiniteFetchPosts({
        type: activeFilter === 'All Posts' ? undefined : activeFilter,
    });

    const posts = data?.pages.flatMap((page) => page.posts) ?? [];

    const handleFilterChange = (newFilter) => {
        if (newFilter !== activeFilter) {
            setActiveFilter(newFilter);
        }
    };

    const handleCreatePostClick = () => {
        navigate('/citizen/create-post');
    };

    return (
        <div className="mx-auto font-sans sm:px-4 pb-28 sm:pb-2">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Left - Post Feed */}
                <div className="lg:col-span-3">
                    {/* Desktop Filter Tabs */}
                    <nav className="hidden sm:flex flex-nowrap items-center gap-2 bg-white rounded-full shadow-sm border border-gray-100 p-1.5 mb-6 overflow-x-auto custom-scrollbar">
                        <style>
                            {`
                            .custom-scrollbar::-webkit-scrollbar {
                                display: none;
                            }
                            .custom-scrollbar {
                                -ms-overflow-style: none;
                                scrollbar-width: none;
                            }

                            @keyframes gradient-flow {
                                0% { background-position: 0% 50%; }
                                50% { background-position: 100% 50%; }
                                100% { background-position: 0% 50%; }
                            }
                            .animate-gradient-flow {
                                animation: gradient-flow 3s ease infinite;
                                background-size: 200% auto;
                            }
                            `}
                        </style>
                        {filters.map((filter) => (
                            <button
                                key={filter.name}
                                onClick={() => handleFilterChange(filter.name)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm focus:outline-none transition duration-300 flex-shrink-0
                                    ${activeFilter === filter.name
                                        ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white animate-gradient-flow'
                                        : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600'
                                    }`}
                            >
                                <span className={`transition ${activeFilter === filter.name ? 'text-white scale-105' : 'hover:text-orange-500'}`}>
                                    {filter.icon}
                                </span>
                                {filter.name}
                            </button>
                        ))}
                    </nav>

                    {/* Posts */}
                    <main>
                        {status === 'loading' ? (
                            <div className="text-center py-20 text-sm text-gray-600">Loading posts...</div>
                        ) : status === 'error' ? (
                            <div className="text-center py-20 text-red-600 font-medium text-sm">Error: {error.message}</div>
                        ) : (
                            <>
                                <div className="space-y-6">
                                    <AllPosts posts={posts} />
                                </div>
                                <div className="text-center mt-10 mb-6">
                                    <button
                                        onClick={() => fetchNextPage()}
                                        disabled={!hasNextPage || isFetchingNextPage}
                                        className="inline-flex items-center gap-2 px-6 py-2 text-sm rounded-lg font-medium bg-gray-50 border border-gray-200 hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isFetchingNextPage ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
                                                Loading more...
                                            </>
                                        ) : hasNextPage ? (
                                            <>
                                                Load More
                                                <span className="flex gap-1">
                                                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
                                                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100" />
                                                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200" />
                                                </span>
                                            </>
                                        ) : (
                                            'Nothing more to load'
                                        )}
                                    </button>
                                </div>
                            </>
                        )}
                    </main>
                </div>

                <aside className="hidden lg:block lg:col-span-2">
                    <div className="sticky top-[2px] h-[calc(100vh-60px)] overflow-y-auto pr-1 space-y-5 custom-scrollbar">
                        <style>
                            {`
        .custom-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .custom-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}
                        </style>

                        <Notifications />
                        <div className="bg-white rounded-lg border border-gray-100 p-3">
                            <CopyrightFooter />
                        </div>
                    </div>
                </aside>

            </div>

            {/* Mobile Bottom Navigation */}
            <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 border-t border-gray-200/50 shadow-2xl sm:hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-white/80 to-transparent pointer-events-none"></div>
                <div className="grid grid-cols-5 gap-x-1 px-2 py-0.5 relative">
                    {filters.slice(0, 2).map((filter) => {
                        const isActive = activeFilter === filter.name;
                        return (
                            <button
                                key={filter.name}
                                onClick={() => handleFilterChange(filter.name)}
                                className={`flex flex-col items-center py-1.5 text-[11px] ${isActive ? 'text-orange-600 font-semibold bg-orange-50 rounded-t-xl' : 'text-gray-500'}`}
                            >
                                {React.cloneElement(filter.icon, { size: 18 })}
                                <span className="mt-0.5">{filter.name.split(' ')[0]}</span>
                            </button>
                        );
                    })}

                    {/* FAB */}
                    <div className="relative">
                        <button
                            aria-label="Create Post"
                            onClick={handleCreatePostClick}
                            className="absolute -top-10 left-1/2 transform -translate-x-1/2 p-4 bg-orange-600 hover:bg-orange-700 text-white rounded-full shadow-lg border-4 border-white"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                            </svg>
                        </button>
                    </div>

                    {filters.slice(2).map((filter) => {
                        const isActive = activeFilter === filter.name;
                        return (
                            <button
                                key={filter.name}
                                onClick={() => handleFilterChange(filter.name)}
                                className={`flex flex-col items-center py-1.5 text-[11px] ${isActive ? 'text-orange-600 font-semibold bg-orange-50 rounded-t-xl' : 'text-gray-500'}`}
                            >
                                {React.cloneElement(filter.icon, { size: 18 })}
                                <span className="mt-0.5">{filter.name.split(' ')[0]}</span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
