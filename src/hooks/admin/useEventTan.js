import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { eventService } from '../../services/admin/eventService';

export const useFetchEvents = (params) => {
  return useQuery({
    queryKey: ['events', params],
    queryFn: () => eventService.fetch(params),
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5,
  });
};

export const useFetchEventById = (id) => {
  return useQuery({
    queryKey: ['events', id],
    queryFn: () => eventService.getById(id),
    enabled: !!id,
  });
};

export const useCreateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (eventData) => eventService.create(eventData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
    onError: (error) => {
      console.error('Failed to create announcement:', error);
    },
  });
};

export const useUpdateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updateData }) => eventService.update(id, updateData),
    onSuccess: (updatedEvent, variables) => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.setQueryData(['events', variables.id], updatedEvent);
    },
    onError: (error, variables) => {
      console.error(`Failed to update announcement with id ${variables.id}:`, error);
    },
  });
};

export const useDeleteEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (eventId) => eventService.delete(eventId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
    onError: (error) => {
      console.error('Failed to delete announcement:', error);
    },
  });
};
