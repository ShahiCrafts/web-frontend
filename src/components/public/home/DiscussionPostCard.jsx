import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  MoreVertical,
  Edit,
  Trash2,
  Flag,
  Users,
  Eye,
  Share2,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../../context/AuthProvider';
// Updated import: useUpdatePost is removed, useLikePost and useDislikePost are added
import {
  useDeletePost,
  useReportPost,
  useLikePost,
  useDislikePost,
} from '../../../hooks/user/usePostTan';
import clsx from 'clsx';
import { useSocket } from '../../../context/SocketProvider';

import ReportPostModal from './ReportPostModal';

// Helper components and functions (GradientAvatar, ActionButton, etc.) remain unchanged...
const getImageUrl = (path) => `http://localhost:8080/${path.replace(/\\/g, '/')}`;

const renderContentWithTags = (content = '', tags = []) => {
  const parts = content.split(/(#\w+)/g);
  return parts.map((part, idx) => {
    if (part.startsWith('#')) {
      const tag = part.slice(1).toLowerCase();
      const matched = tags.some((t) => t.toLowerCase() === tag);
      return matched ? (
        <span
          key={idx}
          className="text-orange-500 font-semibold cursor-pointer hover:text-orange-600 transition-colors px-1 -mx-1 rounded hover:bg-orange-50"
        >
          {part}
        </span>
      ) : (
        <span key={idx}>{part}</span>
      );
    }
    return <span key={idx}>{part}</span>;
  });
};

const GradientAvatar = ({ fullName, imageUrl, size = 'w-11 h-11' }) => {
  if (imageUrl) {
    return (
      <div className={`${size} rounded-full overflow-hidden flex-shrink-0 ring-2 ring-white shadow-lg transition-transform hover:scale-105`}>
        <img src={imageUrl} alt={fullName} className="w-full h-full object-cover" />
      </div>
    );
  }
  const getInitials = (name) => {
    if (!name) return '';
    const parts = name.split(' ');
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };
  const initials = getInitials(fullName);
  const hashCode = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
  };
  const colors = [
    'from-blue-500 to-purple-600',
    'from-green-500 to-emerald-600',
    'from-purple-500 to-pink-600',
    'from-red-500 to-orange-600',
    'from-yellow-500 to-orange-600',
    'from-indigo-500 to-blue-600',
    'from-pink-500 to-rose-600',
  ];
  const colorIndex = Math.abs(hashCode(fullName || '') % colors.length);
  const bgColor = colors[colorIndex];
  return (
    <div
      className={clsx(
        `${size} rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold text-lg bg-gradient-to-br ${bgColor} ring-2 ring-white shadow-lg transition-transform hover:scale-105 cursor-pointer`
      )}
    >
      {initials}
    </div>
  );
};

const ActionButton = ({
  icon: Icon,
  label,
  count,
  onClick,
  variant = 'default',
  size = 'default',
  active = false,
  className = ''
}) => {
  const variants = {
    default: 'bg-white border-2 border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300',
    primary: 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 shadow-lg',
    like: active ? 'bg-green-50 border-green-500 text-green-600' : 'bg-white border-gray-200 text-gray-700 hover:bg-green-50 hover:border-green-300 hover:text-green-600',
    dislike: active ? 'bg-red-50 border-red-500 text-red-600' : 'bg-white border-gray-200 text-gray-700 hover:bg-red-50 hover:border-red-300 hover:text-red-600',
    share: 'bg-white border-gray-200 text-gray-700 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600',
  };
  const sizes = {
    sm: 'px-3 py-2 text-xs',
    default: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  };
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        "inline-flex items-center gap-2 font-semibold rounded-xl transition-all duration-200",
        "hover:scale-105 hover:shadow-md active:scale-95 group",
        variants[variant],
        sizes[size],
        className
      )}
    >
      <Icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
      {count !== undefined && (
        <span className="font-bold">{count}</span>
      )}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
};


