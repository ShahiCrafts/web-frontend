import React from 'react';
import clsx from 'clsx';
import { Edit, Save, Settings, Share, Verified, Star, MapPin, Calendar, Crown, Camera } from 'lucide-react';
import { LuxuryButton } from './LuxuryButton';
import { CustomAvatar } from './CustomAvatar';

export function ProfileHeader({
    isEditing,
    isSaving,
    onEditClick, // This will now be the toggle for edit mode
    onImageChange, // For the file input's onChange
    currentUser,   // THIS IS THE SOURCE OF TRUTH FOR DISPLAY
    socialStats    // Still a mock, so we'll handle fallbacks
}) {
    // --- DEBUG START ---
    console.log('ProfileHeader: currentUser prop received:', currentUser);
    console.log('ProfileHeader: isEditing prop received:', isEditing);
    // --- DEBUG END ---

    // Defensive props for rendering:
    // Ensure currentUser exists before trying to access its properties.
    // Provide sensible fallback values for display.
    const displayName = currentUser?.fullName || currentUser?.username || 'Guest User';
    console.log(displayName);
    const displayEmail = currentUser?.email || 'N/A';
    const displayBio = currentUser?.bio || 'No bio provided yet.';
    const displayLocation = currentUser?.location || 'Unspecified Location';
    const displayProfileImage = currentUser?.profileImage; 
        console.log(displayProfileImage);
// Make sure you have a default avatar image at this path

    // Handler for avatar image upload click
    const handleAvatarClick = () => {
        // Only allow click if in editing mode
        if (isEditing) {
            document.getElementById('profileImageUpload')?.click();
        }
    };

    return (
        <header id="profile-header" className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 z-20">
            <div className="px-6 py-8">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-8">
                        <div className="relative">
                            <CustomAvatar
                                // Pass the actual currentUser data for display
                                fullName={displayName}
                                imageUrl={displayProfileImage}
                                size="w-28 h-28"
                                isEditing={isEditing}
                                onClick={handleAvatarClick} // Use the internal handler
                            />
                            {/* Crown/Badge based on role/achievements (display only, not editable here) */}
                            {currentUser?.role === 'admin' && ( // Example for an admin badge
                                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-red-500 to-rose-600 rounded-full flex items-center justify-center shadow-lg">
                                    <Crown className="w-4 h-4 text-white" />
                                </div>
                            )}
                            {/* You can add more badges here based on currentUser.achievements or other properties */}
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center gap-4">
                                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                                    {displayName}
                                </h1>
                                <div className="flex items-center gap-2">
                                    {/* These badges are currently static. If they depend on currentUser, use conditional rendering */}
                                    <div className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full text-sm font-medium shadow-lg">
                                        <Verified className="w-4 h-4" />
                                        Verified
                                    </div>
                                    <div className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-full text-sm font-medium shadow-lg">
                                        <Star className="w-4 h-4" />
                                        Premium
                                    </div>
                                </div>
                            </div>
                            <p className="text-gray-600 font-medium">{displayEmail}</p>
                            <p className="text-gray-700 max-w-md leading-relaxed">{displayBio}</p>
                            <div className="flex items-center gap-6 text-sm text-gray-500">
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4" />
                                    {displayLocation}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    Joined {currentUser?.createdAt ? new Date(currentUser.createdAt).toLocaleDateString() : 'N/A'}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <LuxuryButton variant="ghost" size="md">
                            <Share className="w-4 h-4 mr-2" />
                            Share
                        </LuxuryButton>
                        <LuxuryButton
                            onClick={onEditClick} // This will be the toggle for isEditing state in ProfilePage
                            loading={isSaving} // isSaving applies to save mutation for the current tab
                            className="min-w-[140px]"
                        >
                            {isEditing ? (
                                <>
                                    <Save className="w-4 h-4 mr-2" />
                                    Save Changes {/* This button *triggers* the save in OverviewTabContent */}
                                </>
                            ) : (
                                <>
                                    <Edit className="w-4 h-4 mr-2" />
                                    Edit Profile
                                </>
                            )}
                        </LuxuryButton>
                        <LuxuryButton variant="ghost" size="md">
                            <Settings className="w-5 h-5" />
                        </LuxuryButton>
                    </div>
                </div>

                {/* Enhanced Stats */}
                <div className="grid grid-cols-4 gap-8 mt-8 p-6 bg-white/50 backdrop-blur-sm rounded-2xl border border-gray-200/50">
                    <div className="text-center group cursor-pointer">
                        <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent group-hover:from-purple-600 group-hover:to-pink-600 transition-all duration-300">
                            {socialStats.posts?.toLocaleString() || '0'} {/* Use optional chaining and fallback */}
                        </div>
                        <div className="text-sm text-gray-500 font-medium mt-1">Posts</div>
                    </div>
                    <div className="text-center group cursor-pointer">
                        <div className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent group-hover:from-teal-600 group-hover:to-cyan-600 transition-all duration-300">
                            {socialStats.followers !== undefined ? (socialStats.followers / 1000).toFixed(1) + 'K' : '0K'}
                        </div>
                        <div className="text-sm text-gray-500 font-medium mt-1">Followers</div>
                    </div>
                    <div className="text-center group cursor-pointer">
                        <div className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent group-hover:from-rose-600 group-hover:to-red-600 transition-all duration-300">
                            {socialStats.following?.toLocaleString() || '0'}
                        </div>
                        <div className="text-sm text-gray-500 font-medium mt-1">Following</div>
                    </div>
                    <div className="text-center group cursor-pointer">
                        <div className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent group-hover:from-amber-600 group-hover:to-yellow-600 transition-all duration-300">
                            {socialStats.engagement !== undefined ? socialStats.engagement + '%' : '0%'}
                        </div>
                        <div className="text-sm text-gray-500 font-medium mt-1">Engagement</div>
                    </div>
                </div>
            </div>
            {/* The hidden input for file upload, its onChange is handled by onImageChange prop */}
            <input
                type="file"
                id="profileImageUpload"
                accept="image/*"
                className="hidden"
                onChange={onImageChange}
            />
        </header>
    );
}