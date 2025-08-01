import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminUserService } from '../../services/admin/userAccountService';

/**
 * Hook to fetch users using React Query.
 *
 * @param {Object} params - Query params { page, limit, search, sortBy, sortOrder }
 */
export const useFetchUsers = (params) => {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => adminUserService.fetchUsersService(params),
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Hook to delete a user and refetch the users list.
 */
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId) => adminUserService.deleteUserService(userId),
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
    },
    onError: (error) => {
      console.error('Failed to delete user:', error);
    },
  });
};

export const useToggleUserBanStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId) => adminUserService.toggleUserBanStatusService(userId),
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      queryClient.invalidateQueries(['admin', 'userEngagementAnalytics']);
    },
    onError: (error) => {
      console.error('Failed to toggle user ban status:', error);
    },
  });
};

export const useUserEngagementAnalytics = () => {
  return useQuery({
    queryKey: ['admin', 'userEngagementAnalytics'],
    queryFn: () => adminUserService.fetchUserEngagementAnalyticsService(),
    staleTime: 1000 * 60 * 10,
  });
};