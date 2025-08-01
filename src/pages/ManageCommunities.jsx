// src/components/ManageCommunities.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Cog6ToothIcon,
    PlusCircleIcon,
    ChevronDownIcon,
    ChevronUpIcon,
    UsersIcon,
    XMarkIcon, // Renamed from X, typical for Heroicons X
    Bars3Icon, // For hamburger menu, Heroicons equivalent of Lucide Menu
    ChevronLeftIcon, // For back button in CommunityViewPage
} from '@heroicons/react/24/solid'; // Changed to solid for consistency with other Heroicons

import { CustomAvatar } from '../pages/profile/CustomAvatar'; // Adjust path if needed
import CreateCommunityModal from './CreateCommunityModal'; // Adjust path if needed

import { useUserOwnedCommunities } from '../hooks/useCommunitiesTan'; // Assuming this is your hook file
import { useAuth } from '../context/AuthProvider'; // Import useAuth

// Import the CommunityViewPage component
import CommunityViewPage from '../components/public/home/CommunityViewPage'; // Adjust path as needed based on your file structure

const MAX_DESCRIPTION_LENGTH = 70; // Define a maximum length for the description snippet

const ManageCommunities = () => {
    const { user } = useAuth();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [expandedDescriptions, setExpandedDescriptions] = useState({});
    const [selectedCommunity, setSelectedCommunity] = useState(null); // State to hold the selected community for viewing

    const {
        data: ownedCommunitiesData,
        isLoading,
        isError,
        error,
    } = useUserOwnedCommunities();

    const myCommunities = ownedCommunitiesData?.communities || [];

    const handleOpenCreateModal = () => setIsCreateModalOpen(true);
    const handleCloseCreateModal = () => setIsCreateModalOpen(false);

    const toggleDescription = (communityId) => {
        setExpandedDescriptions((prev) => ({
            ...prev,
            [communityId]: !prev[communityId],
        }));
    };

    // Refined to only return classes for 'pending', 'rejected', 'archived'
    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-700'; // Changed to yellow for pending for better UX
            case 'rejected':
                return 'bg-red-100 text-red-700';
            case 'archived':
                return 'bg-gray-100 text-gray-700';
            default:
                return ''; // No badge class for 'approved'
        }
    };

    // Tooltip for pending/archived. Rejected will show reason directly.
    const getStatusTooltip = (community) => {
        switch (community.status) {
            case 'pending':
                return 'This community is awaiting admin approval.';
            case 'archived':
                return 'This community has been archived.';
            default:
                return ''; // No tooltip needed for approved or rejected (reason shown directly)
        }
    };

    // Handler for clicking a community card
    const handleCommunityCardClick = (community) => {
        if (community.status === 'approved') {
            setSelectedCommunity(community);
        } else {
            // Optionally, show a toast or message that only approved communities can be managed
            console.log(`Community "${community.name}" is ${community.status}. Only approved communities can be managed.`);
            // toast.error(`Community "${community.name}" is ${community.status}. Cannot manage.`);
        }
    };

    // Handler to go back to the list of communities
    const handleBackToList = () => {
        setSelectedCommunity(null);
    };

    if (isLoading) {
        return (
            <div className="px-6 py-5 min-h-screen flex items-center justify-center text-center text-gray-600">
                <p>Loading your communities...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="px-6 py-5 min-h-screen flex items-center justify-center text-center text-red-500">
                <p>Error loading communities: {error.message}</p>
            </div>
        );
    }

    // Conditional rendering based on selectedCommunity state
    if (selectedCommunity) {
        return <CommunityViewPage community={selectedCommunity} onBackToList={handleBackToList} />;
    }

    return (
        <div className="px-6 py-5 bg-white min-h-screen font-sans text-gray-800">
            {/* Header for the page */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-8 relative"
            >
                <h1 className="text-4xl font-bold mb-2">My Communities</h1>
                <p className="text-md text-gray-500">
                    Manage your created communities, view status, and customize settings.
                </p>

                <motion.button
                    className="absolute top-0 right-0 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white
                    bg-gradient-to-r from-orange-500 to-red-500 shadow-md hover:from-orange-600 hover:to-red-600 transition-all duration-300"
                    onClick={handleOpenCreateModal}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <PlusCircleIcon className="w-5 h-5" />
                    Create
                </motion.button>
            </motion.div>

            {/* Grid for Community Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {myCommunities.length === 0 ? (
                    <motion.div
                        key="no-communities-message"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="md:col-span-3 text-center py-10 text-gray-600 bg-gray-50 rounded-xl"
                    >
                        <p className="text-lg mb-2">You haven't created any communities yet.</p>
                        <p>Click "Create" to start a new one!</p>
                    </motion.div>
                ) : (
                    <AnimatePresence>
                        {myCommunities.map((community) => {
                            const isDescriptionExpanded = expandedDescriptions[community._id];
                            const descriptionSnippet = community.description && community.description.substring(0, MAX_DESCRIPTION_LENGTH);
                            const hasLongDescription = community.description && community.description.length > MAX_DESCRIPTION_LENGTH;

                            return (
                                <motion.div
                                    key={community._id}
                                    className="relative bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all flex flex-col overflow-hidden p-5 cursor-pointer" // Added cursor-pointer
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -15 }}
                                    transition={{ duration: 0.4 }}
                                    onClick={() => handleCommunityCardClick(community)} // Added onClick handler
                                >
                                    {/* Avatar directly inside the card, at the top left */}
                                    <div className="flex items-center gap-4 mb-4">
                                        <CustomAvatar
                                            fullName={community.name}
                                            imageUrl={community.avatarUrl}
                                            size="w-16 h-16 text-xl"
                                        />
                                        <div className="flex flex-col">
                                            <h3 className="text-xl font-bold text-gray-800">{community.name}</h3>
                                            {/* Members Count - Moved here */}
                                            <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                                                <UsersIcon className="w-4 h-4 text-gray-500" />
                                                <span>{community.stats?.membersCount || 0} Members</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Top-right elements (Status Badge & Settings Icon) */}
                                    <div className="absolute top-4 right-4 flex items-center gap-2 z-20">
                                        {/* Settings Icon - Only for Approved Communities */}
                                        {community.status === 'approved' && (
                                            <button
                                                className="text-gray-500 hover:text-gray-700 p-1 rounded-full bg-white/70 backdrop-blur-sm"
                                                title="Community Settings" // Add a title for accessibility
                                                onClick={(e) => { // Prevent card click from triggering when clicking settings
                                                    e.stopPropagation();
                                                    // Navigate to community settings page/modal
                                                    console.log(`Open settings for ${community.name}`);
                                                }}
                                            >
                                                <Cog6ToothIcon className="w-5 h-5" />
                                            </button>
                                        )}
                                        {/* Status Badge (only for pending, rejected, archived) */}
                                        {community.status !== 'approved' && (
                                            <div
                                                className={`text-xs font-semibold px-2 py-1 rounded-full capitalize ${getStatusBadgeClass(community.status)}`}
                                                title={getStatusTooltip(community)}
                                            >
                                                {community.status}
                                            </div>
                                        )}
                                    </div>

                                    {/* Description with Show More/Less Button inline */}
                                    <p className="text-sm text-gray-600 mt-2 flex-grow"> {/* flex-grow to push footer down */}
                                        {/* Render full description or snippet based on expansion */}
                                        {community.description && (isDescriptionExpanded || !hasLongDescription)
                                            ? community.description
                                            : descriptionSnippet}

                                        {/* Render ellipsis and Show More/Less button inline */}
                                        {hasLongDescription && (
                                            <span className="inline-block"> {/* Use inline-block to keep button with text, but allow layout control */}
                                                {!isDescriptionExpanded && '...'} {/* Ellipsis only when clamped */}
                                                <button
                                                    onClick={(e) => { // Prevent card click from triggering when clicking expand
                                                        e.stopPropagation();
                                                        toggleDescription(community._id);
                                                    }}
                                                    className="ml-1 text-blue-600 hover:underline text-xs font-medium inline-flex items-center whitespace-nowrap"
                                                >
                                                    {isDescriptionExpanded ? (
                                                        <>
                                                            Show Less <ChevronUpIcon className="w-3 h-3 ml-1" />
                                                        </>
                                                    ) : (
                                                        <>
                                                            Show More <ChevronDownIcon className="w-3 h-3 ml-1" />
                                                        </>
                                                    )}
                                                </button>
                                            </span>
                                        )}
                                        {!community.description && !hasLongDescription && "No description provided."}
                                    </p>


                                    {/* Rejection Reason (always last and prominent if present) */}
                                    {community.status === 'rejected' && community.rejectionReason && (
                                        <div className="text-sm text-red-600 mt-3 p-3 bg-red-50 rounded-lg border border-red-200">
                                            <strong className="block mb-1">Rejection Reason:</strong>
                                            <p>{community.rejectionReason}</p>
                                        </div>
                                    )}
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                )}
            </div>

            <AnimatePresence>
                {isCreateModalOpen && <CreateCommunityModal onClose={handleCloseCreateModal} />}
            </AnimatePresence>
        </div>
    );
};

export default ManageCommunities;