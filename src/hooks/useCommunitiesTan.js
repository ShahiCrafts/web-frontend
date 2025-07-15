// src/hooks/useCommunities.js

import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { useEffect, useCallback } from "react";
import { useSocket } from "../context/SocketProvider"; // Adjust path as needed
import { useAuth } from "../context/AuthProvider"; // Assuming you need user/token for some calls

import {
  createCommunity as createCommunityService,
  listApprovedCommunities as listApprovedCommunitiesService,
  getCommunityDetails as getCommunityDetailsService,
  listPendingCommunities as listPendingCommunitiesService,
  reviewCommunity as reviewCommunityService,
  listUserOwnedCommunities as listUserOwnedCommunitiesService,
} from "../services/communityService"; // Adjust path as needed

/**
 * Hook to fetch a paginated list of approved communities.
 * Uses useInfiniteQuery for potential infinite scrolling.
 * @param {Object} params - Query parameters (e.g., search, category, privacy).
 */
export const useInfiniteApprovedCommunities = (params) => {
  return useInfiniteQuery({
    queryKey: ["communities", "approved", params], // Key for approved communities
    queryFn: ({ pageParam = 1 }) =>
      listApprovedCommunitiesService({ ...params, page: pageParam }),

    getNextPageParam: (lastPage) => {
      if (!lastPage?.pagination) return undefined;
      const { currentPage, totalPages } = lastPage.pagination;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    keepPreviousData: true, // Keep previous data while fetching new page
    staleTime: 1000 * 60 * 5, // Data considered fresh for 5 minutes
  });
};

export const useUserOwnedCommunities = () => {
  const { user, token } = useAuth(); // Get user ID and token from auth context
  console.log("useUserOwnedCommunities: User object from Auth:", user);
  console.log(
    "useUserOwnedCommunities: Token from Auth:",
    token ? "Exists" : "Does NOT exist"
  );
  console.log("useUserOwnedCommunities: enabled status:", !!user && !!token);

  return useQuery({
    queryKey: ["userCommunities", user?.id], // Unique key for the user's owned communities
    queryFn: async () => {
      console.log(
        "useUserOwnedCommunities: Calling listUserOwnedCommunitiesService for user ID:",
        user?.id
      );

      // --- CRUCIAL FIX HERE ---
      const data = await listUserOwnedCommunitiesService(); // Call the correct service function
      // --- END CRUCIAL FIX ---

      console.log("useUserOwnedCommunities: Data received from service:", data); // Keep this log for verification
      return data;
    },
    enabled: !!user && !!token, // Only run this query if the user is logged in
    staleTime: 1000 * 60, // Consider data stale after 1 minute (adjust as needed)
    // When SocketProvider invalidates 'userCommunities', this query will automatically refetch.
  });
};

/**
 * Hook to fetch details of a single community by its slug.
 * @param {string} slug - The slug of the community.
 */
export const useFetchCommunityDetails = (slug) => {
  const { user, token } = useAuth(); // Assuming getCommunityDetails might need auth for non-approved
  return useQuery({
    queryKey: ["communityDetails", slug],
    queryFn: () => getCommunityDetailsService(slug),
    enabled: !!slug, // Only fetch if slug is provided
    // If community details can change (e.g., status, members), consider staleTime or refetchOnWindowFocus
  });
};

/**
 * Hook to create a new community.
 * The community will initially have a 'pending' status.
 */
export const useCreateCommunity = () => {
  const queryClient = useQueryClient();
  const { socket } = useSocket();

  // No specific socket listener needed here for immediate UI update,
  // as the backend handles sending 'community:newApprovalRequest' to admins
  // and 'community:approved'/'community:rejected' to the creator.
  // The SocketProvider already invalidates relevant queries.

  return useMutation({
    mutationFn: (communityData) => createCommunityService(communityData),
    onSuccess: (data) => {
      // On successful submission for approval, show a toast.
      // The actual community becoming "live" is handled by the approval process
      // and subsequent socket events.
      console.log("Community creation request submitted:", data);
      // Invalidate the user's list of communities so they can see the 'pending' one
      queryClient.invalidateQueries({ queryKey: ["userCommunities"] });
      // Admins will be notified via socket and their 'pendingCommunities' query will invalidate.
    },
    onError: (error) => {
      console.error("Failed to create community:", error);
      // Handle error, e.g., show a toast notification
    },
  });
};

/**
 * Hook for administrators to list communities awaiting approval.
 */
export const useListPendingCommunities = () => {
  const queryClient = useQueryClient();
  const { socket } = useSocket();
  const { user, token } = useAuth();

  // This callback will be triggered when a new community approval request comes in
  const handleNewApprovalRequest = useCallback(() => {
    console.log(
      "TanStack Query: Received new community approval request via socket."
    );
    // Invalidate the 'pendingCommunities' query to refetch the updated list
    queryClient.invalidateQueries({ queryKey: ["pendingCommunities"] });
  }, [queryClient]);

  // Attach socket listener for new approval requests
  useEffect(() => {
    if (!socket) return;
    socket.on("community:newApprovalRequest", handleNewApprovalRequest);
    return () => {
      socket.off("community:newApprovalRequest", handleNewApprovalRequest);
    };
  }, [socket, handleNewApprovalRequest]);

  return useQuery({
    queryKey: ["pendingCommunities"],
    queryFn: () => listPendingCommunitiesService(),
    enabled: !!user && user.role === "admin", // Only fetch if user is an admin
    staleTime: 0, // Always refetch when component mounts or query invalidates for admin view
  });
};

/**
 * Hook for administrators to approve or reject a community.
 */
export const useReviewCommunity = () => {
  const queryClient = useQueryClient();
  const { socket } = useSocket(); // Socket is not directly used for UI update here, but for context

  return useMutation({
    mutationFn: ({ communityId, action, rejectionReason }) =>
      reviewCommunityService(communityId, action, rejectionReason),
    onSuccess: (data, variables) => {
      console.log(`Community ${variables.action}d successfully:`, data);
      // Invalidate the list of pending communities (it should disappear from the list)
      queryClient.invalidateQueries({ queryKey: ["pendingCommunities"] });

      if (variables.action === "approve") {
        // If approved, invalidate the general list of approved communities
        // and potentially the specific community's details if cached
        queryClient.invalidateQueries({
          queryKey: ["communities", "approved"],
        });
        queryClient.invalidateQueries({
          queryKey: ["communityDetails", data.slug],
        }); // Assuming response includes slug
      }
      // The creator will receive a socket event ('community:approved' or 'community:rejected')
      // which is handled by SocketProvider to invalidate their 'userCommunities' query.
    },
    onError: (error) => {
      console.error("Failed to review community:", error);
      // Handle error, e.g., show a toast notification
    },
  });
};
