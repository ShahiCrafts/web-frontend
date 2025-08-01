import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { eventService } from '../../services/admin/eventService'; // Adjust path to your eventService.js

/**
 * Hook to fetch a paginated, filtered, and searchable list of events.
 *
 * @param {Object} params - Query parameters for events:
 * - `page`: Current page number (default: 1)
 * - `limit`: Number of items per page (default: 10)
 * - `search`: Search term for event details
 * - `sortBy`: Field to sort by (e.g., 'eventStartDate', 'title')
 * - `sortOrder`: Sort direction ('asc' or 'desc')
 * - `status`: Filter by calculated event status ('Upcoming', 'Ongoing', 'Closed')
 * - `categoryId`: Filter by category ID
 */
export const useFetchEvents = (params) => {
  return useQuery({
    queryKey: ['events', params],
    queryFn: () => eventService.fetch(params),
    keepPreviousData: true, // Keep old data while fetching new (good for pagination/filters)
    staleTime: 1000 * 60 * 1, // Data considered fresh for 1 minute
  });
};

/**
 * Hook to fetch a single event by its ID.
 *
 * @param {string} eventId - The ID of the event.
 */
export const useFetchEventById = (eventId) => {
  return useQuery({
    queryKey: ['event', eventId],
    queryFn: () => eventService.getById(eventId),
    enabled: !!eventId, // Only run query if eventId is provided
    staleTime: 1000 * 60 * 5, // Data considered fresh for 5 minutes
  });
};

/**
 * Hook to create a new event.
 * Invalidates the 'events' query upon success to automatically update the list.
 */
export const useCreateEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (eventData) => eventService.create(eventData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
    onError: (error) => {
      console.error('Failed to create event:', error);
    },
  });
};

/**
 * Hook to update an existing event.
 * Invalidates the specific event and the overall events list upon success.
 */
export const useUpdateEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ eventId, updateData }) => eventService.update(eventId, updateData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['event', variables.eventId] });
    },
    onError: (error, variables) => {
      console.error(`Failed to update event (id: ${variables.eventId}):`, error);
    },
  });
};

/**
 * Hook to delete an event.
 * Invalidates the 'events' query upon success.
 */
export const useDeleteEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (eventId) => eventService.delete(eventId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
    onError: (error, variables) => {
      console.error(`Failed to delete event (id: ${variables}):`, error);
    },
  });
};