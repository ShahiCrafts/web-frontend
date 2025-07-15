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
  castVoteService, // <-- Import the new service for casting votes
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
      // No need to invalidate/update here, as `handlePostUpdate` (from socket) will do it.
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
  const { socket } = useSocket(); // Assuming socket is needed for reporting too

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

// --- NEW: useCastVote hook for poll voting ---
export const useCastVote = () => {
  const queryClient = useQueryClient();
  const { socket } = useSocket();

  // This handler will update the cache when a 'pollVoteUpdated' event is received
  const handlePollVoteUpdated = useCallback((updatedPoll) => {
    console.log('TanStack Query: Received pollVoteUpdated via socket for ID:', updatedPoll._id);

    // Update individual poll cache entry
    queryClient.setQueryData(["posts", updatedPoll._id], updatedPoll);

    // Update infinite query data (if the poll is part of a list)
    queryClient.setQueriesData(["posts"], (oldData) => {
      if (oldData && Array.isArray(oldData.pages)) {
        const updatedPages = oldData.pages.map((page) => {
          const currentPosts = page.posts && Array.isArray(page.posts)
            ? page.posts
            : [];
          return {
            ...page,
            posts: currentPosts.map(
              (post) => (post._id === updatedPoll._id ? updatedPoll : post)
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

  // Attach the socket listener when this hook is mounted
  useEffect(() => {
    if (!socket) return;
    socket.on("pollVoteUpdated", handlePollVoteUpdated);
    return () => {
      socket.off("pollVoteUpdated", handlePollVoteUpdated);
    };
  }, [socket, handlePollVoteUpdated]);

  return useMutation({
    mutationFn: ({ pollId, optionLabel }) => castVoteService(pollId, optionLabel),
    onSuccess: (response, variables) => {
      // The `response.poll` from backend is the fully updated poll.
      // We can directly update the cache with this data.
      // This provides immediate UI feedback for the voter without waiting for the socket event.
      // This is an "optimistic update" that is then confirmed/overwritten by the socket event.
      queryClient.setQueryData(["posts", response.poll._id], response.poll);

      // Also update the infinite query data for the list view
      queryClient.setQueriesData(["posts"], (oldData) => {
        if (oldData && Array.isArray(oldData.pages)) {
          const updatedPages = oldData.pages.map((page) => {
            const currentPosts = page.posts && Array.isArray(page.posts)
              ? page.posts
              : [];
            return {
              ...page,
              posts: currentPosts.map(
                (post) => (post._id === response.poll._id ? response.poll : post)
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
    },
    onError: (error, variables) => {
      console.error(`Failed to cast vote for poll ${variables.pollId}:`, error);
      // On error, if you did an optimistic update, you might need to revert it here.
      // Since we're updating on `onSuccess` with actual data, reversion is less complex.
    },
  });
};