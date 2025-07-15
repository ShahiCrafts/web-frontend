import React from 'react';
import { Heart, CornerDownRight, Reply, Trash2 } from 'lucide-react';
import { useAuth } from '../../../context/AuthProvider';

export const CommentItem = ({ comment, allComments, onLike, onReply, onDelete }) => {
  const { user } = useAuth();

  const userId = user?._id || user?.id;
  const isLikedByMe = comment.likes.includes(userId);
  const isAuthor = comment.authorId === userId || comment.authorId?._id === userId;

  const parentComment = comment.parentId
    ? allComments.find(c => c._id === comment.parentId)
    : null;

  // Return nothing if comment is deleted
  if (comment.isDeleted) return null;

  return (
    <div className="flex items-start gap-3 relative group">
      <div className="relative">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-sm font-medium text-white z-10">
          {comment.authorName?.charAt(0) || 'A'}
        </div>

        {parentComment && (
          <>
            <svg
              className="absolute -top-6 -left-6 w-10 h-10 text-gray-300 pointer-events-none"
              viewBox="0 0 40 40"
              fill="none"
            >
              <path
                d="M20 0 C20 20, 0 20, 0 40"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
              />
            </svg>
            <div className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-white text-gray-600 shadow">
              <Reply size={10} />
            </div>
          </>
        )}
      </div>

      <div className="flex-1">
        <div className="text-sm">
          {parentComment && !parentComment.isDeleted && (
            <div className="p-2 mb-2 text-xs text-gray-600 bg-gray-100 border border-gray-200 rounded-lg">
              <span className="font-semibold text-gray-800">
                Replying to @{parentComment.authorName}:
              </span>
              <p className="mt-1 italic truncate">"{parentComment.content}"</p>
            </div>
          )}

          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-800">{comment.authorName}</span>
            <time className="text-xs text-gray-400">
              {new Date(comment.createdAt).toLocaleString()}
            </time>
          </div>

          <p className="mt-1 text-gray-700">{comment.content}</p>

          <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
            <button
              onClick={() => onLike(comment._id)}
              aria-label="Like comment"
              role="button"
              className={`flex items-center gap-1.5 transition-colors ${
                isLikedByMe ? 'text-red-500' : 'hover:text-red-500'
              }`}
            >
              <Heart
                className="h-4 w-4"
                fill={isLikedByMe ? 'currentColor' : 'none'}
                stroke={isLikedByMe ? 'none' : 'currentColor'}
              />
              <span>{comment.likes.length}</span>
            </button>
            <button
              onClick={() => onReply(comment)}
              className="flex items-center gap-1.5 hover:text-blue-500"
            >
              <CornerDownRight className="h-3.5 w-3.5" />
              <span>Reply</span>
            </button>

            {isAuthor && (
              <button
                onClick={() => onDelete(comment._id)}
                className="flex items-center gap-1.5 text-red-500 hover:underline"
              >
                <Trash2 size={14} />
                <span>Delete</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
