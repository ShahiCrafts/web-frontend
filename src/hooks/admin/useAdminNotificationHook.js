import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminNotificationService } from '../../services/admin/adminNotificationService'; // Adjust path
import toast from 'react-hot-toast';

/**
 * Hook to fetch a paginated, filtered, and searchable list of admin-created notifications.
 *
 * @param {object} params - Query parameters for fetching notifications.
 */
export const useFetchAllAdminNotifications = (params = {}) => {
  return useQuery({
    queryKey: ['adminNotifications', params], // Unique key for the admin notifications list
    queryFn: () => adminNotificationService.fetch(params),
    keepPreviousData: true,
  });
};

/**
 * Hook to create and send a new notification immediately.
 * Invalidates the 'adminNotifications' query upon success.
 */
export const useCreateAndSendNotification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (notificationData) => adminNotificationService.send(notificationData),
    onSuccess: () => {
      toast.success("Notification sent successfully!");
      queryClient.invalidateQueries({ queryKey: ['adminNotifications'] });
    },
    onError: (error) => {
      console.error("Failed to send notification:", error);
      toast.error(error.message || "Failed to send notification.");
    },
  });
};

/**
 * Hook to schedule a new notification.
 * Invalidates the 'adminNotifications' query upon success.
 */
export const useScheduleNotification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (notificationData) => adminNotificationService.schedule(notificationData),
    onSuccess: () => {
      toast.success("Notification scheduled successfully!");
      queryClient.invalidateQueries({ queryKey: ['adminNotifications'] });
    },
    onError: (error) => {
      console.error("Failed to schedule notification:", error);
      toast.error(error.message || "Failed to schedule notification.");
    },
  });
};