// services/admin/analyticsService.js (or similar path)

import {
  fetchDashboardSummary,
  fetchIssueChartData,
  fetchProvincialPriorityZones
} from '../../api/admin/dashboardAnalyticsApi'; // Adjust path based on your project structure

/**
 * Service function to fetch the overall admin dashboard summary analytics.
 * Encapsulates the API call and provides error handling.
 *
 * @returns {Promise<Object>} A promise that resolves to the analytics data.
 * @throws {Object} An error object containing a message and potentially API response data.
 */
export const fetchDashboardSummaryService = async () => {
  try {
    const response = await fetchDashboardSummary();
            console.log(response.data);

    return response.data.data;
  } catch (err) {
    // Log the error for debugging purposes (optional)
    console.error("Error in fetchDashboardSummaryService:", err);
    throw err.response?.data || { message: 'Failed to fetch dashboard summary' };
  }
};

/**
 * Service function to fetch data for the "Resolved vs Reopened Issues" chart.
 * Encapsulates the API call and provides error handling.
 *
 * @param {string} period - The time period for the chart data (e.g., 'weekly', 'monthly', 'annually').
 * @returns {Promise<Object>} A promise that resolves to the chart data.
 * @throws {Object} An error object containing a message and potentially API response data.
 */
export const fetchIssueChartDataService = async (period) => {
  try {
    const response = await fetchIssueChartData(period);
        console.log(response.data);

    return response.data.data;

  } catch (err) {
    // Log the error for debugging purposes (optional)
    console.error("Error in fetchIssueChartDataService:", err);
    throw err.response?.data || { message: 'Failed to fetch issue chart data' };
  }
};

export const fetchProvincialPriorityZonesService = async () => {
  try {
    const response = await fetchProvincialPriorityZones(); // Call the raw API function
    console.log("fetchProvincialPriorityZonesService response:", response.data); // Added more descriptive log
    return response.data.data; // <--- Return the nested 'data' property
  } catch (err) {
    console.error("Error in fetchProvincialPriorityZonesService:", err);
    throw err.response?.data || { message: 'Failed to fetch provincial priority zones' };
  }
};

// You can add more admin analytics-related service functions here as needed