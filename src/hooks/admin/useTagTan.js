import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { tagService } from "../../services/admin/tagService";

export const useFetchTags = (params) => {
  return useQuery({
    queryKey: ["tags", params],
    queryFn: () => tagService.fetch(params),
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5,
  });
};

export const useFetchTagById = (id) => {
  return useQuery({
    queryKey: ["tags", id],
    queryFn: () => tagService.getById(id),
    enabled: !!id,
  });
};

export const useCreateTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (tagData) => tagService.create(tagData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
    },
    onError: (error) => {
      console.error("Failed to create tag:", error);
    },
  });
};

export const useUpdateTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updateData }) => tagService.update(id, updateData),
    onSuccess: (updatedTag, variables) => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
      queryClient.setQueryData(["tags", variables.id], updatedTag);
    },
    onError: (error, variables) => {
      console.error(`Failed to update tag with id ${variables.id}:`, error);
    },
  });
};

export const useDeleteTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (tagId) => tagService.delete(tagId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
    },
    onError: (error) => {
      console.error("Failed to delete tag:", error);
    },
  });
};
