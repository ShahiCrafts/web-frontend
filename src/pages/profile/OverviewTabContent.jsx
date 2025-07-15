// components/OverviewTabContent.jsx
import React, { useEffect, useState } from 'react';
import { User, Mail, MapPin, FileText, Camera, X, CheckCircle, Award, Flag, Edit } from 'lucide-react';
import { LuxuryInput } from './LuxuryInput';
import { LuxuryButton } from './LuxuryButton';

// Import the hooks from your react-query setup
import {
    useFetchUserProfile,
    useUpdateUserProfile,
    useFetchUserPosts,
    // useFetchUserAchievements // Removed as it's not currently used to fetch data for display
} from '../../hooks/user/useProfileTan'; // Adjusted path to match ProfilePage.jsx

export function OverviewTabContent({
    isEditing,
    setIsEditing,
    userId, // THIS IS THE ONLY PROP RELATED TO USER DATA
}) {
    // --- DEBUG START ---
    console.log('OverviewTabContent: userId prop received:', userId);
    // --- DEBUG END ---

    // --- CRITICAL CHANGE IS HERE ---
    // Rename the `data` from the hook to something like `fetchedProfileResponse`
    // Then extract the actual user object from `fetchedProfileResponse.data`
    const { data: fetchedProfileResponse, isLoading: profileLoading, isError: profileError, error: profileFetchError } = useFetchUserProfile(userId);

    // This `userProfile` variable will now hold the actual user data object (or null/undefined)
    const userProfile = fetchedProfileResponse?.data;
    // --- END CRITICAL CHANGE ---

    const { data: userPostsData, isLoading: isLoadingPosts, isError: isErrorPosts } = useFetchUserPosts(userId);
    const { mutate: updateUserProfile, isPending: isSaving } = useUpdateUserProfile(); // Destructure mutate and isPending

    // Calculate actual reports and resolved reports from userPostsData
    const userReportIssues = userPostsData?.data?.filter(post => post.type === 'Report Issue') || [];
    const totalReportIssues = userReportIssues.length;
    const resolvedReportIssues = userReportIssues.filter(post =>
        // Assuming 'ACTION_TAKEN' or 'CLOSED' signify resolution
        ['ACTION_TAKEN', 'CLOSED'].includes(post.status)
    ).length;

    // Internal state for form data
    const [formData, setFormData] = useState({
        fullName: '',
        bio: '',
        location: '',
        profileImage: '',
        notificationPreferences: { email: true, inApp: true },
    });

    // Effect to initialize/update formData when userProfile data changes
    useEffect(() => {
        // Now 'userProfile' correctly refers to the actual user data object
        if (userProfile) {
            setFormData({
                fullName: userProfile.fullName || '',
                bio: userProfile.bio || '',
                location: userProfile.location || '',
                profileImage: userProfile.profileImage || '',
                notificationPreferences: userProfile.notificationPreferences || { email: true, inApp: true },
            });
        }
    }, [userProfile]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name.startsWith('notificationPreferences.')) {
            const prefKey = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                notificationPreferences: {
                    ...prev.notificationPreferences,
                    [prefKey]: type === 'checkbox' ? checked : value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSaveProfile = async () => {
        if (!userId) {
            toast.error('User ID not available for profile update.');
            return;
        }
        try {
            await updateUserProfile({ userId, updateData: formData });
            setIsEditing(false);
            toast.success('Profile updated successfully!');
        } catch (err) {
            console.error('Failed to update profile:', err);
            toast.error(err.message || 'Failed to update profile.');
        }
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
            console.log('Selected file for upload:', file.name);
        }
    };

    // Consolidated loading and error states for rendering
    if (profileLoading || isLoadingPosts) {
        console.log('OverviewTabContent: Loading profile or posts data...');
        return (
            <div className="flex justify-center items-center h-48">
                <p className="text-gray-600">Loading your profile data...</p>
            </div>
        );
    }

    if (profileError) {
        console.error('OverviewTabContent: Error fetching user profile:', profileFetchError);
        return (
            <div className="flex justify-center items-center h-48">
                <p className="text-red-500">Error loading profile: {profileFetchError?.message || 'Unknown error'}</p>
            </div>
        );
    }

    if (isErrorPosts) {
        console.error('OverviewTabContent: Error fetching user posts for stats.');
        return (
            <div className="flex justify-center items-center h-48">
                <p className="text-red-500">Error loading user posts stats.</p>
            </div>
        );
    }

    // Crucial: Only render content if userProfile (the actual data object) exists after loading
    if (!userProfile) {
        console.log('OverviewTabContent: userProfile is null/undefined after successful loading (no error).');
        return (
            <div className="flex justify-center items-center h-48">
                <p className="text-gray-600">User profile not found.</p>
            </div>
        );
    }

    return (
        <section className="space-y-8">
            {isEditing ? (
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-200/50">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                            <Edit className="w-4 h-4 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                            Edit Profile Information
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <LuxuryInput
                            label="Full Name"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            icon={User}
                        />
                        <LuxuryInput
                            label="Location"
                            name="location"
                            value={formData.location}
                            onChange={handleInputChange}
                            icon={MapPin}
                        />
                        <div className="md:col-span-2">
                            <LuxuryInput
                                label="Bio"
                                name="bio"
                                value={formData.bio}
                                onChange={handleInputChange}
                                rows={4}
                                icon={FileText}
                            />
                        </div>

                        {/* Notification Preferences */}
                        <div className="md:col-span-2 space-y-3">
                            <label className="text-sm font-semibold text-gray-700">Notification Preferences</label>
                            <div className="flex items-center gap-4">
                                <label className="flex items-center space-x-2 text-gray-800">
                                    <input
                                        type="checkbox"
                                        name="notificationPreferences.email"
                                        checked={formData.notificationPreferences.email}
                                        onChange={handleInputChange}
                                        className="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out rounded focus:ring-blue-500"
                                    />
                                    <span>Email Notifications</span>
                                </label>
                                <label className="flex items-center space-x-2 text-gray-800">
                                    <input
                                        type="checkbox"
                                        name="notificationPreferences.inApp"
                                        checked={formData.notificationPreferences.inApp}
                                        onChange={handleInputChange}
                                        className="form-checkbox h-4 w-4 text-purple-600 transition duration-150 ease-in-out rounded focus:ring-purple-500"
                                    />
                                    <span>In-App Notifications</span>
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 mt-8">
                        <input
                            type="file"
                            id="profileImageUpload"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                        />
                        <LuxuryButton
                            variant="secondary"
                            onClick={() => document.getElementById('profileImageUpload')?.click()}
                        >
                            <Camera className="w-4 h-4 mr-2" />
                            Change Photo
                        </LuxuryButton>
                        <LuxuryButton
                            onClick={handleSaveProfile}
                            disabled={isSaving}
                        >
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </LuxuryButton>
                        <LuxuryButton
                            variant="ghost"
                            onClick={() => setIsEditing(false)}
                        >
                            <X className="w-4 h-4 mr-2" />
                            Cancel
                        </LuxuryButton>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Profile Information */}
                    <div className="lg:col-span-2">
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-200/50">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                                    <User className="w-4 h-4 text-white" />
                                </div>
                                <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                                    Profile Information
                                </h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Full Name</label>
                                    <div className="text-gray-900 font-medium">{userProfile.fullName}</div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Username</label>
                                    <div className="text-gray-900 font-medium">{userProfile.username}</div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Email</label>
                                    <div className="text-gray-900 font-medium">{userProfile.email}</div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Location</label>
                                    <div className="text-gray-900 font-medium">{userProfile.location || 'N/A'}</div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Member Since</label>
                                    <div className="text-gray-900 font-medium">
                                        {userProfile?.createdAt ? new Date(userProfile.createdAt).toLocaleDateString() : 'N/A'}
                                    </div>
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Bio</label>
                                    <div className="text-gray-900 leading-relaxed">{userProfile.bio || 'No bio provided.'}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="space-y-6">
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-200/50">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Stats</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                            <FileText className="w-4 h-4 text-blue-600" />
                                        </div>
                                        <span className="text-gray-700">Total Posts</span>
                                    </div>
                                    <span className="font-bold text-gray-900">
                                        {userPostsData?.total !== undefined ? userPostsData.total : 'Loading...'}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                                            <Flag className="w-4 h-4 text-orange-600" />
                                        </div>
                                        <span className="text-gray-700">Report Issues</span>
                                    </div>
                                    <span className="font-bold text-gray-900">
                                        {totalReportIssues}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                            <CheckCircle className="w-4 h-4 text-green-600" />
                                        </div>
                                        <span className="text-gray-700">Resolved Reports</span>
                                    </div>
                                    <span className="font-bold text-gray-900">
                                        {resolvedReportIssues}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Achievement (using available userProfile.achievements if fetched) */}
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-200/50">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Achievement</h3>
                            {userProfile?.achievements && userProfile.achievements.length > 0 ? (
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <Award className="w-8 h-8 text-white" />
                                    </div>
                                    <div className="font-bold text-gray-900">{userProfile.achievements[0].name}</div>
                                    <div className="text-sm text-gray-500">{userProfile.achievements[0].description}</div>
                                </div>
                            ) : (
                                <div className="text-center text-gray-500">No achievements yet.</div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}