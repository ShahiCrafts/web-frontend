// components/PostsTabContent.jsx
import React from 'react';
import { FileText, Plus, Filter, ArrowUpRight } from 'lucide-react';
import { PostCard } from './PostCard'; // Assuming PostCard is correctly implemented
import { LuxuryButton } from './LuxuryButton';
import { useFetchUserPosts } from '../../hooks/user/useProfileTan'; // Import the hook

export function PostsTabContent({ userId }) { // Receive userId as prop
    // Fetch posts for the user
    // `postsResponse` will hold the entire { success: true, count: X, data: [...] } object
    const { data: postsResponse, isLoading, isError, error } = useFetchUserPosts(userId, {});

    // Extract the actual array of posts from the 'data' property
    const posts = postsResponse?.data || [];

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-48">
                <p className="text-gray-600">Loading your posts...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex justify-center items-center h-48">
                <p className="text-red-500">Error loading posts: {error?.message || 'Failed to fetch posts.'}</p>
            </div>
        );
    }

    return (
        <section className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                        <FileText className="w-4 h-4 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                        My Posts
                    </h2>
                </div>
                <div className="flex items-center gap-3">
                    <LuxuryButton variant="secondary" size="sm">
                        <Filter className="w-4 h-4 mr-2" />
                        Filter
                    </LuxuryButton>
                    <LuxuryButton size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        New Post
                    </LuxuryButton>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {posts.length > 0 ? (
                    posts.map((post) => (
                        // Ensure PostCard uses 'post._id' or 'post.id' as key
                        <PostCard key={post._id} post={post} /> 
                    ))
                ) : (
                    <div className="md:col-span-2 text-center text-gray-500 py-8">
                        <p>No posts found for this user.</p>
                        <p className="mt-2 text-sm">Start by creating a new post!</p>
                    </div>
                )}
            </div>
        </section>
    );
}