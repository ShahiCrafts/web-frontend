import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useCallback } from 'react';
import { useSocket } from '../../context/SocketProvider'; // Assuming this path
import toast from 'react-hot-toast'; // Make sure react-hot-toast is imported

import { notificationService } from '../../services/admin/notificationService'; // Corrected path (was 'admin' previously)

/**
 * Custom hook to manage fetching and real-time updates for user notifications.
 * @param {object} params - Query parameters for fetching notifications (e.g., { page, limit, read, seen })
 * @returns {object} - Contains notification data, loading states, and mutation functions.
 */
export const useNotifications = (params = {}) => {
  const queryClient = useQueryClient();
  const { socket } = useSocket();

  // Query to fetch paginated notifications
  const notificationsQuery = useQuery({
    queryKey: ['notifications', params], // Query key includes params for different filters
    queryFn: () => notificationService.fetch(params),
    enabled: true,
    staleTime: 1000 * 60,
    refetchOnWindowFocus: true,
    onError: (err) => {
      console.error("Error fetching notifications list:", err);
    }
  });

  // Query to fetch unread/unseen counts (e.g., for badge icons)
  const notificationCountsQuery = useQuery({
    queryKey: ['notificationCounts'],
    queryFn: notificationService.fetchCounts,
    staleTime: 1000 * 10,
    refetchInterval: 1000 * 30, // Poll for new counts every 30 seconds
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    onError: (err) => {
      console.error("Error fetching notification counts:", err);
    }
  });

  // --- Mutations for actions ---

  const markAsReadMutation = useMutation({
    mutationFn: (ids) => notificationService.markAsRead(ids),
    onSuccess: (data, variables) => {
      // Invalidate relevant notification lists after marking as read
      queryClient.invalidateQueries(['notifications']); // Invalidate all lists starting with 'notifications'
      queryClient.invalidateQueries(['notificationCounts']); // Invalidate counts
    },
    onError: (error) => {
      console.error("Failed to mark notifications as read:", error);
    },
  });

  const deleteNotificationsMutation = useMutation({
    mutationFn: (ids) => notificationService.delete(ids),
    onSuccess: (data, variables) => {
      // Invalidate relevant notification lists after deleting
      queryClient.invalidateQueries(['notifications']); // Invalidate all lists starting with 'notifications'
      queryClient.invalidateQueries(['notificationCounts']); // Invalidate counts
    },
    onError: (error) => {
      console.error("Failed to delete notifications:", error);
    },
  });

  // --- Socket Listeners for Real-time Updates ---
  const handleNewNotification = useCallback((newNotif) => {
    // When a new notification arrives, invalidate relevant queries to force a refetch.
    // This ensures the current list (regardless of its filter) and counts are updated.
    queryClient.invalidateQueries(['notifications']); // Forces refetch of all notification lists
    queryClient.invalidateQueries(['notificationCounts']); // Forces refetch of counts

    // Show a toast notification for the user
    toast.info(newNotif.message || newNotif.title || 'You have a new notification!');
  }, [queryClient]); // Dependencies: queryClient

  const handleNotificationsRead = useCallback(({ ids }) => {
    // When a read event is broadcast from backend, invalidate to ensure lists and counts update.
    queryClient.invalidateQueries(['notifications']);
    queryClient.invalidateQueries(['notificationCounts']);
  }, [queryClient]);

  const handleNotificationsSeen = useCallback(({ ids }) => {
    // When a seen event is broadcast from backend, invalidate to ensure lists and counts update.
    queryClient.invalidateQueries(['notifications']);
    queryClient.invalidateQueries(['notificationCounts']);
  }, [queryClient]);

  const handleNotificationsDeleted = useCallback(({ ids }) => {
    // When a delete event is broadcast from backend, invalidate to ensure lists and counts update.
    queryClient.invalidateQueries(['notifications']);
    queryClient.invalidateQueries(['notificationCounts']);
  }, [queryClient]);

  useEffect(() => {
    if (!socket) return;

    socket.on('newNotification', handleNewNotification);
    socket.on('notificationsRead', handleNotificationsRead);
    socket.on('notificationsSeen', handleNotificationsSeen);
    socket.on('notificationsDeleted', handleNotificationsDeleted);

    return () => {
      socket.off('newNotification', handleNewNotification);
      socket.off('notificationsRead', handleNotificationsRead);
      socket.off('notificationsSeen', handleNotificationsSeen);
      socket.off('notificationsDeleted', handleNotificationsDeleted);
    };
  }, [socket, handleNewNotification, handleNotificationsRead, handleNotificationsSeen, handleNotificationsDeleted]);

  return {
    notifications: notificationsQuery.data?.notifications || [],
    isLoading: notificationsQuery.isLoading,
    error: notificationsQuery.error,
    isFetching: notificationsQuery.isFetching,
    counts: notificationCountsQuery.data,
    markAsRead: (id) => markAsReadMutation.mutate(Array.isArray(id) ? id : [id]),
    markAllAsRead: () => markAsReadMutation.mutate('all'),
    deleteNotifications: deleteNotificationsMutation.mutate,
  };
};