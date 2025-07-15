import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { profileService } from '../../services/user/profileService';

// Fetch user profile
export const useFetchUserProfile = (userId) => {
  return useQuery({
    queryKey: ['userProfile', userId],
    queryFn: () => profileService.fetchProfile(userId),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
  });
};

// Update user profile
export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, updateData }) => profileService.updateProfile(userId, updateData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['userProfile', variables.userId] });
    },
    onError: (error, variables) => {
      console.error(`Failed to update user profile (id: ${variables.userId}):`, error);
    },
  });
};

// Delete user profile
export const useDeleteUserProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId) => profileService.deleteProfile(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      queryClient.invalidateQueries({ queryKey: ['userPosts'] });
      queryClient.invalidateQueries({ queryKey: ['userAchievements'] });
      queryClient.invalidateQueries({ queryKey: ['userSessions'] });
    },
    onError: (error) => {
      console.error('Failed to delete user profile:', error);
    },
  });
};

// Change user password
export const useChangeUserPassword = () => {
  return useMutation({
    mutationFn: ({ userId, passwordData }) => profileService.changePassword(userId, passwordData),
    onError: (error) => {
      console.error('Failed to change user password:', error);
    },
  });
};

// Fetch user posts
export const useFetchUserPosts = (userId, params) => {
  return useQuery({
    queryKey: ['userPosts', userId, params],
    queryFn: () => profileService.fetchPosts(userId, params),
    enabled: !!userId,
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5,
  });
};

// Fetch user achievements
export const useFetchUserAchievements = (userId) => {
  return useQuery({
    queryKey: ['userAchievements', userId],
    queryFn: () => profileService.fetchAchievements(userId),
    enabled: !!userId,
    staleTime: 1000 * 60 * 10,
  });
};

// Fetch user active sessions
export const useFetchUserActiveSessions = (userId) => {
  return useQuery({
    queryKey: ['userSessions', userId],
    queryFn: () => profileService.fetchActiveSessions(userId),
    enabled: !!userId,
    staleTime: 1000 * 60 * 1,
  });
};

// Logout user from all devices
export const useLogoutUserFromAllDevices = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId) => profileService.logoutAllDevices(userId),
    onSuccess: (_, userId) => {
      queryClient.invalidateQueries({ queryKey: ['userSessions', userId] });
    },
    onError: (error) => {
      console.error('Failed to logout user from all devices:', error);
    },
  });
};

// Revoke specific session
export const useRevokeUserSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, sessionId }) => profileService.revokeSession(userId, sessionId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['userSessions', variables.userId] });
    },
    onError: (error, variables) => {
      console.error(`Failed to revoke session ${variables.sessionId}:`, error);
    },
  });
};
