import React, { useState, useEffect, useContext, useCallback } from 'react';
import {
  Heart,
  MessageSquare,
  Upload,
  UserPlus,
  Shield,
  Clock,
  Check,
} from 'lucide-react';
import toast from 'react-hot-toast';

// Removed direct import of castVoteService here
// import { castVoteService } from '../../../services/user/postService';

// Import useSocket for onlineUsers, and useAuth for currentUser
import { useSocket } from '../../../context/SocketProvider';
import { useAuth } from '../../../context/AuthProvider';

// Import the useCastVote hook from your TanStack Query hooks
import { useCastVote } from '../../../hooks/user/usePostTan';


const getInitials = (name) => {
  if (!name) return 'U';
  const names = name.trim().split(' ');
  return names.map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

export default function PollPostCard({ post = {} }) {
  const { user: currentUser } = useAuth();
  const { socket, onlineUsers } = useSocket(); // Get onlineUsers from useSocket

  // Initialize the castVote mutation hook
  const castVoteMutation = useCastVote();

  const {
    _id: postId,
    authorId = {}, // This will be the populated author object from backend
    community,
    question,
    content,
    // options and votedUsers will now come directly from the `post` prop
    // as it's updated by TanStack Query
    options: currentOptions = [], // Renamed to avoid conflict with local state for now
    allowComments = true,
    pollEndsAt,
    notifyOnClose,
    createdAt,
    votedUsers: currentVotedUsers = [], // Renamed for clarity
  } = post;

  const [selectedOptionLabel, setSelectedOptionLabel] = useState(null);
  const [isVoting, setIsVoting] = useState(false); 
  
  const options = currentOptions;
  const hasVoted = currentUser && currentVotedUsers.includes(currentUser.id);

  const authorUserId = authorId?._id?.toString();
  const isAuthorOnline = authorUserId && onlineUsers?.includes(authorUserId) || false;

  const totalVotes = options.reduce((sum, o) => sum + (o.votes || 0), 0);

  const handleVote = async () => {
    if (!currentUser) {
      toast.error("Please log in to cast your vote.");
      return;
    }
    if (!selectedOptionLabel) {
      toast.error("Please select an option to vote.");
      return;
    }
    // These checks are for immediate UX feedback. Backend will perform definitive validation.
    if (hasVoted) {
      toast.error("You have already voted in this poll.");
      return;
    }
    if (getPollDuration() === 'Closed') {
      toast.error("This poll is closed and cannot receive more votes.");
      return;
    }
    if (isVoting) { // Prevent double clicks
      return;
    }

    setIsVoting(true);

    try {
      // Call the TanStack Query mutation
      await castVoteMutation.mutateAsync({ pollId: postId, optionLabel: selectedOptionLabel });

      toast.success('Vote cast successfully!');
      // IMPORTANT: No manual `setOptions` or `setHasVoted` here.
      // TanStack Query's `onSuccess` and Socket.IO handler will update the cache,
      // which in turn updates the `post` prop, causing a re-render.

    } catch (error) {
      console.error('Error casting vote:', error);
      // `error.message` comes from the service layer's error handling
      toast.error(error.message || 'Failed to cast vote. Please try again.');
    } finally {
      setIsVoting(false);
      setSelectedOptionLabel(null); // Clear selected option after the attempt
    }
  };

  const getPollDuration = () => {
    if (!pollEndsAt) return 'N/A';
    const ends = new Date(pollEndsAt);
    const now = new Date();
    const diffMs = ends - now;
    if (diffMs <= 0) return 'Closed';

    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    let durationString = '';
    if (days > 0) durationString += `${days}d `;
    if (hours > 0) durationString += `${hours}h `;
    if (minutes > 0) durationString += `${minutes}m`;

    return durationString.trim() || '<1m';
  };

  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleString(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short',
      })
    : 'a few moments ago';

  return (
    <article className="bg-white font-sans border border-gray-200 rounded-2xl w-full max-w-2xl mx-auto shadow-sm hover:shadow-lg relative overflow-hidden transition-all duration-300 transform hover:-translate-y-1 group">
      {/* Animated Top Border Gradient */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 transition-all duration-500">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      </div>

      {/* Header */}
      <header className="flex items-center gap-4 px-6 pt-6 pb-4 border-b border-gray-100">
        <div className="relative group/avatar">
          {authorId.avatar ? (
            <img
              src={authorId.avatar}
              alt={authorId.fullName || 'User Avatar'}
              className="w-10 h-10 rounded-full object-cover border border-gray-200 transition-all duration-300 group-hover/avatar:scale-110 group-hover/avatar:shadow-md"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-red-500 text-white flex items-center justify-center font-bold text-sm transition-all duration-300 group-hover/avatar:scale-110 group-hover/avatar:shadow-md">
              {getInitials(authorId.fullName)}
            </div>
          )}
          {/* Online indicator */}
          {isAuthorOnline && (
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full animate-pulse" />
          )}
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
            <span className="transition-colors duration-200 hover:text-orange-600">
              {authorId.fullName || 'Anonymous User'}
            </span>
            <span className="px-2 py-0.5 bg-gradient-to-r from-orange-100 to-red-100 text-orange-700 text-xs font-medium rounded-full transition-all duration-200 hover:from-orange-200 hover:to-red-200">
              {community?.name || 'Public'}
            </span>
          </div>
          <div className="flex items-center gap-2 text-gray-500 text-xs mt-1">
            <Clock className="w-3 h-3 transition-transform duration-200 group-hover:rotate-12" />
            <time className="transition-colors duration-200 hover:text-gray-700">{formattedDate}</time>
          </div>
        </div>

        {notifyOnClose && (
          <span className="text-xs flex items-center gap-1 bg-gray-100 text-gray-600 font-medium px-2 py-1 rounded-full transition-all duration-200 hover:bg-gray-200">
            <Shield size={14} className="transition-transform duration-200 hover:scale-110" />
            Anonymous
          </span>
        )}
      </header>

      {/* Body */}
      <div className="px-6 pt-5 pb-2">
        <h2 className="text-xl font-bold text-gray-900 mb-2 transition-colors duration-200 hover:text-gray-700">
          {question}
        </h2>
        {content && (
          <p className="text-sm text-gray-600 mb-4 transition-colors duration-200 hover:text-gray-700">
            {content}
          </p>
        )}
      </div>

      {/* Poll Options */}
      <div className="px-6 pb-5 space-y-3">
        {options.map((option, idx) => {
          const percentage = option.percentage !== undefined
            ? option.percentage
            : (totalVotes === 0 ? 0 : Math.round((option.votes || 0) / totalVotes * 100));

          const isSelected = selectedOptionLabel === option.label;

          // Display results if hasVoted or poll is closed
          if (hasVoted || getPollDuration() === 'Closed') {
            return (
              <div
                key={idx}
                className="relative bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl overflow-hidden transform transition-all duration-300 hover:scale-[1.02] hover:shadow-md"
                style={{
                  animation: `slideIn 0.6s ease-out ${idx * 0.1}s both`
                }}
              >
                <div
                  className={`absolute top-0 left-0 h-full transition-all duration-1000 ease-out ${
                    isSelected
                       ? 'bg-gradient-to-r from-orange-300 to-red-300'
                       : 'bg-gradient-to-r from-gray-300 to-gray-400'
                  }`}
                  style={{
                     width: `${percentage}%`,
                    animation: `expandWidth 1s ease-out 0.3s both`
                  }}
                />
                <div className="relative z-10 flex justify-between items-center px-4 py-3 text-sm font-medium text-gray-800">
                  <span className="flex items-center gap-2">
                    {option.label}
                    {isSelected && (
                      <Check
                        className="text-[#ff5c00] animate-bounce"
                        size={16}
                        style={{
                          animation: 'checkmark 0.6s ease-out 0.8s both'
                        }}
                      />
                    )}
                  </span>
                  <span className="font-semibold text-gray-700 transition-all duration-300">
                    {percentage.toFixed(2)}%
                  </span>
                </div>
              </div>
            );
          }
          // Display interactive options if not voted and poll is open
          return (
            <label
              key={idx}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer border-2 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-md ${
                isSelected
                  ? 'bg-gradient-to-r from-orange-50 to-red-50 border-[#ff5c00] shadow-lg shadow-orange-100'
                  : 'bg-white border-gray-200 hover:border-gray-400 hover:bg-gray-50'
              }`}
              style={{
                animation: `fadeInUp 0.4s ease-out ${idx * 0.1}s both`
              }}
            >
              <input
                type="radio"
                name="poll-option"
                value={option.label}
                checked={isSelected}
                onChange={() => setSelectedOptionLabel(option.label)}
                className="w-4 h-4 accent-[#ff5c00] transition-transform duration-200 hover:scale-110"
              />
              <span className="text-gray-800 font-medium transition-colors duration-200">
                {option.label}
              </span>
            </label>
          );
        })}
      </div>

      {/* Poll Info */}
      <div className="flex justify-between items-center text-sm text-gray-500 px-6 pb-4">
        <div className="flex items-center gap-2 transition-colors duration-200 hover:text-gray-700">
          <Clock size={16} className="transition-transform duration-200 hover:rotate-12" />
          <span>Closes in {getPollDuration()}</span>
        </div>
        <span className="transition-colors duration-200 hover:text-gray-700">
          {totalVotes} votes
        </span>
      </div>

      {/* Footer */}
      <footer className="px-6 py-4 border-t border-gray-100 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm backdrop-blur-sm">
        <button className="flex items-center gap-2 text-gray-600 hover:text-rose-500 transition-all duration-200 transform hover:scale-105">
          <Heart className="w-5 h-5 transition-transform duration-200 hover:scale-110" />
          Support
        </button>
        {allowComments && (
          <button className="flex items-center gap-2 text-gray-600 hover:text-blue-500 transition-all duration-200 transform hover:scale-105">
            <MessageSquare className="w-5 h-5 transition-transform duration-200 hover:scale-110" />
            Comment
          </button>
        )}
        <div className="flex-grow hidden sm:block" />
        <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-all duration-200 transform hover:scale-105">
          <Upload className="w-5 h-5 transition-transform duration-200 hover:scale-110 hover:rotate-12" />
          Share
        </button>
        <button
          onClick={handleVote}
          disabled={!currentUser || !selectedOptionLabel || hasVoted || isVoting || getPollDuration() === 'Closed'}
          className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm transition-all duration-300 transform hover:scale-105 ${
            !currentUser || !selectedOptionLabel || hasVoted || isVoting || getPollDuration() === 'Closed'
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 shadow-lg hover:shadow-xl'
          }`}
        >
          <UserPlus
            className={`w-4 h-4 transition-transform duration-200 ${
              isVoting ? 'animate-spin' : 'hover:scale-110'
            }`}
          />
          {getPollDuration() === 'Closed' ? 'Poll Closed' : (isVoting ? 'Casting...' : 'Cast Vote')}
        </button>
      </footer>

      {/* Tailwind CSS keyframe animations */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateX(-20px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          @keyframes expandWidth {
            from {
              width: 0%;
            }
          }
          @keyframes checkmark {
            from {
              opacity: 0;
              transform: scale(0) rotate(180deg);
            }
            to {
              opacity: 1;
              transform: scale(1) rotate(0deg);
            }
          }
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `
      }} />
    </article>
  );
}