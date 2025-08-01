import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationTemplateService } from "../../services/admin/notificationTemplateService";
import toast from "react-hot-toast";

export const useFetchNotificationTemplates = (params = {}) => {
  return useQuery({
    queryKey: ["notificationTemplates", params],
    queryFn: () => notificationTemplateService.fetch(params),
    keepPreviousData: true,
  });
};

export const useCreateNotificationTemplate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (templateData) =>
      notificationTemplateService.create(templateData),
    onSuccess: () => {
      toast.success("Notification template created successfully!");
      queryClient.invalidateQueries({ queryKey: ["notificationTemplates"] });
    },
    onError: (error) => {
      console.error("Failed to create template:", error);
      toast.error(error.message || "Failed to create template.");
    },
  });
};

export const useUpdateNotificationTemplate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, templateData }) =>
      notificationTemplateService.update(id, templateData),
    onSuccess: () => {
      toast.success("Notification template updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["notificationTemplates"] });
    },
    onError: (error) => {
      console.error("Failed to update template:", error);
      toast.error(error.message || "Failed to update template.");
    },
  });
};

export const useDeleteNotificationTemplate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => notificationTemplateService.delete(id),
    onSuccess: () => {
      toast.success("Notification template deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["notificationTemplates"] });
    },
    onError: (error) => {
      console.error("Failed to delete template:", error);
      toast.error(error.message || "Failed to delete template.");
    },
  });
};
