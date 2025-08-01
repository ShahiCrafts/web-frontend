import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { useEffect, useCallback } from "react";
import { useSocket } from "../../context/SocketProvider";

import {
  fetchPostsService,
  getPostService,
  createPostService,
  updatePostService,
  deletePostService,
  reportPostService,
  castVoteService,
  likePostService,    // <--- Import new service
  dislikePostService,
  fetchAllPopularPostsService, // <--- Import new service
  toggleEventInterestService,
  toggleEventRSVPService
} from "../../services/user/postService";

export const useInfiniteFetchPosts = (params) => {
  return useInfiniteQuery({
    queryKey: ["posts", params],
    queryFn: ({ pageParam = 1 }) =>
      fetchPostsService({ ...params, page: pageParam }),

    getNextPageParam: (lastPage) => {
      if (!lastPage?.pagination) return undefined;

      const { currentPage, totalPages } = lastPage.pagination;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5,
  });
};


export const usePopularFetchPosts = () => {
  return useInfiniteQuery({
    queryKey: ['popular_posts'],
    queryFn: fetchAllPopularPostsService,
    getNextPageParam: (lastPage, pages) => {
      const { currentPage, totalPages } = lastPage.pagination;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    staleTime: 1000 * 60 * 5,
    keepPreviousData: true,
  });
};


export const useFetchPostById = (id) => {
  return useQuery({
    queryKey: ["posts", id],
    queryFn: () => getPostService(id),
    enabled: !!id,
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  const { socket } = useSocket();

  const handleNewPost = useCallback((newPost) => {
    // Always update individual post cache, regardless of query type
    queryClient.setQueryData(["posts", newPost._id], newPost);

    // Update infinite query data across all matching ["posts"] queries
    queryClient.setQueriesData(["posts"], (oldData) => {
      if (oldData && Array.isArray(oldData.pages)) {
        const currentPages = oldData.pages;
        const firstPage = currentPages[0];

        if (firstPage && Array.isArray(firstPage.posts)) {
          // If the new post is already in the first page (e.g., from optimistic update), update it
          if (firstPage.posts.some(post => post._id === newPost._id)) {
            return {
              ...oldData,
              pages: currentPages.map((page, idx) =>
                idx === 0 ? { ...page, posts: page.posts.map(p => p._id === newPost._id ? newPost : p) } : page
              ),
            };
          } else {
            // Add new post to the beginning of the first page
            return {
              ...oldData,
              pages: [
                {
                  ...firstPage,
                  posts: [newPost, ...firstPage.posts],
                  pagination: {
                    ...firstPage.pagination,
                    totalPosts: (firstPage.pagination?.totalPosts || 0) + 1,
                  },
                },
                ...currentPages.slice(1),
              ],
            };
          }
        } else {
          // If infinite query exists but has no pages/posts data, initialize it
          return {
            ...oldData,
            pages: [{ posts: [newPost], pagination: { currentPage: 1, totalPages: 1, totalPosts: 1 } }],
            pageParams: [1]
          };
        }
      }
      return oldData;
    });
  }, [queryClient]);

  useEffect(() => {
    if (!socket) return;
    socket.on("newPost", handleNewPost);
    return () => {
      socket.off("newPost", handleNewPost);
    };
  }, [socket, handleNewPost]);

  return useMutation({
    mutationFn: (postData) => createPostService(postData),
    onSuccess: () => {
      // No need to invalidate/update here, as `handleNewPost` (from socket) will do it.
      // This prevents potential race conditions between HTTP response and socket event.
    },
    onError: (error) => {
      console.error("Failed to create post:", error);
    },
  });
};

export const useUpdatePost = () => {
  const queryClient = useQueryClient();
  const { socket } = useSocket();

  const handlePostUpdate = useCallback((updatedPost) => {
    // Always update individual post query cache
    queryClient.setQueryData(["posts", updatedPost._id], updatedPost);

    // Update infinite query data across all matching ["posts"] queries
    queryClient.setQueriesData(["posts"], (oldData) => {
      if (oldData && Array.isArray(oldData.pages)) {
        const currentPages = oldData.pages;

        const updatedPages = currentPages.map((page) => {
          const currentPosts = page.posts && Array.isArray(page.posts)
            ? page.posts
            : [];

          return {
            ...page,
            posts: currentPosts.map(
              (post) => (post._id === updatedPost._id ? updatedPost : post)
            ),
          };
        });

        return {
          ...oldData,
          pages: updatedPages,
        };
      }
      return oldData;
    });
  }, [queryClient]);

  useEffect(() => {
    if (!socket) return;
    socket.on("postUpdated", handlePostUpdate);
    return () => {
      socket.off("postUpdated", handlePostUpdate);
    };
  }, [socket, handlePostUpdate]);

  return useMutation({
    mutationFn: ({ id, updateData }) => updatePostService(id, updateData),
    onSuccess: (updatedPost, variables) => {
      // For general updates (non-like/dislike), we might still want to
      // optimistically update or invalidate here if the socket event
      // isn't guaranteed to cover all general updates.
      // However, for likes/dislikes, we'll use dedicated mutations below.
      // If `handlePostUpdate` covers all updates, this `onSuccess` can remain empty.
    },
    onError: (error, variables) => {
      console.error(`Failed to update post with id ${variables.id}:`, error);
    },
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();
  const { socket } = useSocket();

  const handlePostDelete = useCallback(({ postId }) => {
    // Remove individual post cache entry
    queryClient.removeQueries(["posts", postId]);

    // Update infinite query data across all matching ["posts"] queries
    queryClient.setQueriesData(["posts"], (oldData) => {
      if (oldData && Array.isArray(oldData.pages)) {
        const currentPages = oldData.pages;

        const updatedPages = currentPages.map((page) => {
          const currentPosts = page.posts && Array.isArray(page.posts)
            ? page.posts
            : [];

          return {
            ...page,
            posts: currentPosts.filter((post) => post._id !== postId),
          };
        });

        return {
          ...oldData,
          pages: updatedPages,
        };
      }
      return oldData;
    });
  }, [queryClient]);

  useEffect(() => {
    if (!socket) return;
    socket.on("postDeleted", handlePostDelete);
    return () => {
      socket.off("postDeleted", handlePostDelete);
    };
  }, [socket, handlePostDelete]);

  return useMutation({
    mutationFn: (postId) => deletePostService(postId),
    onSuccess: () => {
      // No need to invalidate/update here, as `handlePostDelete` (from socket) will do it.
    },
    onError: (error) => {
      console.error("Failed to delete post:", error);
    },
  });
};

export const useReportPost = () => {
  const queryClient = useQueryClient();
  const { socket } = useSocket();

  const handlePostReported = useCallback((reportedPostData) => {
    // Invalidate queries to trigger re-fetch for updated status/counts
    queryClient.invalidateQueries({ queryKey: ["posts", reportedPostData.postId] });
    queryClient.invalidateQueries({ queryKey: ["posts"] });
  }, [queryClient]);

  useEffect(() => {
    if (!socket) return;
    socket.on("postReported", handlePostReported);
    return () => {
      socket.off("postReported", handlePostReported);
    };
  }, [socket, handlePostReported]);

  return useMutation({
    mutationFn: ({ id, reason, type }) => reportPostService(id, reason, type),
    onSuccess: () => {
      // No need to invalidate/update here, as `handlePostReported` (from socket) will do it.
    },
    onError: (error) => {
      console.error("Failed to report post:", error);
    },
  });
};


export const useLikePost = () => {
  const queryClient = useQueryClient();
  const { socket } = useSocket();

  // Socket listener for 'postUpdated' will handle updates from other users
  // and also confirm/revert optimistic updates from this user.
  // No separate handler needed here, `useUpdatePost`'s `handlePostUpdate` covers it.

  return useMutation({
    mutationFn: (postId) => likePostService(postId),
    onMutate: async (postId) => {
      // Cancel any outgoing refetches for this post
      await queryClient.cancelQueries({ queryKey: ["posts", postId] });

      // Snapshot the previous value
      const previousPost = queryClient.getQueryData(["posts", postId]);

      // Optimistically update the single post cache
      queryClient.setQueryData(["posts", postId], (old) => {
        if (!old) return old;
        const currentUserId = localStorage.getItem('user_id'); // Replace with actual user ID from auth context
        const isCurrentlyLiked = old.likes.includes(currentUserId);
        const isCurrentlyDisliked = old.dislikes.includes(currentUserId);

        const newLikes = isCurrentlyLiked
          ? old.likes.filter(id => id !== currentUserId)
          : [...old.likes, currentUserId];
        const newDislikes = old.dislikes.filter(id => id !== currentUserId);

        return {
          ...old,
          likes: newLikes,
          dislikes: newDislikes,
        };
      });

      // Optimistically update the infinite query cache
      queryClient.setQueriesData(["posts"], (oldData) => {
        if (oldData && Array.isArray(oldData.pages)) {
          const currentUserId = localStorage.getItem('user_id'); // Replace with actual user ID from auth context
          const updatedPages = oldData.pages.map((page) => {
            const currentPosts = page.posts && Array.isArray(page.posts) ? page.posts : [];
            return {
              ...page,
              posts: currentPosts.map((post) => {
                if (post._id === postId) {
                  const isCurrentlyLiked = post.likes.includes(currentUserId);
                  const isCurrentlyDisliked = post.dislikes.includes(currentUserId);

                  const newLikes = isCurrentlyLiked
                    ? post.likes.filter(id => id !== currentUserId)
                    : [...post.likes, currentUserId];
                  const newDislikes = post.dislikes.filter(id => id !== currentUserId);

                  return {
                    ...post,
                    likes: newLikes,
                    dislikes: newDislikes,
                  };
                }
                return post;
              }),
            };
          });
          return { ...oldData, pages: updatedPages };
        }
        return oldData;
      });

      return { previousPost }; // Return snapshot for onError
    },
    onSuccess: (updatedPostFromServer, postId) => {
      // The `postUpdated` socket event will handle the final state update.
      // This `onSuccess` can be used for toasts or other side effects.
      // No explicit `setQueryData` here to avoid race conditions with socket.
      // If you want immediate visual confirmation even before socket,
      // you can use `queryClient.setQueryData(["posts", postId], updatedPostFromServer);`
      // but ensure your socket handler is robust enough to overwrite it.
    },
    onError: (error, postId, context) => {
      console.error(`Failed to like post ${postId}:`, error);
      toast.error(error.response?.data?.message || "Failed to update like status.");
      // Revert to the previous state on error
      if (context?.previousPost) {
        queryClient.setQueryData(["posts", postId], context.previousPost);
        // Also revert infinite query if necessary (more complex, consider invalidating)
        queryClient.invalidateQueries({ queryKey: ["posts"] });
      }
    },
  });
};

// --- NEW: useDislikePost hook ---
export const useDislikePost = () => {
  const queryClient = useQueryClient();
  const { socket } = useSocket();

  // Socket listener for 'postUpdated' will handle updates from other users
  // and also confirm/revert optimistic updates from this user.
  // No separate handler needed here, `useUpdatePost`'s `handlePostUpdate` covers it.

  return useMutation({
    mutationFn: (postId) => dislikePostService(postId),
    onMutate: async (postId) => {
      // Cancel any outgoing refetches for this post
      await queryClient.cancelQueries({ queryKey: ["posts", postId] });

      // Snapshot the previous value
      const previousPost = queryClient.getQueryData(["posts", postId]);

      // Optimistically update the single post cache
      queryClient.setQueryData(["posts", postId], (old) => {
        if (!old) return old;
        const currentUserId = localStorage.getItem('user_id'); // Replace with actual user ID from auth context
        const isCurrentlyDisliked = old.dislikes.includes(currentUserId);
        const isCurrentlyLiked = old.likes.includes(currentUserId);

        const newDislikes = isCurrentlyDisliked
          ? old.dislikes.filter(id => id !== currentUserId)
          : [...old.dislikes, currentUserId];
        const newLikes = old.likes.filter(id => id !== currentUserId);

        return {
          ...old,
          dislikes: newDislikes,
          likes: newLikes,
        };
      });

      // Optimistically update the infinite query cache
      queryClient.setQueriesData(["posts"], (oldData) => {
        if (oldData && Array.isArray(oldData.pages)) {
          const currentUserId = localStorage.getItem('user_id'); // Replace with actual user ID from auth context
          const updatedPages = oldData.pages.map((page) => {
            const currentPosts = page.posts && Array.isArray(page.posts) ? page.posts : [];
            return {
              ...page,
              posts: currentPosts.map((post) => {
                if (post._id === postId) {
                  const isCurrentlyDisliked = post.dislikes.includes(currentUserId);
                  const isCurrentlyLiked = post.likes.includes(currentUserId);

                  const newDislikes = isCurrentlyDisliked
                    ? post.dislikes.filter(id => id !== currentUserId)
                    : [...post.dislikes, currentUserId];
                  const newLikes = post.likes.filter(id => id !== currentUserId);

                  return {
                    ...post,
                    dislikes: newDislikes,
                    likes: newLikes,
                  };
                }
                return post;
              }),
            };
          });
          return { ...oldData, pages: updatedPages };
        }
        return oldData;
      });

      return { previousPost }; // Return snapshot for onError
    },
    onSuccess: (updatedPostFromServer, postId) => {
      // The `postUpdated` socket event will handle the final state update.
      // This `onSuccess` can be used for toasts or other side effects.
    },
    onError: (error, postId, context) => {
      console.error(`Failed to dislike post ${postId}:`, error);
      toast.error(error.response?.data?.message || "Failed to update dislike status.");
      // Revert to the previous state on error
      if (context?.previousPost) {
        queryClient.setQueryData(["posts", postId], context.previousPost);
        // Also revert infinite query if necessary (more complex, consider invalidating)
        queryClient.invalidateQueries({ queryKey: ["posts"] });
      }
    },
  });
};

export const useToggleEventInterest = () => {
  const queryClient = useQueryClient();
  const { socket } = useSocket();

  return useMutation({
    mutationFn: ({ eventId, currentUserId }) => toggleEventInterestService(eventId),
    onMutate: async ({ eventId, currentUserId }) => { // Correctly destructuring currentUserId here
      console.log('useToggleEventInterest: onMutate triggered for eventId:', eventId, 'by userId:', currentUserId); // Added currentUserId to log
      await queryClient.cancelQueries({ queryKey: ["posts", eventId] });

      const previousPost = queryClient.getQueryData(["posts", eventId]);
      console.log('useToggleEventInterest: previousPost snapshot:', previousPost?._id);

      queryClient.setQueryData(["posts", eventId], (old) => {
        if (!old || old.type !== "Event") {
          console.warn('useToggleEventInterest: No old data or not an Event type for individual post cache. Not performing individual optimistic update.');
          return old;
        }
        // FIXED: Use the currentUserId from the onMutate arguments
        const isCurrentlyInterested = old.interestedUsers.includes(currentUserId);
        const newInterestedUsers = isCurrentlyInterested
          ? old.interestedUsers.filter((id) => id !== currentUserId)
          : [...old.interestedUsers, currentUserId];
        
        const newState = { ...old, interestedUsers: newInterestedUsers };
        console.log('useToggleEventInterest: Optimistically updated individual post cache:', newState?._id, {interestedUsers: newState.interestedUsers.length});
        return newState;
      });

      queryClient.setQueriesData(["posts"], (oldData) => {
        if (oldData && Array.isArray(oldData.pages)) {
          console.log('useToggleEventInterest: Optimistically updating infinite query for eventId:', eventId);
          // FIXED: Use the currentUserId from the onMutate arguments
          const updatedPages = oldData.pages.map((page) => {
            const currentPosts =
              page.posts && Array.isArray(page.posts) ? page.posts : [];
            return {
              ...page,
              posts: currentPosts.map((post) => {
                if (post._id === eventId && post.type === "Event") {
                  const isCurrentlyInterested =
                    post.interestedUsers.includes(currentUserId);
                  const newInterestedUsers = isCurrentlyInterested
                    ? post.interestedUsers.filter((id) => id !== currentUserId)
                    : [...post.interestedUsers, currentUserId];
                  console.log('useToggleEventInterest: Updated post in infinite query:', post._id, {interestedUsers: newInterestedUsers.length});
                  return { ...post, interestedUsers: newInterestedUsers };
                }
                return post;
              }),
            };
          });
          return { ...oldData, pages: updatedPages };
        }
        console.log('useToggleEventInterest: oldData for infinite query is not array or pages, returning oldData.');
        return oldData;
      });

      return { previousPost, currentUserId }; // Pass currentUserId to context for onError
    },
    onSuccess: (updatedEventPostFromServer, { eventId, currentUserId }) => { // Destructure variables
      console.log(`useToggleEventInterest: Mutation onSuccess (HTTP response for event interest ${eventId}):`, updatedEventPostFromServer?._id, 'by user:', currentUserId);
    },
    onError: (error, { eventId, currentUserId }, context) => { // Destructure variables
      console.error(`useToggleEventInterest: Failed to toggle event interest for event ${eventId} by user ${currentUserId}:`, error);
      if (context?.previousPost) {
        console.log('useToggleEventInterest: Reverting individual post cache on error:', eventId);
        queryClient.setQueryData(["posts", eventId], context.previousPost);
      }
      console.log('useToggleEventInterest: Invalidating infinite query on error for eventId:', eventId);
      queryClient.invalidateQueries({ queryKey: ["posts"] }); // Invalidate to ensure consistency
    },
  });
};

export const useToggleEventRSVP = () => {
  const queryClient = useQueryClient();
  const { socket } = useSocket();

  return useMutation({
    mutationFn: ({ eventId, currentUserId }) => toggleEventRSVPService(eventId),
    onMutate: async ({ eventId, currentUserId }) => { // Correctly destructuring currentUserId here
      console.log('useToggleEventRSVP: onMutate triggered for eventId:', eventId, 'by userId:', currentUserId); // Added currentUserId to log
      await queryClient.cancelQueries({ queryKey: ["posts", eventId] });

      const previousPost = queryClient.getQueryData(["posts", eventId]);
      console.log('useToggleEventRSVP: previousPost snapshot:', previousPost?._id);

      queryClient.setQueryData(["posts", eventId], (old) => {
        if (!old || old.type !== "Event") {
          console.warn('useToggleEventRSVP: No old data or not an Event type for individual post cache. Not performing individual optimistic update.');
          return old;
        }
        // FIXED: Use the currentUserId from the onMutate arguments
        const isCurrentlyRSVPd = old.rsvpUsers.includes(currentUserId);
        const newRsvpUsers = isCurrentlyRSVPd
          ? old.rsvpUsers.filter((id) => id !== currentUserId)
          : [...old.rsvpUsers, currentUserId];
        
        const newState = { ...old, rsvpUsers: newRsvpUsers };
        console.log('useToggleEventRSVP: Optimistically updated individual post cache:', newState?._id, {rsvpUsers: newState.rsvpUsers.length});
        return newState;
      });

      queryClient.setQueriesData(["posts"], (oldData) => {
        if (oldData && Array.isArray(oldData.pages)) {
          console.log('useToggleEventRSVP: Optimistically updating infinite query for eventId:', eventId);
          // FIXED: Use the currentUserId from the onMutate arguments
          const updatedPages = oldData.pages.map((page) => {
            const currentPosts =
              page.posts && Array.isArray(page.posts) ? page.posts : [];
            return {
              ...page,
              posts: currentPosts.map((post) => {
                if (post._id === eventId && post.type === "Event") {
                  const isCurrentlyRSVPd =
                    post.rsvpUsers.includes(currentUserId);
                  const newRsvpUsers = isCurrentlyRSVPd
                    ? post.rsvpUsers.filter((id) => id !== currentUserId)
                    : [...post.rsvpUsers, currentUserId];
                  console.log('useToggleEventRSVP: Updated post in infinite query:', post._id, {rsvpUsers: newRsvpUsers.length});
                  return { ...post, rsvpUsers: newRsvpUsers };
                }
                return post;
              }),
            };
          });
          return { ...oldData, pages: updatedPages };
        }
        console.log('useToggleEventRSVP: oldData for infinite query is not array or pages, returning oldData.');
        return oldData;
      });

      return { previousPost, currentUserId }; // Pass currentUserId to context for onError
    },
    onSuccess: (updatedEventPostFromServer, { eventId, currentUserId }) => { // Destructure variables
      console.log(`useToggleEventRSVP: Mutation onSuccess (HTTP response for event RSVP ${eventId}):`, updatedEventPostFromServer?.message, updatedEventPostFromServer?.event?._id, 'by user:', currentUserId);
    },
    onError: (error, { eventId, currentUserId }, context) => { // Destructure variables
      console.error(`useToggleEventRSVP: Failed to toggle event RSVP for event ${eventId} by user ${currentUserId}:`, error);
      if (context?.previousPost) {
        console.log('useToggleEventRSVP: Reverting individual post cache on error:', eventId);
        queryClient.setQueryData(["posts", eventId], context.previousPost);
      }
      console.log('useToggleEventRSVP: Invalidating infinite query on error for eventId:', eventId);
      queryClient.invalidateQueries({ queryKey: ["posts"] }); // Invalidate to ensure consistency
    },
  });
};


export const useCastVote = () => {
  const queryClient = useQueryClient();
  const { socket } = useSocket();

  // Callback to handle 'pollVoteUpdated' socket event
  const handlePollVoteUpdated = useCallback((updatedPoll) => {
    console.log('useCastVote: Socket event "pollVoteUpdated" received:', updatedPoll._id);
    // Update individual poll cache with the latest data from the server
    queryClient.setQueryData(["posts", updatedPoll._id], updatedPoll);

    // Update infinite query data across all matching ["posts"] queries
    queryClient.setQueriesData(["posts"], (oldData) => {
      if (oldData && Array.isArray(oldData.pages)) {
        const updatedPages = oldData.pages.map((page) => {
          const currentPosts = page.posts && Array.isArray(page.posts) ? page.posts : [];
          return {
            ...page,
            posts: currentPosts.map((post) =>
              post._id === updatedPoll._id ? updatedPoll : post
            ),
          };
        });
        return { ...oldData, pages: updatedPages };
      }
      return oldData;
    });
  }, [queryClient]);

  // Effect to listen for the socket event
  useEffect(() => {
    if (!socket) return;
    socket.on("pollVoteUpdated", handlePollVoteUpdated);
    return () => {
      socket.off("pollVoteUpdated", handlePollVoteUpdated);
    };
  }, [socket, handlePollVoteUpdated]);

  return useMutation({
    mutationFn: ({ postId, optionIndex }) => castVoteService(postId, optionIndex),
    onMutate: async ({ postId, optionIndex }) => {
      console.log('useCastVote: onMutate triggered for postId:', postId, 'optionIndex:', optionIndex);
      // Cancel any outgoing refetches for this post
      await queryClient.cancelQueries({ queryKey: ["posts", postId] });

      // Snapshot the previous value
      const previousPost = queryClient.getQueryData(["posts", postId]);
      console.log('useCastVote: previousPost snapshot:', previousPost?._id);

      // Optimistically update the single poll cache
      queryClient.setQueryData(["posts", postId], (old) => {
        if (!old || old.type !== "Poll") {
          console.warn('useCastVote: No old data or not a Poll type for individual post cache. Not performing individual optimistic update.');
          return old;
        }

        const currentUserId = localStorage.getItem('user_id'); // Get current user ID
        const hasVoted = old.votedUsers.includes(currentUserId);
        const isMultipleSelectionsAllowed = old.allowMultipleSelections;

        // If user has already voted and multiple selections are not allowed, do not optimistically update
        if (hasVoted && !isMultipleSelectionsAllowed) {
            console.warn('useCastVote: User already voted and multiple selections not allowed. Skipping optimistic update.');
            return old;
        }

        const newOptions = old.options.map((opt, idx) => {
          if (idx === optionIndex) {
            return { ...opt, votes: opt.votes + 1 };
          }
          return opt;
        });

        const newVotedUsers = hasVoted && isMultipleSelectionsAllowed
          ? old.votedUsers // If already voted and multiple allowed, don't add again (assuming one vote per option per user)
          : [...old.votedUsers, currentUserId];

        // Recalculate total votes and percentages
        const totalVotes = newOptions.reduce((sum, opt) => sum + opt.votes, 0);
        const updatedOptionsWithPercentages = newOptions.map(opt => ({
          ...opt,
          percentage: totalVotes === 0 ? 0 : (opt.votes / totalVotes) * 100,
        }));

        const newState = {
          ...old,
          options: updatedOptionsWithPercentages,
          votedUsers: newVotedUsers,
          totalVotes: totalVotes, // Add totalVotes to the client-side state for easier access
        };
        console.log('useCastVote: Optimistically updated individual poll cache:', newState?._id, { options: newState.options, votedUsers: newState.votedUsers.length });
        return newState;
      });

      // Optimistically update the infinite query cache
      queryClient.setQueriesData(["posts"], (oldData) => {
        if (oldData && Array.isArray(oldData.pages)) {
          const currentUserId = localStorage.getItem('user_id'); // Get current user ID
          const updatedPages = oldData.pages.map((page) => {
            const currentPosts = page.posts && Array.isArray(page.posts) ? page.posts : [];
            return {
              ...page,
              posts: currentPosts.map((post) => {
                if (post._id === postId && post.type === "Poll") {
                  const hasVoted = post.votedUsers.includes(currentUserId);
                  const isMultipleSelectionsAllowed = post.allowMultipleSelections;

                  if (hasVoted && !isMultipleSelectionsAllowed) {
                      return post; // Do not optimistically update if already voted and multiple selections not allowed
                  }

                  const newOptions = post.options.map((opt, idx) => {
                    if (idx === optionIndex) {
                      return { ...opt, votes: opt.votes + 1 };
                    }
                    return opt;
                  });

                  const newVotedUsers = hasVoted && isMultipleSelectionsAllowed
                    ? post.votedUsers
                    : [...post.votedUsers, currentUserId];

                  const totalVotes = newOptions.reduce((sum, opt) => sum + opt.votes, 0);
                  const updatedOptionsWithPercentages = newOptions.map(opt => ({
                    ...opt,
                    percentage: totalVotes === 0 ? 0 : (opt.votes / totalVotes) * 100,
                  }));

                  const updatedPost = {
                    ...post,
                    options: updatedOptionsWithPercentages,
                    votedUsers: newVotedUsers,
                    totalVotes: totalVotes,
                  };
                  console.log('useCastVote: Optimistically updated post in infinite query:', updatedPost._id, { options: updatedPost.options, votedUsers: updatedPost.votedUsers.length });
                  return updatedPost;
                }
                return post;
              }),
            };
          });
          return { ...oldData, pages: updatedPages };
        }
        return oldData;
      });

      return { previousPost, postId, optionIndex }; // Return snapshot and mutation variables for onError
    },
    onSuccess: (updatedPollFromServer, { postId }) => {
      console.log(`useCastVote: Mutation onSuccess (HTTP response for poll vote ${postId}):`, updatedPollFromServer?._id);
      // The `handlePollVoteUpdated` socket event will handle the final state update,
      // ensuring consistency across all clients. No explicit `setQueryData` here to avoid race conditions.
    },
    onError: (error, { postId, optionIndex }, context) => {
      console.error(`useCastVote: Failed to cast vote for poll ${postId}, option ${optionIndex}:`, error);
      // toast.error(error.response?.data?.message || "Failed to cast vote."); // Assuming toast is available
      // Revert to the previous state on error
      if (context?.previousPost) {
        console.log('useCastVote: Reverting individual poll cache on error:', postId);
        queryClient.setQueryData(["posts", postId], context.previousPost);
      }
      console.log('useCastVote: Invalidating infinite query on error for pollId:', postId);
      queryClient.invalidateQueries({ queryKey: ["posts"] }); // Invalidate to ensure consistency
    },
  });
};
