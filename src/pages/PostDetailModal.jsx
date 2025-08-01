import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, MessageSquare, Heart, Share2, Bookmark, User, X } from 'lucide-react';
import { useFetchPostById } from '../hooks/user/usePostTan';
import { useComments } from '../hooks/user/useCommentTan';
import { useAuth } from '../context/AuthProvider'; // 👈 1. IMPORT useAuth
import { CommentThread } from '../components/public/comment/CommentThread';
import emptyStateImg from '../assets/empty_state.png';

const LoadingSpinner = () => (
  <div className="flex items-center justify-center py-20">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
  </div>
);

const NoCommentsIllustration = () => (
  <div className="px-6 text-center">
    <img
      src={emptyStateImg}
      alt="No comments illustration"
      className="mx-auto mb-4 h-42 w-42 object-contain"
      loading="lazy"
    />
    <h3 className="mb-2 text-xl font-semibold text-gray-800">No comments yet</h3>
    <p className="mx-auto max-w-md text-gray-500">Be the first to start the conversation.</p>
  </div>
);

const DiscussionPostCard = ({ post }) => (
  <div className="bg-white rounded-xl p-3">
    {/* ... your existing DiscussionPostCard content ... */}
    <div className="flex items-start gap-4">
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium text-sm">
        {post?.authorId?.fullName?.charAt(0) || 'U'}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2 flex-wrap text-xs text-gray-600">
          <span className="font-semibold text-gray-800 text-sm">{post?.authorId?.fullName || 'Unknown Author'}</span>
          <span>•</span>
          <span className="text-blue-600">{post?.community?.name || 'Unknown Community'}</span>
          <span>•</span>
          <time>{post?.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'Unknown Date'}</time>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">{post?.title || 'Untitled'}</h2>
        <p className="text-gray-700 text-sm leading-relaxed mb-3">{post?.content || 'No content available.'}</p>
        <div className="flex flex-wrap gap-2 mb-3">
          {(post?.tags || []).map((tag, index) => (
            <span key={index} className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
              #{tag}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-5 text-gray-500 text-sm flex-wrap">
          <button className="flex items-center gap-1 hover:text-red-500 transition-colors">
            <Heart className="w-4 h-4" />
            <span>{post?.likes?.length || 0}</span>
          </button>
          <button className="flex items-center gap-1 hover:text-blue-500 transition-colors">
            <MessageSquare className="w-4 h-4" />
            <span>Comments</span>
          </button>
          <button className="flex items-center gap-1 hover:text-green-500 transition-colors">
            <Share2 className="w-4 h-4" />
            <span>Share</span>
          </button>
          <button className="hover:text-yellow-500">
            <Bookmark className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default function PostDetailModal({ postId, onClose }) {
  const { user: currentUser } = useAuth(); // 👈 2. GET the current user
  const { data: post, isLoading: isPostLoading, isError } = useFetchPostById(postId);
  const { comments, isLoading: areCommentsLoading, createComment, toggleLike, deleteComment } = useComments(postId);

  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);

  const commentsContainerRef = useRef(null);

  const { topLevelComments, repliesByParentId } = useMemo(() => {
    const topLevel = [], repliesMap = {};
    comments.forEach(comment => {
      if (comment.parentId) {
        repliesMap[comment.parentId] = repliesMap[comment.parentId] || [];
        repliesMap[comment.parentId].push(comment);
      } else {
        topLevel.push(comment);
      }
    });
    for (const key in repliesMap) {
      repliesMap[key].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // DESCENDING
    }
    topLevel.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // DESCENDING
    return { topLevelComments: topLevel, repliesByParentId: repliesMap };
  }, [comments]);


  const handleCommentSubmit = async () => {
    if (!newComment.trim() || isSubmitting) return;
    setIsSubmitting(true);
    const parentId = replyingTo ? replyingTo._id : null;
    createComment(newComment.trim(), parentId); // No need to await if it's a socket emit
    setNewComment('');
    setReplyingTo(null);
    setIsSubmitting(false);
  };

  const handleSetReply = (comment) => {
    setReplyingTo(comment);
    document.getElementById('comment-textarea')?.focus();
  };

  const handleDelete = (commentId) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      deleteComment(commentId);
    }
  };

  useEffect(() => {
    const keyListener = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', keyListener);
    return () => window.removeEventListener('keydown', keyListener);
  }, [onClose]);

  // Scroll to TOP on new comment (since newest comments are on top)
  useEffect(() => {
    if (commentsContainerRef.current) {
      commentsContainerRef.current.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  }, [comments.length]);

  const nonDeletedTopLevelComments = topLevelComments.filter(c => !c.isDeleted);

  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-100 flex items-center justify-center bg-black/20"
        onClick={onClose}
      >
        <motion.div
          key="modal"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          className="relative w-full max-w-3xl bg-white rounded-xl shadow-xl flex flex-col max-h-[90vh]"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-500 cursor-pointer z-50 hover:text-gray-700 transition"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Header */}
          <div className="px-6 pt-5 pb-3 border-b border-gray-200 z-20 flex justify-center">
            <h2 className="text-xl font-bold text-gray-900 truncate">
              "{post?.authorId?.fullName || 'Loading...'}'s Post"
            </h2>
          </div>

          {/* Scrollable Content */}
          <div
            ref={commentsContainerRef}
            className="flex-1 overflow-y-auto px-4 sm:px-6 space-y-6 py-4"
          >
            {isPostLoading ? (
              <LoadingSpinner />
            ) : isError || !post ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-2">❌</div>
                <h2 className="text-xl font-bold text-gray-800">Post could not be loaded</h2>
                <p className="text-gray-600">Please try again later.</p>
              </div>
            ) : (
              <>
                <DiscussionPostCard post={post} />
                <div className="border-t border-t-gray-200 pt-4">
                  <h3 className="text-base font-semibold text-gray-900 mb-4">
                    Comments ({comments.filter(c => !c.isDeleted).length})
                  </h3>
                  <div className="space-y-6">
                    {areCommentsLoading ? (
                      <div className="text-center text-gray-500">Loading comments...</div>
                    ) : nonDeletedTopLevelComments.length > 0 ? (
                      <AnimatePresence initial={false}>
                        {nonDeletedTopLevelComments.map(comment => (
                          <motion.div
                            key={comment._id}
                            initial={{ opacity: 0, y: 10, height: 0 }}
                            animate={{ opacity: 1, y: 0, height: 'auto' }}
                            exit={{ opacity: 0, y: 10, height: 0 }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                            style={{ overflow: 'hidden' }}
                          >
                            <CommentThread
                              comment={comment}
                              allComments={comments}
                              repliesByParentId={repliesByParentId}
                              onLike={toggleLike}
                              onReply={handleSetReply}
                              onDelete={handleDelete}
                              currentUser={currentUser} // 👈 3. PASS the user down as a prop
                            />
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    ) : (
                      <NoCommentsIllustration />
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Comment Input */}
          <div className="border-t border-gray-200 bg-gray-50 px-4 sm:px-6 py-4">
            <div className="flex items-start gap-3">
              <div className="h-9 w-9 shrink-0 flex items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-blue-500 text-white">
                <User className="w-4 h-4" />
              </div>

              <div className="flex-1 relative">
                {replyingTo && (
                  <div className="mb-1 flex items-center justify-between rounded-md bg-blue-50 px-2 py-1 text-xs">
                    <span className="text-blue-700">Replying to @{replyingTo.author.fullName}</span>
                    <button onClick={() => setReplyingTo(null)} className="p-1 text-blue-700 hover:text-blue-900">
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <textarea
                    id="comment-textarea"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder={replyingTo ? 'Write a reply...' : 'Write a comment...'}
                    className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 resize-none h-10"
                    rows={1}
                    disabled={isSubmitting}
                  />
                  <button
                    onClick={handleCommentSubmit}
                    disabled={!newComment.trim() || isSubmitting}
                    className="p-3 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    aria-label={replyingTo ? 'Post reply' : 'Post comment'}
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}