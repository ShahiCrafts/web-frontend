import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useEffect, useCallback } from "react";
import { useSocket } from "../../context/SocketProvider"; // Adjust path as needed

import {
  followUserService,
  unfollowUserService,
  checkFollowingStatusService,
  getFollowingService,
  getFollowersService,
} from "../services/user/followService"; // Adjust path to your follow services

/**
 * Hook for following a user.
 */
export const useFollowUser = () => {
  const queryClient = useQueryClient();
  const { socket } = useSocket();

  // Socket listener for when the current user's following status changes
  const handleFollowingStatusUpdate = useCallback((data) => {
    console.log("TanStack Query: Received user:followingStatusUpdate via socket:", data);
    const { targetUserId, isFollowing } = data;

    // Update the specific checkFollowingStatus query for the target user
    queryClient.setQueryData(["follows", "status", targetUserId], { isFollowing });

    // Invalidate queries for the current user's profile and following list
    // to potentially update following counts or list entries
    queryClient.invalidateQueries({ queryKey: ["users", data.followerId || null] }); // Invalidate current user's profile (followerId is current user)
    queryClient.invalidateQueries({ queryKey: ["follows", "following", data.followerId || null] }); // Invalidate current user's following list
  }, [queryClient]);

  // Socket listener for when another user follows the current user
  const handleNewFollower = useCallback((data) => {
    console.log("TanStack Query: Received user:newFollower via socket:", data);
    const { followingId } = data; // followingId here refers to the current user (the one being followed)

    // Invalidate queries for the current user's profile and followers list
    // to update follower counts or list entries
    queryClient.invalidateQueries({ queryKey: ["users", followingId] });
    queryClient.invalidateQueries({ queryKey: ["follows", "followers", followingId] });
  }, [queryClient]);


  useEffect(() => {
    if (!socket) return;

    socket.on("user:followingStatusUpdate", handleFollowingStatusUpdate);
    socket.on("user:newFollower", handleNewFollower);

    return () => {
      socket.off("user:followingStatusUpdate", handleFollowingStatusUpdate);
      socket.off("user:newFollower", handleNewFollower);
    };
  }, [socket, handleFollowingStatusUpdate, handleNewFollower]);


  return useMutation({
    mutationFn: (userIdToFollow) => followUserService(userIdToFollow),
    // Optimistic Update
    onMutate: async (userIdToFollow) => {
      // Cancel any outgoing refetches for queries that might be affected
      await queryClient.cancelQueries({ queryKey: ["follows", "status", userIdToFollow] });
      await queryClient.cancelQueries({ queryKey: ["users"] }); // Could be broader for user profiles

      // Snapshot the previous value
      const previousFollowingStatus = queryClient.getQueryData(["follows", "status", userIdToFollow]);
      const previousUserProfile = queryClient.getQueryData(["users", userIdToFollow]); // For the user being followed

      // Optimistically update the following status
      queryClient.setQueryData(["follows", "status", userIdToFollow], { isFollowing: true });

      // Optimistically update the user being followed's follower count if possible
      queryClient.setQueryData(["users", userIdToFollow], (oldUser) => {
        if (oldUser && typeof oldUser.followersCount === 'number') {
          return { ...oldUser, followersCount: oldUser.followersCount + 1 };
        }
        return oldUser;
      });

      // Return a context object with the snapshotted value
      return { previousFollowingStatus, previousUserProfile };
    },
    onSuccess: (data, variables, context) => {
      // The socket event `user:followingStatusUpdate` will typically handle the final cache update,
      // but we can ensure consistency here immediately with the response data if needed.
      // For now, we trust the socket.
      console.log("Follow successful, waiting for socket confirmation if needed.");
    },
    onError: (error, variables, context) => {
      console.error(`Failed to follow user ${variables}:`, error);
      // Revert optimistic update on error
      if (context?.previousFollowingStatus) {
        queryClient.setQueryData(["follows", "status", variables], context.previousFollowingStatus);
      }
      if (context?.previousUserProfile) {
         queryClient.setQueryData(["users", variables], context.previousUserProfile);
      }
      // Invalidate to ensure consistency in case optimistic update was wrong
      queryClient.invalidateQueries({ queryKey: ["follows", "status", variables] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

/**
 * Hook for unfollowing a user.
 */
export const useUnfollowUser = () => {
  const queryClient = useQueryClient();
  const { socket } = useSocket();

  // Socket listener for when the current user's following status changes (same as for follow)
  const handleFollowingStatusUpdate = useCallback((data) => {
    console.log("TanStack Query: Received user:followingStatusUpdate via socket:", data);
    const { targetUserId, isFollowing } = data;
    queryClient.setQueryData(["follows", "status", targetUserId], { isFollowing });

    queryClient.invalidateQueries({ queryKey: ["users", data.followerId || null] });
    queryClient.invalidateQueries({ queryKey: ["follows", "following", data.followerId || null] });
  }, [queryClient]);

  // Socket listener for when another user unfollows the current user
  const handleUnfollowed = useCallback((data) => {
    console.log("TanStack Query: Received user:unfollowed via socket:", data);
    const { followingId } = data; // followingId here refers to the current user (the one being unfollowed)

    // Invalidate queries for the current user's profile and followers list
    queryClient.invalidateQueries({ queryKey: ["users", followingId] });
    queryClient.invalidateQueries({ queryKey: ["follows", "followers", followingId] });
  }, [queryClient]);


  useEffect(() => {
    if (!socket) return;

    socket.on("user:followingStatusUpdate", handleFollowingStatusUpdate);
    socket.on("user:unfollowed", handleUnfollowed);

    return () => {
      socket.off("user:followingStatusUpdate", handleFollowingStatusUpdate);
      socket.off("user:unfollowed", handleUnfollowed);
    };
  }, [socket, handleFollowingStatusUpdate, handleUnfollowed]);

  return useMutation({
    mutationFn: (userIdToUnfollow) => unfollowUserService(userIdToUnfollow),
    // Optimistic Update
    onMutate: async (userIdToUnfollow) => {
      await queryClient.cancelQueries({ queryKey: ["follows", "status", userIdToUnfollow] });
      await queryClient.cancelQueries({ queryKey: ["users"] });

      const previousFollowingStatus = queryClient.getQueryData(["follows", "status", userIdToUnfollow]);
      const previousUserProfile = queryClient.getQueryData(["users", userIdToUnfollow]);

      queryClient.setQueryData(["follows", "status", userIdToUnfollow], { isFollowing: false });

      queryClient.setQueryData(["users", userIdToUnfollow], (oldUser) => {
        if (oldUser && typeof oldUser.followersCount === 'number' && oldUser.followersCount > 0) {
          return { ...oldUser, followersCount: oldUser.followersCount - 1 };
        }
        return oldUser;
      });

      return { previousFollowingStatus, previousUserProfile };
    },
    onSuccess: (data, variables, context) => {
      // Socket event will handle final consistency
      console.log("Unfollow successful, waiting for socket confirmation if needed.");
    },
    onError: (error, variables, context) => {
      console.error(`Failed to unfollow user ${variables}:`, error);
      if (context?.previousFollowingStatus) {
        queryClient.setQueryData(["follows", "status", variables], context.previousFollowingStatus);
      }
      if (context?.previousUserProfile) {
        queryClient.setQueryData(["users", variables], context.previousUserProfile);
      }
      queryClient.invalidateQueries({ queryKey: ["follows", "status", variables] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

/**
 * Hook for checking the following status between the authenticated user and a target user.
 */
export const useCheckFollowingStatus = (targetUserId) => {
  return useQuery({
    queryKey: ["follows", "status", targetUserId],
    queryFn: () => checkFollowingStatusService(targetUserId),
    enabled: !!targetUserId, // Only run the query if targetUserId is available
    staleTime: 1000 * 60, // Consider this status relatively fresh for 1 minute
  });
};

/**
 * Hook for fetching a user's following list.
 */
export const useGetFollowing = (userId, params = {}) => {
  return useQuery({
    queryKey: ["follows", "following", userId, params],
    queryFn: () => getFollowingService(userId, params),
    enabled: !!userId,
    keepPreviousData: true, // Useful for pagination/filters
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Hook for fetching a user's followers list.
 */
export const useGetFollowers = (userId, params = {}) => {
  return useQuery({
    queryKey: ["follows", "followers", userId, params],
    queryFn: () => getFollowersService(userId, params),
    enabled: !!userId,
    keepPreviousData: true, // Useful for pagination/filters
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};