// hooks/admin/useAdminAnalytics.js (or similar path)

import { useQuery } from "@tanstack/react-query";
// No need for useMutation, useEffect, useCallback, useSocket here as these are
// pure data fetching hooks for analytics, not actions that change server state or rely on sockets directly.

import {
  fetchDashboardSummaryService,
  fetchIssueChartDataService,
  fetchProvincialPriorityZonesService
} from "../../services/admin/dashboardAnalyticsService"; // Adjust path to your admin analytics services

/**
 * Hook for fetching the overall admin dashboard summary analytics.
 * This includes total issues reported, issues resolved, total user count,
 * and user growth/downfall rate.
 *
 * @returns {object} An object containing the query result (data, isLoading, isError, error, etc.).
 */
export const useDashboardSummary = () => {
  return useQuery({
    queryKey: ["admin", "dashboardSummary"], // Unique key for this query
    queryFn: fetchDashboardSummaryService, // The service function that makes the API call
    staleTime: 1000 * 60 * 5, // Data considered fresh for 5 minutes, after which it can be refetched in the background
    // refetchOnWindowFocus: true, // You might want to refetch less often for admin dashboards
    // refetchOnMount: true,
  });
};

/**
 * Hook for fetching data for the "Resolved vs Reopened Issues" chart.
 *
 * @param {string} period - The time period for the chart data (e.g., 'weekly', 'monthly', 'annually').
 * @param {boolean} enabled - Whether the query should run. Defaults to true.
 * @returns {object} An object containing the query result (data, isLoading, isError, error, etc.).
 */
export const useIssueChartData = (period = 'monthly', enabled = true) => {
  return useQuery({
    queryKey: ["admin", "issueChartData", period], // Key includes 'period' so it refetches when period changes
    queryFn: () => fetchIssueChartDataService(period), // Pass the period to the service function
    enabled: enabled, // Only run the query if 'enabled' is true
    staleTime: 1000 * 60 * 10, // Data considered fresh for 10 minutes
    keepPreviousData: true, // Keep the last successful data while fetching new data (good for chart transitions)
  });
};

export const useProvincialPriorityZones = () => {
  return useQuery({
    queryKey: ["admin", "provincialPriorityZones"], // Unique key for this query
    queryFn: fetchProvincialPriorityZonesService, // The service function that makes the API call
    staleTime: 1000 * 60 * 30, // Data considered fresh for 30 minutes (less frequent updates typical for this type of data)
  });
};

// Example of how you might use these in a React component:
/*
import React from 'react';
import { useDashboardSummary, useIssueChartData } from './hooks/admin/useAdminAnalytics';

function AdminDashboard() {
  const { data: summaryData, isLoading: summaryLoading, error: summaryError } = useDashboardSummary();
  const [chartPeriod, setChartPeriod] = React.useState('monthly');
  const { data: chartData, isLoading: chartLoading, error: chartError } = useIssueChartData(chartPeriod);

  if (summaryLoading || chartLoading) return <div>Loading analytics...</div>;
  if (summaryError) return <div>Error loading summary: {summaryError.message}</div>;
  if (chartError) return <div>Error loading chart: {chartError.message}</div>;

  return (
    <div>
      <h1>Admin Dashboard</h1>

      <section>
        <h2>Overall Metrics</h2>
        {summaryData && (
          <div>
            <p>Total Issues Reported: {summaryData.issues.totalReported}</p>
            <p>Issues Resolved: {summaryData.issues.resolved}</p>
            <p>Total Users: {summaryData.users.totalUsers}</p>
            <p>User Growth Rate (last 30 days): {summaryData.users.growthRate}% ({summaryData.users.growthChange})</p>
          </div>
        )}
      </section>

      <section>
        <h2>Resolved vs. Issued Issues</h2>
        <div>
          <button onClick={() => setChartPeriod('weekly')}>Weekly</button>
          <button onClick={() => setChartPeriod('monthly')}>Monthly</button>
          <button onClick={() => setChartPeriod('annually')}>Annually</button>
        </div>
        {chartData && (
          // Render your chart component here, passing chartData.chartData
          // and chartData.issuedStats, chartData.resolvedStats for the totals/percentages
          <pre>{JSON.stringify(chartData, null, 2)}</pre>
        )}
      </section>
    </div>
  );
}

export default AdminDashboard;
*/