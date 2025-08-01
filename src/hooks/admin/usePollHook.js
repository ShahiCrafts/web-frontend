import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { pollService } from '../../services/admin/pollService'; // Adjust path to your pollService.js

/**
 * Hook to fetch a paginated, filtered, and searchable list of polls.
 *
 * @param {Object} params - Query parameters for polls:
 * - `page`: Current page number (default: 1)
 * - `limit`: Number of items per page (default: 10)
 * - `search`: Search term for poll question
 * - `sortBy`: Field to sort by (e.g., 'createdAt', 'totalVotes')
 * - `sortOrder`: Sort direction ('asc' or 'desc')
 * - `status`: Filter by calculated poll status ('Active', 'Closed')
 */
export const useFetchPolls = (params) => {
  return useQuery({
    queryKey: ['polls', params],
    queryFn: () => pollService.fetch(params),
    keepPreviousData: true, // Keep old data while fetching new (good for pagination/filters)
    staleTime: 1000 * 60 * 1, // Data considered fresh for 1 minute
  });
};

/**
 * Hook to fetch a single poll by its ID.
 *
 * @param {string} pollId - The ID of the poll.
 */
export const useFetchPollById = (pollId) => {
  return useQuery({
    queryKey: ['poll', pollId],
    queryFn: () => pollService.getById(pollId),
    enabled: !!pollId, // Only run query if pollId is provided
    staleTime: 1000 * 60 * 5, // Data considered fresh for 5 minutes
  });
};

/**
 * Hook to create a new poll.
 * Invalidates the 'polls' query upon success to automatically update the list.
 */
export const useCreatePoll = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (pollData) => pollService.create(pollData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['polls'] });
    },
    onError: (error) => {
      console.error('Failed to create poll:', error);
    },
  });
};

/**
 * Hook to update an existing poll.
 * Invalidates the specific poll and the overall polls list upon success.
 */
export const useUpdatePoll = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ pollId, updateData }) => pollService.update(pollId, updateData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['polls'] });
      queryClient.invalidateQueries({ queryKey: ['poll', variables.pollId] });
    },
    onError: (error, variables) => {
      console.error(`Failed to update poll (id: ${variables.pollId}):`, error);
    },
  });
};

/**
 * Hook to delete a poll.
 * Invalidates the 'polls' query upon success.
 */
export const useDeletePoll = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (pollId) => pollService.delete(pollId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['polls'] });
    },
    onError: (error, variables) => {
      console.error(`Failed to delete poll (id: ${variables}):`, error);
    },
  });
};