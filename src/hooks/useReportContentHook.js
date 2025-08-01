import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useCallback } from "react";
import { useSocket } from "../context/SocketProvider";

import {
  listReportsService,
  reviewReportService,
  getContentStatsService,
  getAllContentsService
} from "../services/reportContentService";

export const useListReports = (params = {}) => {
  return useQuery({
    queryKey: ["reports", params],
    queryFn: () => listReportsService(params),
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5,
  });
};

export const useReviewReport = () => {
  const queryClient = useQueryClient();
  const { socket } = useSocket();

  const handleReportReviewed = useCallback(
    (updatedReport) => {
      queryClient.setQueryData(["reports", updatedReport._id], updatedReport);
      queryClient.invalidateQueries({ queryKey: ["reports"] });
    },
    [queryClient]
  );

  useEffect(() => {
    if (!socket) return;
    socket.on("reportReviewed", handleReportReviewed);
    return () => {
      socket.off("reportReviewed", handleReportReviewed);
    };
  }, [socket, handleReportReviewed]);

  return useMutation({
    mutationFn: ({ reportId, reviewData }) =>
      reviewReportService(reportId, reviewData),
    onSuccess: (updatedReport) => {
      queryClient.setQueryData(["reports", updatedReport._id], updatedReport);
      queryClient.invalidateQueries({ queryKey: ["reports"] });
    },
    onError: (error) => {
      console.error("Failed to review report:", error);
    },
  });
};

export const useGetContentStats = () => {
  return useQuery({
    queryKey: ["contentStats"],
    queryFn: getContentStatsService,
    staleTime: 1000 * 60 * 5,
  });
};

export const useGetAllContents = (params) => {
  return useQuery({
    queryKey: ["allContents", params],
    queryFn: () => {
      console.log("TanStack Query: useGetAllContents queryFn is being called.");
      return getAllContentsService(params);
    },
    // The default staleTime might be causing the issue. Let's make it 0 for testing.
    staleTime: 0, 
    // This is explicitly setting refetching behavior.
    refetchOnMount: "always",
    refetchOnWindowFocus: false,
    keepPreviousData: true,
  });
};