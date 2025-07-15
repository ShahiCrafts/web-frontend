import React, { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Import Heroicons (only for category tabs and "Create" button)
import {
    ClipboardDocumentListIcon, // For All (General)
    BuildingOffice2Icon, // For Government
    MegaphoneIcon,       // For Advocacy
    HandRaisedIcon,      // For Volunteer
    ScaleIcon,           // For Policy
    GlobeAmericasIcon,   // For Environment
    BookOpenIcon,        // For Education
    ShieldCheckIcon,     // For Safety
    SparklesIcon,        // For Youth
    PlusCircleIcon       // For "Create" button
} from '@heroicons/react/24/solid';

// Import your CustomAvatar component
import { CustomAvatar } from '../pages/profile/CustomAvatar'; // Ensure this path is correct
// Import the CreateCommunityModal
import CreateCommunityModal from './CreateCommunityModal'; // Adjust path if necessary

// Import the new hook for fetching communities
import { useInfiniteApprovedCommunities } from '../hooks/useCommunitiesTan'; // Adjust path as needed

// Helper component for individual community cards
const CommunityCard = ({ community, onJoinToggle }) => {
    // Determine the class for the Join/Joined button
    const joinButtonClasses = `
        ml-auto px-4 py-2 text-sm font-medium rounded-md transition-colors flex-shrink-0 whitespace-nowrap
        ${community.isJoined
            ? 'bg-emerald-500 hover:bg-emerald-600 text-white' // Keeping emerald for "Joined" for clear distinction
            : 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white'
        }
    `;

    return (
        <motion.div
            className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm transition-all duration-200 relative overflow-hidden hover:shadow-md hover:-translate-y-0.5"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            whileHover={{ scale: 1.01 }}
        >
            <div className="flex items-center mb-4">
                {/* Use CustomAvatar component here */}
                <CustomAvatar
                    fullName={community.name}
                    imageUrl={community.profileImage} // Pass profileImage if it exists
                    size="w-12 h-12" // Size matches the previous w-12 h-12 avatar
                />
                <div className="flex-1 min-w-0 ml-3"> {/* Added ml-3 for spacing after avatar */}
                    <div className="text-lg font-semibold text-gray-800 truncate">{community.name}</div>
                    <div className="text-sm text-gray-500">{community.members}</div> {/* Assuming 'members' still comes from API */}
                </div>
                <motion.button
                    className={joinButtonClasses}
                    onClick={() => onJoinToggle(community.id)} // Assuming 'id' is still used for toggling
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    {community.isJoined ? 'Joined' : (community.isPrivate ? 'Send Join Request' : 'Join')}
                </motion.button>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">{community.description}</p>
            <div className="flex gap-4 text-xs text-gray-400">
                <div className="flex items-center gap-1">
                    <span className="text-base">💬</span>
                    <span>{community.posts} posts</span> {/* Assuming 'posts' still comes from API */}
                </div>
                <div className="flex items-center gap-1">
                    <span className="text-base">📅</span>
                    <span>{community.events} events</span> {/* Assuming 'events' still comes from API */}
                </div>
            </div>
        </motion.div>
    );
};

// Main component
function ExploreCommunities() {
    const [activeCategory, setActiveCategory] = useState('all');
    // We will manage joined state locally for demonstration, in a real app this would be part of user data or a separate API call.
    const [localJoinedState, setLocalJoinedState] = useState({});
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    // Use the TanStack Query hook
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
        error,
        refetch // Add refetch to manually re-fetch data if needed
    } = useInfiniteApprovedCommunities({ category: activeCategory !== 'all' ? activeCategory : undefined });

    // Combine all pages into a single array of communities
    const communities = data?.pages?.flatMap(page => page.communities) || [];

    const categoryIcons = {
        'all': ClipboardDocumentListIcon,
        'government': BuildingOffice2Icon,
        'advocacy': MegaphoneIcon,
        'volunteer': HandRaisedIcon,
        'policy': ScaleIcon,
        'environment': GlobeAmericasIcon,
        'education': BookOpenIcon,
        'safety': ShieldCheckIcon,
        'youth': SparklesIcon,
    };

    const categories = [
        { id: 'all', icon: categoryIcons['all'], name: 'All' },
        { id: 'government', icon: categoryIcons['government'], name: 'Government' },
        { id: 'advocacy', icon: categoryIcons['advocacy'], name: 'Advocacy' },
        { id: 'volunteer', icon: categoryIcons['volunteer'], name: 'Volunteer' },
        { id: 'policy', icon: categoryIcons['policy'], name: 'Policy' },
        { id: 'environment', icon: categoryIcons['environment'], name: 'Environment' },
        { id: 'education', icon: categoryIcons['education'], name: 'Education' },
        { id: 'safety', icon: categoryIcons['safety'], name: 'Safety' },
        { id: 'youth', icon: categoryIcons['youth'], name: 'Youth' },
    ];

    const categoriesRef = useRef(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(true);

    const handleJoinToggle = (communityId) => {
        // In a real application, this would involve an API call to join/leave a community.
        // For demonstration, we're just toggling a local state.
        setLocalJoinedState(prev => ({
            ...prev,
            [communityId]: !prev[communityId]
        }));
        console.log(`Toggled join status for community ${communityId}`);
    };

    const handleShowMore = () => {
        if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    };

    const handleCreateCommunity = () => {
        setIsCreateModalOpen(true);
    };

    const handleCloseCreateModal = () => {
        setIsCreateModalOpen(false);
    };

    const scrollCategories = (direction) => {
        if (categoriesRef.current) {
            const scrollAmount = 200;
            if (direction === 'left') {
                categoriesRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            } else {
                categoriesRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            }
        }
    };

    const checkScrollArrows = useCallback(() => {
        if (categoriesRef.current) {
            const { scrollWidth, clientWidth, scrollLeft } = categoriesRef.current;
            setShowLeftArrow(scrollLeft > 0);
            setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 5); // A small buffer
        }
    }, []);

    useEffect(() => {
        checkScrollArrows();
        if (categoriesRef.current) {
            const activeCategoryElement = categoriesRef.current.querySelector(`[data-category-id="${activeCategory}"]`);
            if (activeCategoryElement) {
                activeCategoryElement.scrollIntoView({ behavior: 'smooth', inline: 'center' });
            }
        }
        // When category changes, reset scroll to start for better UX
        if (categoriesRef.current) {
            categoriesRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        }
    }, [activeCategory, checkScrollArrows]);

    useEffect(() => {
        const currentRef = categoriesRef.current;
        if (currentRef) {
            currentRef.addEventListener('scroll', checkScrollArrows);
            window.addEventListener('resize', checkScrollArrows);
            checkScrollArrows();
        }
        return () => {
            if (currentRef) {
                currentRef.removeEventListener('scroll', checkScrollArrows);
            }
            window.removeEventListener('resize', checkScrollArrows);
        };
    }, [checkScrollArrows]);

    if (isLoading) return <div className="text-center py-10">Loading communities...</div>;
    if (isError) return <div className="text-center py-10 text-red-600">Error: {error.message}</div>;

    // Separate recommended and other communities (if your API supports this, otherwise remove)
    // For now, let's assume the API returns a flat list and we display all of them.
    // If your API can categorize "recommended" vs "more", you'd adjust the useInfiniteApprovedCommunities params.
    // For this example, we'll just display all fetched communities under "All Communities" or similar,
    // or you could filter them based on some criteria if the API response includes it.
    // For simplicity, let's assume all communities fetched are displayed together.

    return (
        <>
            <div className="px-4 sm:px-6 md:px-8 lg:px-10 py-5 bg-white min-h-screen font-sans text-gray-800">
                {/* Header section */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8 text-left relative"
                >
                    <h1 className="text-3xl sm:text-4xl font-bold mb-2">Explore Communities</h1>
                    <p className="text-sm sm:text-md text-gray-500">Discover groups that align with your interests and make an impact.</p>

                    {/* Create Button */}
                    <motion.button
                        className="absolute top-0 right-0 flex items-center justify-center gap-1 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-sm sm:text-base font-semibold text-white
                                 bg-gradient-to-r from-orange-500 to-red-500 shadow-md hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105"
                        onClick={handleCreateCommunity}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        whileHover={{ scale: 1.03, boxShadow: '0 5px 10px -2px rgba(255, 99, 71, 0.4)' }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <PlusCircleIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                        Create
                    </motion.button>
                </motion.div>

                {/* Category tabs: With navigation arrows, hidden scrollbar, and fade effect */}
                <div className="relative mb-8">
                    {/* Left Fade */}
                    <AnimatePresence>
                        {showLeftArrow && (
                            <motion.div
                                key="left-fade"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="absolute left-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"
                            />
                        )}
                    </AnimatePresence>

                    {/* Right Fade */}
                    <AnimatePresence>
                        {showRightArrow && (
                            <motion.div
                                key="right-fade"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="absolute right-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"
                            />
                        )}
                    </AnimatePresence>

                    <div
                        className="flex items-center overflow-x-auto hide-scrollbar py-2 px-1 space-x-2 sm:space-x-3 scroll-smooth"
                        ref={categoriesRef}
                        style={{ WebkitOverflowScrolling: 'touch' }}
                    >
                        {categories.map(category => {
                            const categoryButtonClasses = `
                                flex items-center gap-1 sm:gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-colors duration-200
                                ${activeCategory === category.id
                                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-sm'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }
                            `;
                            return (
                                <motion.button
                                    key={category.id}
                                    data-category-id={category.id}
                                    className={categoryButtonClasses}
                                    onClick={() => setActiveCategory(category.id)}
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    {category.icon && <category.icon className="w-4 h-4 sm:w-5 sm:h-5" />} {category.name}
                                </motion.button>
                            );
                        })}
                    </div>
                    {/* Navigation Arrows */}
                    <AnimatePresence>
                        {showLeftArrow && (
                            <motion.button
                                key="left-arrow"
                                onClick={() => scrollCategories('left')}
                                className="absolute left-0 top-1/2 -translate-y-1/2 bg-white rounded-full p-1.5 sm:p-2 shadow-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-200 z-20"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                            </motion.button>
                        )}
                    </AnimatePresence>

                    <AnimatePresence>
                        {showRightArrow && (
                            <motion.button
                                key="right-arrow"
                                onClick={() => scrollCategories('right')}
                                className="absolute right-0 top-1/2 -translate-y-1/2 bg-white rounded-full p-1.5 sm:p-2 shadow-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-200 z-20"
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                                transition={{ duration: 0.2 }}
                            >
                                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                            </motion.button>
                        )}
                    </AnimatePresence>
                </div>

                {/* Communities Section */}
                <section className="mb-10">
                    <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 mb-6 text-left">All Communities</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        <AnimatePresence mode='wait'>
                            {communities.length > 0 ? (
                                communities.map(community => (
                                    <CommunityCard
                                        key={community.id}
                                        community={{ ...community, isJoined: localJoinedState[community.id] || false }}
                                        onJoinToggle={handleJoinToggle}
                                    />
                                ))
                            ) : (
                                <motion.p
                                    key="no-communities"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="col-span-full text-center text-gray-400 text-sm py-8"
                                >
                                    No communities found for this category.
                                </motion.p>
                            )}
                        </AnimatePresence>
                    </div>
                    {hasNextPage && (
                        <motion.button
                            className={`
                                block mx-auto mt-8 px-6 py-3 border border-gray-200 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors duration-200
                                ${isFetchingNextPage
                                    ? 'bg-gray-100 text-gray-600 cursor-not-allowed'
                                    : 'bg-white text-gray-600 hover:bg-gradient-to-r hover:from-orange-500 hover:to-red-500 hover:text-white'
                                }
                            `}
                            onClick={handleShowMore}
                            disabled={isFetchingNextPage}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {isFetchingNextPage ? 'Loading more...' : 'Load more'}
                        </motion.button>
                    )}
                </section>
                {isCreateModalOpen && (
                    <CreateCommunityModal onClose={handleCloseCreateModal} />
                )}
            </div>
        </>
    );
}

export default ExploreCommunities;