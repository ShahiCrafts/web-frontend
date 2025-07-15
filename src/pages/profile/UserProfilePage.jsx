// components/ProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthProvider';
import toast from 'react-hot-toast';
import { Shield } from 'lucide-react';

import { ProfileHeader } from './ProfileHeader';
import { ProfileTabs } from './ProfileTabs';
import { OverviewTabContent } from './OverviewTabContent';
import { PostsTabContent } from './PostsTabContent';
import { ReportsTabContent } from './ReportsTabContent'; // Correct import path
import { ActivityTabContent } from './ActivityTabContent';
import { SecurityTabContent } from './SecurityTabContent';

import { useFetchUserProfile, useUpdateUserProfile } from '../../hooks/user/useProfileTan';

export default function ProfilePage() {
    const { user: authUser, loading: authLoading } = useAuth();
    const userId = authUser?.id;

    // Fetch user profile data using the hook.
    // `fetchedProfileResponse` will hold the entire { success: true, data: { ... } } object from the API.
    const { data: fetchedProfileResponse, isLoading: profileLoading, isError: profileError, error: fetchError } = useFetchUserProfile(userId);

    // CRITICAL: Extract the actual user object from the 'data' property of the response.
    // This `userProfile` variable will now directly hold the user details or be null/undefined.
    const userProfile = fetchedProfileResponse?.data;

    // `useUpdateUserProfile` is kept here only if `ProfileHeader` or `ProfilePage` itself triggers a profile update.
    // If only `OverviewTabContent` handles profile updates, you can remove this from here.
    const { mutate: updateUserProfile, isPending: isSaving } = useUpdateUserProfile();


    const [isEditing, setIsEditing] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');
    const [headerHeight, setHeaderHeight] = useState(0);

    // Mock data (only keep mocks that aren't fetched by specific hooks yet)
    // Removed `mockReports` as ReportsTabContent will fetch its own data.
    const socialStats = {
        posts: 0,
        followers: 52300,
        following: 743,
        engagement: 9.2,
        growth: 28.5
    };

    const mockActivities = [
        { id: 1, type: 'login', action: 'Logged in', details: '...', timestamp: '2 hours ago' },
        { id: 2, type: 'post', action: 'Published a new post', details: '...', timestamp: '2 days ago' },
        { id: 3, type: 'report', action: 'Submitted a report', details: '...', timestamp: '1 week ago' },
        { id: 4, type: 'comment', action: 'Commented on a post', details: '...', timestamp: '1 week ago' },
        { id: 5, type: 'profile', action: 'Updated profile', details: '...', timestamp: '2 weeks ago' }
    ];

    useEffect(() => {
        const headerElement = document.getElementById('profile-header');
        if (headerElement) {
            const resizeObserver = new ResizeObserver(entries => {
                for (let entry of entries) {
                    setHeaderHeight(entry.contentRect.height);
                }
            });
            resizeObserver.observe(headerElement);
            return () => resizeObserver.disconnect();
        }
    }, [isEditing]);

    const handleToggleEditMode = () => {
        setIsEditing(prev => !prev);
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            toast.info('Image upload functionality will be implemented soon.', {
                style: {
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                },
            });
            console.log('Selected file:', file);
        }
    };

    // Consolidated loading state for initial data fetch
    if (authLoading || (userId && profileLoading)) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500/20 border-t-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Loading your profile...</p>
                </div>
            </div>
        );
    }

    // Handle not logged in (no authUser or no userId derived)
    if (!authUser || !userId) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
                <div className="text-center bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-200/50">
                    <Shield className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <p className="text-red-500 font-semibold">Please log in to view your profile.</p>
                </div>
            </div>
        );
    }

    // Handle profile fetch error after authUser is confirmed
    if (profileError) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
                <div className="text-center bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-200/50">
                    <Shield className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <p className="text-red-500 font-semibold">Error loading profile data: {fetchError?.message || 'Unknown error'}</p>
                    <p className="text-gray-500 text-sm mt-2">Please try again later.</p>
                </div>
            </div>
        );
    }

    // If userProfile (the actual user data) is null or undefined after loading, display "Profile not found"
    if (!userProfile) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
                <div className="text-center bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-200/50">
                    <Shield className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-700 font-semibold">Profile not found for this user ID.</p>
                    <p className="text-gray-500 text-sm mt-2">The user profile could not be loaded.</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <ProfileHeader
                currentUser={userProfile} // This is now correctly the actual user data object
                isEditing={isEditing}
                isSaving={isSaving}
                onEditClick={handleToggleEditMode}
                onImageChange={handleImageUpload}
                socialStats={socialStats}
            />

            <ProfileTabs
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                headerHeight={headerHeight}
            />

            <main className="px-6 py-8">
                {activeTab === 'overview' && (
                    <OverviewTabContent
                        userId={userId} // Pass userId
                        isEditing={isEditing}
                        setIsEditing={setIsEditing}
                    />
                )}

                {activeTab === 'posts' && (
                    <PostsTabContent userId={userId} />
                )}

                {activeTab === 'reports' && (
                    // --- CRITICAL FIX: Pass userId instead of mockReports ---
                    <ReportsTabContent userId={userId} />
                    // --- END CRITICAL FIX ---
                )}

                {activeTab === 'activity' && (
                    <ActivityTabContent mockActivities={mockActivities} />
                )}

                {activeTab === 'security' && (
                    <SecurityTabContent userId={userId} />
                )}
            </main>
        </div>
    );
}