import instance from "../api"; // Assuming '../api' exports your Axios instance

const ADMIN_ANALYTICS_URL = "admin/dashboard"; // Base URL for admin analytics endpoints

/**
 * Fetches the overall admin dashboard summary analytics.
 * This includes total issues reported, issues resolved, total user count,
 * and user growth/downfall rate.
 *
 * @returns {Promise<AxiosResponse>} A promise that resolves to the API response.
 */
export const fetchDashboardSummary = () => {
  return instance.get(`/${ADMIN_ANALYTICS_URL}/dashboard-summary`);
};

/**
 * Fetches data for the "Resolved vs Reopened Issues" chart.
 *
 * @param {string} period - The time period for the chart data (e.g., 'weekly', 'monthly', 'annually').
 * @returns {Promise<AxiosResponse>} A promise that resolves to the API response containing chart data.
 */
export const fetchIssueChartData = (period = "monthly") => {
  return instance.get(`/${ADMIN_ANALYTICS_URL}/issue-chart-data`, {
    params: { period },
  });
};

export const fetchProvincialPriorityZones = async () => {
  return instance.get(`/${ADMIN_ANALYTICS_URL}/priority-zones`);
};
