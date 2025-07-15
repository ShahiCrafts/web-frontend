import React from 'react';
import clsx from 'clsx';
import { Eye, Heart, MessageCircle, ArrowUpRight, Tag, Clock } from 'lucide-react'; // Added Tag and Clock for potential use
import { LuxuryButton } from './LuxuryButton';

export function PostCard({ post }) {
    // Destructure post defensively and provide fallbacks
    const {
        type,
        title,
        content,
        question, // For Polls
        eventDescription, // For Events
        categoryId, // For Report Issues (assuming it might be populated with a name or you'll display ID)
        status,
        likes = [], // Default to empty array if undefined
        commentsCount = 0, // Default to 0 if undefined
        createdAt,
        // No 'views' field in your schema, so we won't use it.
        // No 'date' field directly, will use 'createdAt'.
        // No 'excerpt' field directly, will derive from 'content' or 'eventDescription' or 'question'.
    } = post || {}; // Ensure post is not null/undefined

    // Determine the display title based on post type
    const displayTitle = type === 'Poll' ? question : title;

    // Determine the display content/excerpt
    let displayContent = '';
    if (type === 'Report Issue' || type === 'Discussion') {
        displayContent = content;
    } else if (type === 'Event') {
        displayContent = eventDescription;
    } else if (type === 'Poll') {
        // For polls, 'content' might be a description, or you might just show the question
        displayContent = content;
    }
    // Truncate content for excerpt if it's too long
    const excerpt = displayContent ? `${displayContent.substring(0, 150)}${displayContent.length > 150 ? '...' : ''}` : 'No description available.';

    // Determine the display category (if applicable)
    // Assuming categoryId might be populated with a 'name' field if it's a ref to a Category model
    const displayCategory = type === 'Report Issue' ? (categoryId?.name || 'Issue') : type;

    // Format the date
    const displayDate = createdAt ? new Date(createdAt).toLocaleDateString() : 'N/A';

    // Determine the status badge styling
    const statusBadgeClass = clsx(
        "px-3 py-1 rounded-full text-xs font-medium",
        {
            // Mapping your backend statuses to frontend styles
            'ACTIVE': 'bg-green-100 text-green-700',
            'CLOSED': 'bg-blue-100 text-blue-700',
            'REPORTED': 'bg-red-100 text-red-700',
            'UNDER_REVIEW': 'bg-yellow-100 text-yellow-700',
            'ACTION_TAKEN': 'bg-indigo-100 text-indigo-700', // Consider this as a 'resolved' state visually
            'REPORT_REJECTED': 'bg-gray-100 text-gray-700',
            'DELETED': 'bg-red-200 text-red-800',
            // Default fallback if status doesn't match
            'default': 'bg-gray-100 text-gray-700'
        }[status] || 'bg-gray-100 text-gray-700' // Fallback for unknown status
    );

    return (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200/50 hover:border-gray-300/50 transform hover:-translate-y-1">
            <div className="flex items-start gap-4">
                {/* Visual indicator for post type */}
                <div className={clsx(
                    "w-2 h-2 rounded-full mt-2 flex-shrink-0",
                    {
                        'Discussion': 'bg-blue-500',
                        'Report Issue': 'bg-red-500',
                        'Event': 'bg-purple-500',
                        'Poll': 'bg-green-500',
                    }[type] || 'bg-gray-500' // Default color
                )}></div>
                <div className="flex-1">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            {/* Display post type or category for Report Issues */}
                            <span className="text-sm font-medium text-gray-500">{displayCategory}</span>
                            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                            {/* Display formatted creation date */}
                            <span className="text-sm text-gray-500 flex items-center gap-1">
                                <Clock className="w-3 h-3" /> {displayDate}
                            </span>
                        </div>
                        {/* Status Badge */}
                        <div className={statusBadgeClass}>
                            {status}
                        </div>
                    </div>
                    {/* Display Title */}
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{displayTitle || 'Untitled Post'}</h3>
                    {/* Display Excerpt */}
                    <p className="text-gray-600 mb-4">{excerpt}</p>

                    {/* Tags (if available) */}
                    {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                            {post.tags.map((tag, index) => (
                                <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs flex items-center gap-1">
                                    <Tag className="w-3 h-3" /> {tag}
                                </span>
                            ))}
                        </div>
                    )}

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                            {/* Likes count */}
                            <div className="flex items-center gap-1">
                                <Heart className="w-4 h-4" />
                                {likes.length}
                            </div>
                            {/* Comments count */}
                            <div className="flex items-center gap-1">
                                <MessageCircle className="w-4 h-4" />
                                {commentsCount}
                            </div>
                            {/* Views is not in schema, so removed. Add if you track it. */}
                            {/* <div className="flex items-center gap-1">
                                <Eye className="w-4 h-4" />
                                {post.views || 0}
                            </div> */}
                        </div>
                        <LuxuryButton variant="ghost" size="sm">
                            <ArrowUpRight className="w-4 h-4" />
                        </LuxuryButton>
                    </div>
                </div>
            </div>
        </div>
    );
}