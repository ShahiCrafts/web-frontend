import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../../context/AuthProvider';
import {
  useDeletePost,
  useReportPost,
  useLikePost,    // <--- IMPORT new like hook
  useDislikePost, // <--- IMPORT new dislike hook
} from '../../../hooks/user/usePostTan';
import clsx from 'clsx';
import { useSocket } from '../../../context/SocketProvider';

// Lucide React Icons
import {
  ThumbsUp,
  ThumbsDown,
  MessageSquare, // Used for 'Comments'
  MoreVertical, // For more options dropdown and 'show more/less'
  Edit,
  Trash2,
  Flag,
  MapPin, // For address/location
  Share2, // For 'Share' button
  AlertCircle, // For status 'ACTIVE'
  Bug, // For category 'Pothole' (example)
  Zap, // For priority 'Critical' / category 'Street Light'
  Clock, // For status 'UNDER_REVIEW' / priority 'Low'
  CheckSquare, // For status 'ACTION_TAKEN'
  XCircle, // For status 'REPORT_REJECTED'
  AlertTriangle, // For priority 'High'
  Target, // For priority 'Medium'
  Building, // For Responsible Department (alternative)
  Calendar, // For expectedResolutionTime
  User as UserIcon, // Alias to avoid conflict with `User` prop of CustomAvatar
  Paperclip, // For attachments
  MessageCircle as CommentIcon, // Alias for MessageSquare to avoid conflict
  ChevronDown, // New icon for 'show more'
  ChevronUp,   // New icon for 'show less'
  Eye, // For visibility icon
} from 'lucide-react';

// Custom Modals (ensure these paths are correct relative to where this component lives)
import ReportPostModal from './ReportPostModal';
import PostDetailModal from '../../../pages/PostDetailModal';


// --- Helper functions ---

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
          className="text-orange-500 font-semibold cursor-pointer hover:text-orange-600 transition-colors px-1 -mx-1 rounded hover:bg-orange-50" // Orange for tags
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

