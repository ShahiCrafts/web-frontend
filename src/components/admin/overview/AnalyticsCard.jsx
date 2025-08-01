import { ArrowUpRight, ArrowDownRight, MoreHorizontal } from "lucide-react";
import { useDashboardSummary } from "../../../hooks/admin/useDashboardAnalyticsHook"; // Ensure this path is correct

// Helper function for formatting numbers (e.g., 12345 to "12.35k" or "12,345")
const formatCount = (num) => {
  // Return "N/A" if the number is null or undefined
  if (num === null || num === undefined) return "N/A";
  // If it's not a number (e.g., already a formatted string), return it as is
  if (typeof num !== 'number') return String(num);

  // Format numbers greater than or equal to 1 million with "M" suffix
  if (num >= 1000000) {
    return (num / 1000000).toFixed(2) + "M";
  }
  // Format numbers greater than or equal to 1 thousand with "k" suffix
  if (num >= 1000) {
    return (num / 1000).toFixed(2) + "k";
  }
  // For smaller numbers (including 0), use locale-specific formatting (e.g., adds commas)
  return num.toLocaleString();
};


/**
 * MetricBox component displays a single metric with its title, tag, count,
 * and an optional change percentage with an arrow indicator.
 * @param {object} props - Component props.
 * @param {string} props.title - The main title of the metric.
 * @param {string} props.tag - A descriptive tag for the metric.
 * @param {string|number} props.count - The numerical value of the metric.
 * @param {number|null} props.change - The percentage change, or null if not applicable.
 * @param {boolean} props.isPositive - True if the change is positive, false otherwise.
 * @param {boolean} props.isFirst - True if this is the first MetricBox in a series, used for styling.
 */
function MetricBox({ title, tag, count, change, isPositive, isFirst }) {
  // Format the change percentage, ensuring it's a number before Math.abs
  const displayChange = typeof change === 'number' ? Math.abs(change).toFixed(1) : 'N/A';
  // Determine text color based on whether the change is positive or negative
  const changeColor = isPositive ? "text-green-500" : "text-red-500";

  // Apply specific padding classes for the first metric box to adjust layout
  const paddingClasses = isFirst
    ? "px-0 py-2 lg:py-0 lg:pl-0 lg:pr-8"
    : "px-0 py-2 lg:py-0 lg:px-8";

  return (
    <div className={`w-full ${paddingClasses}`}>
      <h3 className="text-sm text-gray-500 font-medium mb-1">{title}</h3>
      <p className="text-xs text-gray-400 mb-2">{tag}</p>

      <div className="flex justify-between items-baseline">
        <p className="text-xl font-semibold text-gray-800">{count}</p>
        {/* Conditionally render the change percentage and icon if 'change' is a valid number */}
        {typeof change === 'number' ? (
          <div className={`flex items-center gap-x-1 text-[15px] font-semibold ${changeColor}`}>
            <span>{displayChange}%</span>
            {isPositive ? (
              <ArrowUpRight className="h-5 w-5" />
            ) : (
              <ArrowDownRight className="h-5 w-5" />
            )}
          </div>
        ) : (
          // Render "N/A" and a horizontal ellipsis icon if change is not applicable
          <div className="flex items-center gap-x-1 text-[15px] font-semibold text-gray-500">
            <span>N/A</span>
            <MoreHorizontal className="h-5 w-5" />
          </div>
        )}
      </div>
    </div>
  );
}


/**
 * DashboardCard component displays a summary of key performance metrics
 * for the admin dashboard, fetching data using TanStack Query.
 */
export default function DashboardCard() {
  const { data: summaryData, isLoading, isError, error } = useDashboardSummary();

  // IMPORTANT: Ensure summaryData.data is accessed correctly, as per previous debugging
  // Your backend now returns data in summaryData.data.issues and summaryData.data.users
  const issuesData = summaryData?.issues || {}; // Corrected access
  const usersData = summaryData?.users || {};   // Corrected access

  const metrics = [
    {
      title: "Total Reported Issues",
      tag: "Overall",
      count: formatCount(issuesData.totalReported ?? 0),
      // Use the new reportedGrowthRate from the backend
      change: issuesData.reportedGrowthRate ? parseFloat(issuesData.reportedGrowthRate) : null,
      // Determine positivity based on the reportedGrowthRate
      isPositive: issuesData.reportedGrowthRate ? parseFloat(issuesData.reportedGrowthRate) > 0 : true,
    },
    {
      title: "Issues Resolved",
      tag: "Overall",
      count: formatCount(issuesData.resolved ?? 0),
      // Use the new resolvedGrowthRate from the backend
      change: issuesData.resolvedGrowthRate ? parseFloat(issuesData.resolvedGrowthRate) : null,
      // Determine positivity based on the resolvedGrowthRate
      isPositive: issuesData.resolvedGrowthRate ? parseFloat(issuesData.resolvedGrowthRate) > 0 : true,
    },
    {
      title: "Total Users",
      tag: "Overall",
      count: formatCount(usersData.totalUsers ?? 0),
      change: usersData.growthRate ? parseFloat(usersData.growthRate) : null,
      isPositive: usersData.growthRate ? parseFloat(usersData.growthRate) > 0 : true,
    },
  ];

  if (isLoading) {
    return (
      <div className="bg-white px-5 py-5 rounded-xl shadow-md w-full mx-auto animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-6"></div>
        <div className="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-gray-200/80">
          <div className="w-full h-20 bg-gray-200 rounded-lg px-0 py-2 lg:py-0 lg:pl-0 lg:pr-8"></div>
          <div className="w-full h-20 bg-gray-200 rounded-lg px-0 py-2 lg:py-0 lg:px-8"></div>
          <div className="w-full h-20 bg-gray-200 rounded-lg px-0 py-2 lg:py-0 lg:px-8"></div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-white px-5 py-5 rounded-xl shadow-md w-full mx-auto text-red-600">
        <h2 className="text-base font-semibold mb-2">Error Loading Dashboard</h2>
        <p className="text-sm">Failed to load performance summary: {error?.message || 'Unknown error'}</p>
        <p className="text-xs text-gray-500 mt-2">Please try refreshing the page.</p>
      </div>
    );
  }

  return (
    <div className="bg-white px-5 py-5 rounded-xl shadow-md w-full mx-auto">
      <div className="flex justify-between items-start mb-4 md:mb-6">
        <div>
          <h2 className="text-base font-semibold text-gray-800 mb-1">Performance Summary</h2>
          <p className="text-sm text-gray-500">
            View key profile performance metrics from the reporting
          </p>
        </div>
        <button className="p-1 rounded-full hover:bg-gray-100 transition-colors">
          <MoreHorizontal className="h-5 w-5 text-gray-500" />
        </button>
      </div>

      <div className="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-gray-200/80">
        {metrics.map((metric, idx) => (
          <MetricBox
            key={metric.title}
            title={metric.title}
            tag={metric.tag}
            count={metric.count}
            change={metric.change}
            isPositive={metric.isPositive}
            isFirst={idx === 0}
          />
        ))}
      </div>
    </div>
  );
}