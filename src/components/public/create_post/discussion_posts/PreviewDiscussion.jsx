import React, { useState } from 'react';
import { Heart, MessageSquare, Share2 } from 'lucide-react';

const PLACEHOLDER_IMAGES = [
  'https://via.placeholder.com/400x240?text=Image+1',
  'https://via.placeholder.com/400x240?text=Image+2',
  'https://via.placeholder.com/400x240?text=Image+3',
  'https://via.placeholder.com/400x240?text=Image+4',
  'https://via.placeholder.com/400x240?text=Image+5',
];

// Helper function to render content with highlighted tags
const renderContentWithTags = (content) => {
  // Regex to split by tags (#tag)
  const parts = content.split(/(#\w+)/g);

  return parts.map((part, idx) => {
    if (part.startsWith('#')) {
      return (
        <span
          key={idx}
          className="text-[#ff5c00] font-semibold cursor-pointer"
          title={`Tag: ${part.substring(1)}`}
        >
          {part}
        </span>
      );
    }
    return <span key={idx}>{part}</span>;
  });
};

export default function PreviewDiscussion({
  author,
  time,
  community,
  title,
  content = '',
  tags = [],
}) {
  const [expanded, setExpanded] = useState(false);

  const renderImages = () => (
    <div className="grid grid-cols-2 gap-2 mb-4 relative max-w-xl mx-auto">
      {PLACEHOLDER_IMAGES.slice(0, 3).map((src, index) => (
        <img
          key={index}
          src={src}
          alt={`Image ${index + 1}`}
          className="w-full h-40 object-cover rounded-md border border-gray-200"
        />
      ))}
      <div className="col-span-1 relative">
        <img
          src={PLACEHOLDER_IMAGES[3]}
          alt="Image 4"
          className="w-full h-40 object-cover rounded-md border border-gray-200 opacity-60"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-white text-lg font-semibold bg-black/60 px-4 py-1 rounded-full">
            +2
          </span>
        </div>
      </div>
    </div>
  );

  const contentWords = content.trim().split(' ');
  const shouldShowToggle = contentWords.length > 20;
  const authorName = author?.fullName || 'Your Name';


  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 w-full">
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 bg-gray-200 rounded-full mr-3" />
        <div>
          <div className="flex items-center text-sm">
            <span className="font-semibold text-gray-800">
              {authorName?.trim() || 'This will be your name'}
            </span>
            <span className="text-gray-500 mx-1">•</span>
            <span className="text-gray-500">
              {time?.trim() || 'a few moments ago'}
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-2">
            Community: {community?.name?.trim() || 'Your community name'}
          </p>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        {title?.trim() || 'This will be your post title'}
      </h2>

      {/* Post Content with Show More */}
      <div className="mb-4 text-gray-700 text-sm leading-relaxed">
        <p className={`${expanded ? '' : 'line-clamp-2'}`}>
          {renderContentWithTags(content.trim() || 'This will be your post content')}
        </p>
        {shouldShowToggle && (
          <button
            onClick={() => setExpanded((prev) => !prev)}
            className="text-blue-600 font-medium text-sm hover:underline ml-1"
          >
            {expanded ? 'Show less' : 'Show more'}
          </button>
        )}
      </div>

      {renderImages()}

      {/* Removed separate tags block */}

      <div className="border-t border-gray-200 my-2" />

      <div className="flex items-center justify-start space-x-6 text-gray-600">
        <button className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-md">
          <Heart className="w-4 h-4" />
          <span className="text-sm font-medium">Like</span>
        </button>
        <button className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-md">
          <MessageSquare className="w-4 h-4" />
          <span className="text-sm font-medium">Comment</span>
        </button>
        <button className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-md">
          <Share2 className="w-4 h-4" />
          <span className="text-sm font-medium">Share</span>
        </button>
      </div>
    </div>
  );
}