// Custom Avatar component (re-using your GradientAvatar logic)
const CustomAvatar = ({ fullName, imageUrl, size = 'w-11 h-11' }) => {
  if (imageUrl) {
    return (
      <div className={`${size} rounded-full overflow-hidden flex-shrink-0 ring-2 ring-white shadow-lg transition-transform hover:scale-105`}>
        <img src={getImageUrl(imageUrl)} alt={fullName} className="w-full h-full object-cover" />
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

// Custom Badge component
const CustomBadge = ({ children, className = '' }) => (
  <span className={clsx("inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border", className)}>
    {children}
  </span>
);

// Custom Button component (ActionButton style from the second provided code block)
const CustomActionButton = ({
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
    default: 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300',
    primary: 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 shadow-lg',
    like: active ? 'bg-green-50 border-green-500 text-green-600' : 'bg-white border border-gray-200 text-gray-700 hover:bg-green-50 hover:border-green-300 hover:text-green-600',
    dislike: active ? 'bg-red-50 border-red-500 text-red-600' : 'bg-white border border-gray-200 text-gray-700 hover:bg-red-50 hover:border-red-300 hover:text-red-600',
    share: 'bg-white border border-gray-200 text-gray-700 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600',
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
      {Icon && <Icon className="w-4 h-4 group-hover:scale-110 transition-transform" />}
      {count !== undefined && (
        <span className="font-bold">{count}</span>
      )}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
};


// --- CivicReportPostCard Component ---
export default function CivicReportPostCard({ post = {} }) {
  const [expanded, setExpanded] = useState(false);
  const [showToggle, setShowToggle] = useState(false);
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [showModal, setShowModal] = useState(false); // Used for PostDetailModal

  const contentRef = useRef(null);
  const moreOptionsRef = useRef(null);
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const deletePostMutation = useDeletePost();
  const reportPostMutation = useReportPost();
  // const updatePostMutation = useUpdatePost(); // <--- REMOVE this line
  const likePostMutation = useLikePost(); // <--- NEW: Initialize useLikePost hook
  const dislikePostMutation = useDislikePost(); // <--- NEW: Initialize useDislikePost hook


  const {
    _id,
    type,
    authorId,
    createdAt,
    communityId,
    title,
    content,
    tags = [],
    attachments = [],
    commentsCount = 0,
    sharesCount = 0,
    likes = [],
    dislikes = [],
    visibility = 'Public',

    // Report Issue specific fields from schema
    categoryId,
    priorityLevel = 'Medium',
    responsibleDepartment,
    address,
    expectedResolutionTime,
    labels = [], // Assuming this is for additional tags/labels
    status = 'ACTIVE',
  } = post;

  const currentLikesCount = likes.length;
  const currentDislikesCount = dislikes.length;

  const categoryName = typeof categoryId === 'object' && categoryId !== null ? categoryId.name : categoryId;

  const { onlineUsers } = useSocket();
  const authorUserId = authorId?._id?.toString() || authorId?.toString() || '';
  const isAuthorOnline = onlineUsers?.includes(authorUserId) || false;

  // Determine if current user is the author
  const isAuthor = currentUser?.id === authorUserId;

  const isLikedByCurrentUser = currentUser ? likes.includes(currentUser.id) : false;
  const isDislikedByCurrentUser = currentUser ? dislikes.includes(currentUser.id) : false;

  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleString(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short',
      })
    : 'a few moments ago';

  const checkOverflow = useCallback(() => {
    const element = contentRef.current;
    if (element) {
      const isClamped = element.scrollHeight > element.clientHeight;
      setShowToggle(isClamped);
    }
  }, []);

  useEffect(() => {
    let initialCheckTimer = setTimeout(checkOverflow, 100);
    let debounceTimer;
    const handleResize = () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(checkOverflow, 150);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(debounceTimer);
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
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const imagesToUse = attachments.length
    ? attachments.map((att) => ({
        url: typeof att === 'string' ? getImageUrl(att) : getImageUrl(att.url),
        type: 'image',
      }))
    : [];

  const handleOpenPostDetailModal = () => {
    setShowModal(true);
  };

  // --- UPDATED: Use useLikePost mutation ---
  const handleLike = () => {
    if (!currentUser) {
      toast.error('Please log in to like this post.');
      return;
    }
    likePostMutation.mutate(_id); // Call the new likePost mutation
  };

  // --- UPDATED: Use useDislikePost mutation ---
  const handleDislike = () => {
    if (!currentUser) {
      toast.error('Please log in to dislike this post.');
      return;
    }
    dislikePostMutation.mutate(_id); // Call the new dislikePost mutation
  };

  const handleDeletePost = () => {
    if (window.confirm('Are you sure you want to delete this report?')) {
      deletePostMutation.mutate(_id, {
        onSuccess: () => {
          toast.success('Report deleted successfully!');
          setShowMoreOptions(false);
        },
        onError: (err) => {
          const errorMsg = err.response?.data?.message || 'Failed to delete report.';
          toast.error(errorMsg);
        },
      });
    }
  };

  const handleOpenReportModal = () => {
    setShowMoreOptions(false);
    setIsReportModalOpen(true);
  };

  const handleSubmitReport = async (reportType, reason) => {
    reportPostMutation.mutate({ id: _id, reason, type: reportType }, {
      onSuccess: () => {
        toast.success('Report flagged for review!');
        setIsReportModalOpen(false);
      },
      onError: (err) => {
        const errorMsg = err.response?.data?.message || 'Failed to flag report.';
        toast.error(errorMsg);
        setIsReportModalOpen(false);
      },
    });
  };

  const handleEditPost = () => {
    toast.info('Edit functionality not yet implemented for civic reports.');
    setShowMoreOptions(false);
  };

  // --- Custom helper functions for colors and badges ---

  const getPriorityColorClass = (priority) => {
    switch (priority) {
      case "Critical": return "bg-red-500";
      case "High": return "bg-orange-500";
      case "Medium": return "bg-yellow-500";
      case "Low": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  const getPriorityBadgeClass = (priority) => {
    switch (priority) {
      case "Critical": return "bg-red-100 text-red-800 border-red-200";
      case "High": return "bg-orange-100 text-orange-800 border-orange-200";
      case "Medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Low": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "ACTIVE": return "bg-blue-100 text-blue-800 border-blue-200";
      case "UNDER_REVIEW": return "bg-purple-100 text-purple-800 border-purple-200";
      case "ACTION_TAKEN": return "bg-orange-100 text-orange-800 border-orange-200";
      case "RESOLVED": return "bg-green-100 text-green-800 border-green-200";
      case "REPORT_REJECTED": return "bg-red-100 text-red-800 border-red-200";
      case "DELETED": return "bg-gray-200 text-gray-700 border-gray-300";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getCategoryBadgeClass = (categoryName) => {
    return "bg-white text-gray-700 border-gray-300";
  }

  // Custom Image rendering (using standard <img>)
  const renderImages = () => {
    const count = imagesToUse.length;
    if (count === 0) return null;

    return (
      <div className="mb-5 border-t border-b border-gray-200 py-4 mt-6">
        {/* Mobile View (sm and below) - Single image with overlay count */}
        <div className="sm:hidden rounded-lg overflow-hidden shadow-sm">
          <div className="relative">
            <img
              src={imagesToUse[0].url || "/placeholder.svg"}
              alt="Issue evidence"
              className="w-full h-24 object-cover" // Further reduced height for mobile
            />
            {count > 1 && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-xl font-bold">
                +{count - 1} more photos
              </div>
            )}
          </div>
        </div>

        {/* Tablet/Desktop View (sm and above) - Grid layouts */}
        <div className="hidden sm:block">
          {count === 1 && (
            <div className="rounded-lg overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <img
                src={imagesToUse[0].url || "/placeholder.svg"}
                alt="Single attachment"
                className="w-full h-24 object-cover hover:scale-105 transition-transform duration-300" // Further reduced height
              />
            </div>
          )}

          {count === 2 && (
            <div className="grid grid-cols-2 gap-4">
              {imagesToUse.map((attachment, idx) => (
                <div key={idx} className="rounded-lg overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <img
                    src={attachment.url || "/placeholder.svg"}
                    alt={`Issue evidence ${idx + 1}`}
                    className="w-full h-24 object-cover hover:scale-105 transition-transform duration-300" // Further reduced height
                  />
                </div>
              ))}
            </div>
          )}

          {count >= 3 && (
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <img
                  src={imagesToUse[0].url || "/placeholder.svg"}
                  alt="First image"
                  className="w-full h-24 object-cover hover:scale-105 transition-transform duration-300" // Further reduced height
                />
              </div>
              <div className="relative rounded-lg overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow group cursor-pointer">
                <img
                  src={imagesToUse[1].url || "/placeholder.svg"}
                  alt="Additional issue evidence"
                  className="w-full h-24 object-cover group-hover:scale-105 transition-transform duration-300" // Further reduced height
                />
                <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="text-2xl font-bold mb-1">+{imagesToUse.length - 2}</div>
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


  // Only render if the post type is "Report Issue"
  if (type !== "Report Issue") {
    return null;
  }

  return (
    <div className="w-full max-w-2xl mx-auto font-sans bg-white shadow-sm hover:shadow-md transition-shadow duration-200 relative overflow-hidden rounded-xl border border-gray-200">
      {/* Gradient Stroke on Top */}
      <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600`}></div>

      {/* Main Content Area */}
      <div className="p-4 sm:p-6 ">
        {/* Profile Header (Avatar, Name, Date, Visibility) and More Options */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <CustomAvatar
              fullName={authorId?.fullName}
              imageUrl={authorId?.profileImage}
              size="h-10 w-10"
            />
            <div className="flex flex-col">
              <p className="text-sm font-medium text-gray-900">{authorId?.fullName || 'Anonymous Citizen'}</p>
              <div className="flex items-center gap-2">
                <p className="text-xs text-gray-500">Reported {formattedDate}</p>
                {visibility && visibility !== 'Admin' && (
                  <CustomBadge className="bg-gray-100 text-gray-700 border-gray-200 px-2 py-1">
                    <Eye className="h-3 w-3 mr-1" />
                    {visibility}
                  </CustomBadge>
                )}
              </div>
            </div>
          </div>
          {/* More Options Dropdown */}
          <div className="relative" ref={moreOptionsRef}>
            <button
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-all duration-200"
              onClick={() => setShowMoreOptions(!showMoreOptions)}
              aria-label="More options"
            >
              <MoreVertical className="h-5 w-5" />
            </button>
            {showMoreOptions && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-xl z-20 py-2 animate-in slide-in-from-top-2 duration-200">
                {isAuthor ? (
                  <>
                    <button onClick={handleEditPost} className="flex items-center gap-3 w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors rounded-md">
                      <Edit className="h-4 w-4" /> Edit Report
                    </button>
                    <button onClick={handleDeletePost} className="flex items-center gap-3 w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors rounded-md">
                      <Trash2 className="h-4 w-4" /> Delete Report
                    </button>
                  </>
                ) : (
                  <button onClick={handleOpenReportModal} className="flex items-center gap-3 w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors rounded-md">
                    <Flag className="h-4 w-4" /> Flag Report
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Issue Title */}
        <h3 className="font-bold text-xl sm:text-2xl leading-tight text-gray-900 mb-3">{title?.trim() || 'Report Title / Issue Summary'}</h3>

        {/* Badges (Category, Priority, Status) */}
        <div className="flex flex-wrap gap-2 mb-4">
          <CustomBadge className={getCategoryBadgeClass(categoryName)}>
            {categoryName || 'General Issue'}
          </CustomBadge>
          <CustomBadge className={getPriorityBadgeClass(priorityLevel)}>
            {priorityLevel} Priority
          </CustomBadge>
          <CustomBadge className={getStatusBadgeClass(status)}>
            Status: {status.replace(/_/g, " ")}
          </CustomBadge>
        </div>

        {/* Description Section */}
        <section className="mb-5 text-gray-800 leading-relaxed">
          <p
            ref={contentRef}
            className="whitespace-pre-wrap text-base"
            style={{
              display: '-webkit-box',
              WebkitLineClamp: expanded ? 'unset' : 4,
              WebkitBoxOrient: 'vertical',
              overflow: expanded ? 'visible' : 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {renderContentWithTags(content?.trim() || 'Detailed description of the civic issue...', tags)}
          </p>
          {showToggle && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="mt-3 text-blue-600 font-semibold hover:text-blue-700 transition-colors flex items-center gap-1"
              type="button"
              aria-expanded={expanded}
            >
              {expanded ? 'Show less' : 'Show more'}
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          )}
        </section>

        {/* Detailed Information (Department, Expected Resolution) - First Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3 text-sm text-gray-700">
          {responsibleDepartment && (
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4 text-gray-500" />
              <span className="font-medium">Department:</span> {responsibleDepartment}
            </div>
          )}
          {expectedResolutionTime && (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="font-medium">Est. Resolution:</span> {expectedResolutionTime}
            </div>
          )}
        </div>

        {/* Location - Second Row */}
        {address && (
          <div className="flex items-center gap-2 mb-5 text-sm text-gray-700">
            <MapPin className="h-4 w-4 text-gray-500" />
            <span className="font-medium">Location:</span> {address}
          </div>
        )}

        {/* Tags */}
        {labels.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-5">
            <span className="text-gray-500 text-sm">Tags:</span>
            {labels.map((label, index) => (
              <CustomBadge key={index} className="bg-gray-100 text-gray-700 border-gray-200">
                #{label}
              </CustomBadge>
            ))}
          </div>
        )}

        {/* Attachments */}
        {imagesToUse && imagesToUse.length > 0 && (
          <div className="mb-5 border-t border-b border-gray-200 py-4">
            <div className="flex items-center gap-2 mb-3">
              <Paperclip className="h-4 w-4 text-gray-500" />
              <span className="font-medium text-gray-700">Attachments:</span>
            </div>
            {imagesToUse.length === 1 && (
              <div className="rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                <img
                  src={imagesToUse[0].url || "/placeholder.svg"}
                  alt="Issue evidence"
                  className="w-full h-24 object-cover"
                />
              </div>
            )}
            {imagesToUse.length === 2 && (
              <div className="grid grid-cols-2 gap-4">
                {imagesToUse.map((attachment, idx) => (
                  <div key={idx} className="rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                    <img
                      src={attachment.url || "/placeholder.svg"}
                      alt={`Issue evidence ${idx + 1}`}
                      className="w-full h-24 object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
            {imagesToUse.length >= 3 && (
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                  <img
                    src={imagesToUse[0].url || "/placeholder.svg"}
                    alt="First image"
                    className="w-full h-24 object-cover"
                  />
                </div>
                <div className="relative rounded-lg overflow-hidden border border-gray-200 shadow-sm group cursor-pointer">
                  <img
                    src={imagesToUse[1].url || "/placeholder.svg"}
                    alt="Additional issue evidence"
                    className="w-full h-24 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                    <div className="text-white text-center">
                      <div className="text-2xl font-bold mb-1">+{imagesToUse.length - 2}</div>
                      <div className="text-sm opacity-90">more photos</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer with Action Buttons */}
      <footer className="bg-gray-50 border-t border-gray-200 p-6 rounded-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Left side: Like, Dislike, Comments */}
          <div className="flex items-center gap-3">
            <CustomActionButton
              icon={ThumbsUp}
              label="Like"
              count={currentLikesCount}
              onClick={handleLike}
              variant="like"
              active={isLikedByCurrentUser}
            />
            <CustomActionButton
              icon={ThumbsDown}
              label="Dislike"
              count={currentDislikesCount}
              onClick={handleDislike}
              variant="dislike"
              active={isDislikedByCurrentUser}
            />
            <CustomActionButton
              icon={MessageSquare}
              label="Comments"
              count={commentsCount}
              variant="like"
              onClick={handleOpenPostDetailModal}
            />
          </div>

          {/* Right side: Share */}
          <div className="flex items-center gap-3">
            <CustomActionButton
              icon={Share2}
              label="Share"
              count={sharesCount}
              variant="primary"
              className="sm:flex"
            />
          </div>
        </div>
      </footer>

      {/* Modals */}
      {showModal && <PostDetailModal postId={_id} onClose={() => setShowModal(false)} />}
      <ReportPostModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSubmit={handleSubmitReport}
      />
    </div>
  );
}