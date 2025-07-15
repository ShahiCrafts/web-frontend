import React from 'react';

// Import all the different card components
import DiscussionPostCard from './DiscussionPostCard';
import EventPostCard from './EventPostCard';
import PollPostCard from './PollPostCard';
import ReportPostCard from './ReportPostCard';

export default function AllPosts({ posts }) {
    // Handle the case where there are no posts to show
    if (!posts || posts.length === 0) {
        return (
            <div className="text-center py-10">
                <p className="text-gray-500">No posts found.</p>
                <p className="text-sm text-gray-400">Try a different filter or be the first to post!</p>
            </div>
        );
    }

    return (
        // Add spacing between the posts
        <div className="space-y-4">
            {posts.map(post => {
                // Use the post's unique MongoDB ID for the key
                const key = post._id;

                // Use the exact 'type' string from the database schema
                switch (post.type) {
                    case 'Discussion':
                        return <DiscussionPostCard key={key} post={post} />;
                    case 'Event':
                        return <EventPostCard key={key} post={post} />;
                    case 'Poll':
                        return <PollPostCard key={key} post={post} />;
                    case 'Report Issue':
                        return <ReportPostCard key={key} post={post} />;
                    default:
                        return null; // Don't render anything for unknown types
                }
            })}
        </div>
    );
};