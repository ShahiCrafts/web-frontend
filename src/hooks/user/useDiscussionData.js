// src/hooks/useDiscussionData.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api/api'; // Assuming your axios instance is exported as 'api'

/**
 * Custom hook to fetch a discussion and its messages, or create the discussion if it doesn't exist.
 *
 * @param {string} postId - The ID of the post associated with the discussion.
 * @param {object} initialPostData - Optional initial post data from location state.
 * @param {object} currentUser - The current authenticated user object.
 */
export const useDiscussionData = (postId, initialPostData, currentUser) => {
    const queryClient = useQueryClient();

    // Mutation to create a group discussion if it doesn't exist for the post
    const createDiscussionMutation = useMutation({
        mutationFn: async (data) => {
            const response = await api.post('/group-discussions', data);
            return response.data;
        },
        onSuccess: (newDiscussion) => {
            // Update the cache for the discussion query
            queryClient.setQueryData(['discussion', postId], newDiscussion);
        },
        onError: (err) => {
            console.error('Failed to create group discussion:', err);
            // Optionally, invalidate the query to force a refetch or show a global error
            queryClient.invalidateQueries(['discussion', postId]);
        },
    });

    // Query to fetch the discussion details and its messages
    const discussionQuery = useQuery({
        queryKey: ['discussion', postId],
        queryFn: async () => {
            // First, try to get post data if not available
            let postDetails = initialPostData;
            if (!postDetails && postId) {
                const { data } = await api.get(`/posts/${postId}`);
                postDetails = data;
            }

            if (!postDetails) {
                throw new Error("Discussion details are missing. Please provide a valid post ID or initial post data.");
            }

            // Attempt to get or create the group discussion for this post
            // The backend endpoint /group-discussions should handle "get or create" logic
            // based on postId. If it exists, return it; otherwise, create and return.
            const { data: discussionData } = await api.post('/group-discussions', {
                postId: postDetails._id,
                description: postDetails.title, // Use post title as discussion description
            });

            // Fetch messages for this discussion
            const { data: messagesData } = await api.get('/messages', {
                params: {
                    conversationType: 'group',
                    conversationId: discussionData._id,
                },
            });

            // Return both discussion details and initial messages
            return {
                discussion: discussionData,
                messages: messagesData.messages || [],
            };
        },
        enabled: !!postId && !!currentUser, // Only run this query if postId and currentUser exist
        staleTime: Infinity, // Discussion data might not change often, messages are real-time
        refetchOnWindowFocus: false, // Messages are handled by sockets
        onError: (err) => {
            console.error("Failed to fetch discussion data:", err);
        },
    });

    // You can expose specific mutations related to messages here if needed,
    // or keep them separate in useMessageMutations.js for clarity.
    // For this example, we'll keep send/edit/delete mutations within DiscussionPage for brevity.

    return {
        discussion: discussionQuery.data?.discussion,
        messages: discussionQuery.data?.messages,
        isLoading: discussionQuery.isLoading || createDiscussionMutation.isPending,
        error: discussionQuery.error || createDiscussionMutation.error,
        refetch: discussionQuery.refetch,
        isFetching: discussionQuery.isFetching,
    };
};