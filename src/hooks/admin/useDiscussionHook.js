import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { discussionService } from '../../services/admin/discussionService';

export const useFetchDiscussions = (params) => {
  return useQuery({
    queryKey: ['discussions', params],
    queryFn: () => discussionService.fetch(params),
    keepPreviousData: true,
    staleTime: 1000 * 60 * 1,
  });
};

export const useToggleDiscussionPinStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (discussionId) => discussionService.togglePin(discussionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['discussions'] });
      queryClient.invalidateQueries({ queryKey: ['moderationDiscussions'] });
    },
    onError: (error, variables) => {
      console.error(`Failed to toggle pin status for discussion ${variables}:`, error);
    },
  });
};

export const useFetchDiscussionById = (discussionId) => {
  return useQuery({
    queryKey: ['discussion', discussionId],
    queryFn: () => discussionService.getById(discussionId),
    enabled: !!discussionId,
    staleTime: 1000 * 60 * 5,
  });
};

export const useFetchModerationDiscussions = (params) => {
    return useQuery({
        queryKey: ['moderationDiscussions', params],
        queryFn: () => discussionService.fetchModeration(params),
        keepPreviousData: true,
        staleTime: 1000 * 30,
    });
};