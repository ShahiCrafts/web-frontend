import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { categoryService } from "../../services/admin/categoryService";

export const useFetchCategories = (params) => {
  return useQuery({
    queryKey: ["categories", params],
    queryFn: () => categoryService.fetch(params),
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5,
  });
};

export const useFetchCategoryById = (id) => {
  return useQuery({
    queryKey: ["categories", id],
    queryFn: () => categoryService.getById(id),
    enabled: !!id,
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (categoryData) => categoryService.create(categoryData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error) => {
      console.error("Failed to create category:", error);
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updateData }) => categoryService.update(id, updateData),
    onSuccess: (updatedCategory, variables) => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.setQueryData(["categories", variables.id], updatedCategory);
    },
    onError: (error, variables) => {
      console.error(
        `Failed to update category with id ${variables.id}:`,
        error
      );
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (categoryId) => categoryService.delete(categoryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error) => {
      console.error("Failed to delete category:", error);
    },
  });
};
