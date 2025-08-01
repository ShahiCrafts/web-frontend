import React, { useRef, useCallback, useEffect } from "react";
import { usePopularFetchPosts, useLikePost, useDislikePost, useCastVote } from "../hooks/user/usePostTan";
import { Heart, ThumbsDown, TrendingUp, Users, MessageCircle, BarChart3, Clock, Paperclip } from "lucide-react";
import { formatDistanceToNowStrict, parseISO } from "date-fns";

// Spinner
const Spinner = () => (
  <div className="w-full flex justify-center items-center py-8">
    <div className="relative">
      <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      <div className="absolute inset-0 w-8 h-8 border-2 border-orange-200 rounded-full animate-pulse" />
    </div>
  </div>
);

// Intersection Observer hook for infinite scroll
const useObserver = (ref, callback) => {
  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(([entry]) => callback(entry), {
      threshold: 1.0,
    });
    observer.observe(ref.current);
    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, [ref, callback]);
};

// PostCard showing full data
const PostCard = ({ post, onLike, onDislike, onVote }) => {
  const isPoll = post.type === "Poll";
  const totalVotes = isPoll ? post.options?.reduce((sum, option) => sum + (option.votes?.length || 0), 0) : 0;

  // Format createdAt to relative time (e.g. "2 hours ago")
  let timeAgo = "Unknown time";
  try {
    timeAgo = formatDistanceToNowStrict(parseISO(post.createdAt), { addSuffix: true });
  } catch {}

  // Author info
  const authorName = post.authorId?.fullName || post.author || "Anonymous";
  const authorInitial = authorName.charAt(0).toUpperCase();

  return (
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-lg border border-gray-100 hover:border-gray-200 transition-all duration-300 overflow-hidden mb-6">
      {/* Header */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
              {authorInitial}
            </div>
            <div>
              <p className="font-medium text-gray-900 text-sm">{authorName}</p>
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <Users className="w-3 h-3" />
                <span>{post.communityId?.name || post.community || "General"}</span>
                <Clock className="w-3 h-3 ml-2" />
                <span>{timeAgo}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {isPoll && (
              <div className="flex items-center space-x-1 text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full">
                <BarChart3 className="w-3 h-3" />
                <span>Poll</span>
              </div>
            )}
            <div className="flex items-center space-x-1 text-xs bg-orange-50 text-orange-600 px-2 py-1 rounded-full">
              <TrendingUp className="w-3 h-3" />
              <span>Popular</span>
            </div>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-gray-900 mb-3 leading-tight group-hover:text-gray-700 transition-colors">
          {post.title}
        </h2>

        {/* Content */}
        <p className="text-gray-600 leading-relaxed mb-4 whitespace-pre-wrap">{post.content}</p>

        {/* Attachments indicator */}
        {post.attachments && post.attachments.length > 0 && (
          <div className="flex items-center space-x-1 mb-4 text-gray-500 text-sm">
            <Paperclip className="w-4 h-4" />
            <span>{post.attachments.length} attachment{post.attachments.length > 1 ? "s" : ""}</span>
          </div>
        )}

        {/* Poll Options */}
        {isPoll && post.options && (
          <div className="mb-6 space-y-3">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-800">Poll Options</h4>
              <span className="text-sm text-gray-500">{totalVotes} total vote{totalVotes !== 1 ? "s" : ""}</span>
            </div>
            {post.options.map((option) => {
              const voteCount = option.votes?.length || 0;
              const percentage = totalVotes > 0 ? (voteCount / totalVotes) * 100 : 0;

              return (
                <button
                  key={option.label}
                  onClick={() => onVote(option.label)}
                  className="relative w-full text-left p-4 bg-gray-50 hover:bg-orange-50 rounded-xl border border-gray-100 hover:border-orange-200 transition-all duration-200 group/option"
                >
                  <div className="flex items-center justify-between relative z-10">
                    <span className="font-medium text-gray-800 group-hover/option:text-orange-700">
                      {option.label}
                    </span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-semibold text-gray-600">{voteCount}</span>
                      <span className="text-xs text-gray-500">({percentage.toFixed(1)}%)</span>
                    </div>
                  </div>
                  <div
                    className="absolute left-0 top-0 h-full bg-gradient-to-r from-orange-100 to-orange-50 rounded-xl transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </button>
              );
            })}
          </div>
        )}

        {/* Engagement Stats */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-50">
          <div className="flex items-center space-x-6">
            <button
              onClick={onLike}
              className="flex items-center space-x-2 text-sm text-gray-600 hover:text-red-500 transition-colors group/like"
              aria-label="Like post"
            >
              <Heart className="w-4 h-4 group-hover/like:fill-current" />
              <span className="font-medium">{post.likes?.length || 0}</span>
            </button>

            <button
              onClick={onDislike}
              className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
              aria-label="Dislike post"
            >
              <ThumbsDown className="w-4 h-4" />
              <span className="font-medium">{post.dislikes?.length || 0}</span>
            </button>

            <div
              className="flex items-center space-x-2 text-sm text-gray-600 hover:text-blue-500 transition-colors cursor-pointer"
              aria-label="Discuss post"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="font-medium">Discuss</span>
            </div>
          </div>

          <button className="text-sm text-orange-600 hover:text-orange-700 font-medium transition-colors">
            Read more →
          </button>
        </div>
      </div>
    </div>
  );
};

// PopularPage component
const PopularPage = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = usePopularFetchPosts();

  const { mutate: likePost } = useLikePost();
  const { mutate: dislikePost } = useDislikePost();
  const { mutate: castVote } = useCastVote();

  const loadMoreRef = useRef();

  const onIntersect = useCallback(
    (entry) => {
      if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage]
  );

  useObserver(loadMoreRef, onIntersect);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="flex flex-col items-center justify-center space-y-4">
            <Spinner />
            <p className="text-gray-600 font-medium">Loading popular posts...</p>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">😕</span>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Oops! Something went wrong</h3>
              <p className="text-red-500">{error?.message || "Failed to load popular posts"}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-white rounded-full px-6 py-3 shadow-sm border border-gray-200 mb-4">
            <TrendingUp className="w-5 h-5 text-orange-500" />
            <span className="font-semibold text-gray-700">Trending Now</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">🔥 Popular Posts</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Discover the most engaging content from our community
          </p>
        </div>

        {/* Posts */}
      {/* Posts */}
<div className="grid grid-cols-1 sm:grid-cols-2  gap-6">
  {data?.pages?.map((page, index) => (
    <React.Fragment key={index}>
      {page?.posts?.map((post) => (
        <div key={post._id} className="animate-fade-in">
          <PostCard
            post={post}
            onLike={() => likePost(post._id)}
            onDislike={() => dislikePost(post._id)}
            onVote={(label) => castVote({ pollId: post._id, optionLabel: label })}
          />
        </div>
      ))}
    </React.Fragment>
  ))}
</div>


        {/* Load More Trigger */}
        <div ref={loadMoreRef} className="flex items-center justify-center py-8">
          {isFetchingNextPage && <Spinner />}
          {!hasNextPage && data?.pages?.length > 0 && (
            <div className="text-center">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🎉</span>
              </div>
              <p className="text-gray-500 font-medium">You've reached the end!</p>
              <p className="text-sm text-gray-400">That's all the popular posts for now</p>
            </div>
          )}
        </div>

        {/* Empty State */}
        {data?.pages?.length === 0 && !isLoading && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">📝</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No posts yet</h3>
            <p className="text-gray-600">Be the first to share something amazing!</p>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default PopularPage;
