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
import { formatDistanceToNow } from 'date-fns';

// Import the necessary hooks
import { useSocket } from '../../../context/SocketProvider';
import { useAuth } from '../../../context/AuthProvider';
import { useCastVote } from '../../../hooks/user/usePostTan'; // Make sure this path is correct

const getInitials = (name) => {
  if (!name) return 'U';
  const names = name.trim().split(' ');
  return names.map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

export default function PollPostCard({ post = {} }) {
  const { user: currentUser } = useAuth();
  const { onlineUsers } = useSocket();

  const {
    _id: postId,
    authorId = {},
    community,
    question,
    content,
    options: currentOptions = [],
    allowComments = true,
    pollEndsAt,
    notifyOnClose,
    createdAt,
    votedUsers: currentVotedUsers = [],
    allowMultipleSelections,
  } = post;

  const [hasVoted, setHasVoted] = useState(
    currentUser && currentVotedUsers.includes(currentUser.id)
  );

  const { mutate: castVote, isLoading: isVoting } = useCastVote();

  // Determine if the poll has ended
  const isPollClosed = pollEndsAt ? new Date(pollEndsAt) < new Date() : false;

  const handleVote = (optionIndex) => {
    if (!currentUser) {
      toast.error("You must be logged in to vote.");
      return;
    }
    if (hasVoted && !allowMultipleSelections) {
      toast("You have already voted on this poll.", { icon: 'ℹ️' });
      return;
    }

    castVote({ postId, optionIndex });
    // Optimistically update the local state to show results immediately
    setHasVoted(true);
  };

  const authorUserId = authorId?._id?.toString();
  const isAuthorOnline = authorUserId && onlineUsers?.includes(authorUserId) || false;

  const totalVotes = currentOptions.reduce((sum, o) => sum + (o.votes || 0), 0);

  const getPollDuration = () => {
    if (isPollClosed) return 'Closed';
    const ends = new Date(pollEndsAt);
    const now = new Date();
    const diffMs = ends - now;
    if (diffMs <= 0) return 'Closed';

    return formatDistanceToNow(ends, { addSuffix: true });
  };

  const formattedDate = createdAt
    ? formatDistanceToNow(new Date(createdAt), { addSuffix: true })
    : 'a few moments ago';

  // Use a ref or local state to track the user's specific vote for optimistic UI
  // This is a simple approach since the backend schema doesn't store this.
  // A more robust solution would involve a custom schema.
  // We'll just check if the user has voted and render the results, as planned.

  return (
    <article className="bg-white font-sans border border-gray-200 rounded-2xl w-full max-w-2xl mx-auto shadow-sm hover:shadow-lg relative overflow-hidden transition-all duration-300 transform hover:-translate-y-1 group">
      {/* Animated Top Border Gradient */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 transition-all duration-500">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      </div>

      {/* Header */}
      <header className="flex items-center gap-4 px-6 pt-6 pb-4 border-b border-gray-100">
        <div className="relative group/avatar">
          {authorId.profileImage ? (
            <img
              src={authorId.profileImage}
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

      {/* Poll Options - Conditional Rendering */}
      <div className="px-6 pb-5 space-y-3">
        {hasVoted || isPollClosed ? (
          // Show results if user has voted or poll is closed
          currentOptions.map((option, idx) => {
            const percentage = totalVotes === 0 ? 0 : (option.votes / totalVotes) * 100;
            const isUserVotedForThisOption = currentUser && currentVotedUsers.includes(currentUser.id) && option.votes === currentOptions[idx].votes; // Simple check, may not be 100% accurate without server-side vote tracking per option

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
                    isUserVotedForThisOption 
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
                    {isUserVotedForThisOption && (
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
          })
        ) : (
          // Show voting buttons if user hasn't voted and poll is open
          currentOptions.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleVote(idx)}
              className="w-full relative bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-gray-800 text-left cursor-pointer transition-all duration-300 hover:bg-gray-100 hover:shadow-md transform hover:scale-[1.02]"
              disabled={isVoting}
            >
              {isVoting ? 'Voting...' : option.label}
            </button>
          ))
        )}
      </div>

      {/* Poll Info */}
      <div className="flex justify-between items-center text-sm text-gray-500 px-6 pb-4">
        <div className="flex items-center gap-2 transition-colors duration-200 hover:text-gray-700">
          <Clock size={16} className="transition-transform duration-200 hover:rotate-12" />
          <span>{isPollClosed ? 'Closed' : `Closes ${getPollDuration()}`}</span>
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