export default function DiscussionPostCard({ post = {} }) {
  const [expanded, setExpanded] = useState(false);
  const [showToggle, setShowToggle] = useState(false);
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  // Likes/dislikes counts are now derived directly from the post prop
  // and will update when the parent component's data is refetched.
  const likesCount = post.likes?.length || 0;
  const dislikesCount = post.dislikes?.length || 0;

  const contentRef = useRef(null);
  const moreOptionsRef = useRef(null);
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();

  const deletePostMutation = useDeletePost();
  const reportPostMutation = useReportPost();
  
  // --- REFACTORED SECTION ---
  // Use the new dedicated hooks for like/dislike actions
  const likePostMutation = useLikePost();
  const dislikePostMutation = useDislikePost();
  // The generic `useUpdatePost` is no longer needed here.
  // --- END REFACTORED SECTION ---

  const {
    _id,
    authorId,
    createdAt,
    community,
    title,
    content,
    tags = [],
    attachments = [],
    commentsCount = 0,
    sharesCount = 0,
    likes = [],
    dislikes = [],
  } = post;

  const { onlineUsers } = useSocket();
  const authorUserId = authorId?._id?.toString() || authorId?.toString() || '';
  const isAuthorOnline = onlineUsers?.includes(authorUserId) || false;

  const isLikedByCurrentUser = currentUser ? likes.includes(currentUser.id) : false;
  const isDislikedByCurrentUser = currentUser ? dislikes.includes(currentUser.id) : false;
  
  // This useEffect is no longer necessary as counts are derived directly
  // useEffect(() => {
  //  setLikesCount(likes.length);
  //  setDislikesCount(dislikes.length);
  // }, [likes, dislikes]);


  const isAuthor = currentUser && authorId && currentUser.id === authorId._id;

  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    })
    : 'a few moments ago';

  const checkOverflow = useCallback(() => {
    const element = contentRef.current;
    if (element) {
      // Add a small buffer to prevent toggling on exact fit
      const isClamped = element.scrollHeight > element.clientHeight + 2;
      setShowToggle(isClamped || expanded); // Keep showing if already expanded
    }
  }, [expanded]);

  useEffect(() => {
    let initialCheckTimer = setTimeout(checkOverflow, 100);
    const handleResize = () => checkOverflow();

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(initialCheckTimer);
    };
  }, [checkOverflow, content, tags]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (moreOptionsRef.current && !moreOptionsRef.current.contains(event.target)) {
        setShowMoreOptions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const imagesToUse = attachments.map(att => ({
    url: getImageUrl(att.url || att)
  }));

  const handleJoinDiscussion = () => {
    navigate(`/citizen/discussion/${_id}`, { state: { post } });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };


  // --- REFACTORED LIKE HANDLER ---
  const handleLike = () => {
    if (!currentUser) {
      toast.error('Please log in to like posts.');
      return;
    }
    
    // The hook now encapsulates the logic. We just pass the post ID.
    likePostMutation.mutate(_id, {
      onSuccess: () => {
        // The toast message is based on the action the user just took.
        toast.success(isLikedByCurrentUser ? 'Unliked post!' : 'Liked post!');
      },
      onError: (err) => {
        console.error("Like action failed:", err);
        toast.error(err.response?.data?.message || "Failed to update like status.");
      },
    });
  };

  // --- REFACTORED DISLIKE HANDLER ---
  const handleDislike = () => {
    if (!currentUser) {
      toast.error('Please log in to dislike posts.');
      return;
    }

    // The hook handles the logic. We just pass the post ID.
    dislikePostMutation.mutate(_id, {
      onSuccess: () => {
        toast.success(isDislikedByCurrentUser ? 'Removed dislike.' : 'Disliked post.');
      },
      onError: (err) => {
        console.error("Dislike action failed:", err);
        toast.error(err.response?.data?.message || "Failed to update dislike status.");
      },
    });
  };

  const handleDeletePost = () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      deletePostMutation.mutate(_id, {
        onSuccess: () => {
          toast.success('Post deleted successfully!');
          setShowMoreOptions(false);
        },
        onError: (err) => {
          toast.error(err.response?.data?.message || 'Failed to delete post.');
        },
      });
    }
  };

  const handleOpenReportModal = () => {
    setShowMoreOptions(false);
    setIsReportModalOpen(true);
  };

  const handleSubmitReport = (reportType, reason) => {
    reportPostMutation.mutate({ id: _id, reason, type: reportType }, {
      onSuccess: () => {
        toast.success('Post reported for review!');
        setIsReportModalOpen(false);
      },
      onError: (err) => {
        toast.error(err.response?.data?.message || 'Failed to report post.');
        setIsReportModalOpen(false);
      },
    });
  };

  const handleEditPost = () => {
    toast.info('Edit functionality not yet implemented.');
    setShowMoreOptions(false);
  };

  const renderImages = () => {
    // ... (renderImages implementation is unchanged)
    const count = imagesToUse.length;
    if (count === 0) return null;

    return (
      <div className="mb-5">
        {/* Mobile View: Single image with overlay */}
        <div className="sm:hidden rounded-xl overflow-hidden border border-gray-200 shadow-sm" onClick={handleJoinDiscussion}>
          <div className="relative">
            <img
              src={imagesToUse[0].url}
              alt="Attachment"
              className="w-full h-48 object-cover"
            />
            {count > 1 && ( 
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-xl font-bold">
                +{count - 1} more
              </div>
            )}
          </div>
        </div>

        {/* Desktop View: Grid layouts */}
        <div className="hidden sm:block" onClick={handleJoinDiscussion}>
          {count === 1 && (
            <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <img
                src={imagesToUse[0].url}
                alt="Single attachment"
                className="w-full h-auto max-h-96 object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
              />
            </div>
          )}
          {count === 2 && (
            <div className="grid grid-cols-2 gap-3">
              {imagesToUse.map((img, idx) => (
                <div key={idx} className="rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <img
                    src={img.url}
                    alt={`Attachment ${idx + 1}`}
                    className="w-full h-60 object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
                  />
                </div>
              ))}
            </div>
          )}
          {count >= 3 && (
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <img
                  src={imagesToUse[0].url}
                  alt="First image"
                  className="w-full h-60 object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
                />
              </div>
              <div className="relative rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow group cursor-pointer">
                <img
                  src={imagesToUse[1].url}
                  alt="Second image"
                  className="w-full h-60 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="text-2xl font-bold mb-1">+{count - 2}</div>
                    <div className="text-sm opacity-90">more photos</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };
  
  // The JSX structure of the component remains the same
  return (
    <div className="w-full max-w-2xl mx-auto">
        <article className="relative z-0 bg-white rounded-3xl overflow-hidden transition-all duration-300 sm:border sm:border-gray-200 sm:shadow-lg sm:hover:shadow-xl">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-red-500"></div>

          <div className="absolute top-6 right-6 z-10" ref={moreOptionsRef}>
             {/* ... More Options button and dropdown ... */}
             <button
              aria-label="More options"
              className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-all duration-200 hover:scale-110"
              type="button"
              onClick={() => setShowMoreOptions((prev) => !prev)}
            >
              <MoreVertical className="w-5 h-5" />
            </button>
            {showMoreOptions && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-2xl shadow-xl z-20 py-2 animate-in slide-in-from-top-2 duration-200">
                {isAuthor ? (
                  <>
                    <button onClick={handleEditPost} className="flex items-center gap-3 w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors rounded-lg mx-2">
                      <Edit className="w-4 h-4" />
                      <span className="font-medium">Edit Post</span>
                    </button>
                    <button onClick={handleDeletePost} className="flex items-center gap-3 w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 transition-colors rounded-lg mx-2">
                      <Trash2 className="w-4 h-4" />
                      <span className="font-medium">Delete Post</span>
                    </button>
                  </>
                ) : (
                  <button onClick={handleOpenReportModal} className="flex items-center gap-3 w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors rounded-lg mx-2">
                    <Flag className="w-4 h-4" />
                    <span className="font-medium">Report Post</span>
                  </button>
                )}
              </div>
            )}
          </div>
          
          <div className="p-6 sm:p-8">
            <header className="flex items-center gap-4 mb-6">
              {/* ... Header with GradientAvatar ... */}
              <GradientAvatar
                fullName={authorId?.fullName}
                imageUrl={authorId?.profileImage}
                size="w-14 h-14"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-gray-900 truncate text-lg">
                    {authorId?.fullName || 'Anonymous User'}
                  </h3>
                  <span className="text-gray-400">•</span>
                  <time className="text-gray-500 text-sm" dateTime={createdAt}>
                    {formattedDate}
                  </time>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Users className="w-4 h-4" />
                  <span className="text-sm font-medium">{community?.name || 'Public'}</span>
                </div>
              </div>
            </header>
            
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 leading-tight">
              {title?.trim() || 'This will be your post title'}
            </h1>
            
            <section className="mb-6 text-gray-700 leading-relaxed">
              {/* ... Content with Show more/less button ... */}
              <div
                ref={contentRef}
                className={clsx(
                  "whitespace-pre-wrap text-base transition-all duration-300",
                  !expanded && "line-clamp-3"
                )}
              >
                {renderContentWithTags(content?.trim() || 'This will be your post content', tags)}
              </div>
              {showToggle && (
                <button
                  onClick={() => setExpanded((prev) => !prev)}
                  className="mt-3 text-orange-500 font-semibold hover:text-orange-600 transition-colors flex items-center gap-1"
                  type="button"
                  aria-expanded={expanded}
                >
                  {expanded ? 'Show less' : 'Show more'}
                  <Eye className="w-4 h-4" />
                </button>
              )}
            </section>
            
            {renderImages()}
          </div>
          
          <footer className="bg-gray-50 border-t border-gray-200 p-6 rounded-b-3xl">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {/* ... Action Buttons (Like, Dislike, Share) ... */}
                <ActionButton
                  icon={ThumbsUp}
                  label="Like"
                  count={likesCount}
                  onClick={handleLike}
                  variant="like"
                  active={isLikedByCurrentUser}
                />
                <ActionButton
                  icon={ThumbsDown}
                  label="Dislike"
                  count={dislikesCount}
                  onClick={handleDislike}
                  variant="dislike"
                  active={isDislikedByCurrentUser}
                />
                <ActionButton
                  icon={Share2}
                  label="Share"
                  count={sharesCount}
                  variant="share"
                />
              </div>

              <div className="flex items-center gap-3">
                {/* ... Join Discussion button ... */}
                <ActionButton
                  icon={MessageSquare}
                  label="Join Discussion"
                  onClick={handleJoinDiscussion}
                  variant="primary"
                />
              </div>
            </div>
          </footer>
        </article>
        
        <ReportPostModal
          isOpen={isReportModalOpen}
          onClose={() => setIsReportModalOpen(false)}
          onSubmit={handleSubmitReport}
        />
    </div>
  );
}