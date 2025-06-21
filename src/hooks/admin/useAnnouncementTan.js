import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { announcementService } from '../../services/admin/announcementService';

export const useFetchAnnouncements = (params) => {
  return useQuery({
    queryKey: ['announcements', params],
    queryFn: () => announcementService.fetch(params),
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5,
  });
};

export const useFetchAnnouncementById = (id) => {
  return useQuery({
    queryKey: ['announcements', id],
    queryFn: () => announcementService.getById(id),
    enabled: !!id,
  });
};

export const useCreateAnnouncement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (announcementData) => announcementService.create(announcementData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
    },
    onError: (error) => {
      console.error('Failed to create announcement:', error);
    },
  });
};

export const useUpdateAnnouncement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updateData }) => announcementService.update(id, updateData),
    onSuccess: (updatedAnnouncement, variables) => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
      queryClient.setQueryData(['announcements', variables.id], updatedAnnouncement);
    },
    onError: (error, variables) => {
      console.error(`Failed to update announcement with id ${variables.id}:`, error);
    },
  });
};

export const useDeleteAnnouncement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (announcementId) => announcementService.delete(announcementId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
    },
    onError: (error) => {
      console.error('Failed to delete announcement:', error);
    },
  });
};
