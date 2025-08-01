import React, { useState, useMemo } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts';
import { ArrowUpRight, ArrowDownRight, MoreHorizontal } from 'lucide-react';

// Import the hook
import { useIssueChartData } from "../../../hooks/admin/useDashboardAnalyticsHook";

// --- Helper Components ---

const CardHeader = ({ timeFrame, setTimeFrame }) => (
  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
    <div>
      <h2 className="text-base font-semibold text-gray-800 mb-1">Resolved vs Reported Issues</h2>
      <p className="text-sm text-gray-500 mt-1">Track reliability of resolutions</p>
    </div>
    <div className="mt-3 sm:mt-0">
      <TimeFrameToggle selected={timeFrame} onSelect={setTimeFrame} />
    </div>
  </div>
);

const TimeFrameToggle = ({ selected, onSelect }) => {
  // Map display options to the backend period strings
  const options = [
    { label: 'Weekly', value: 'weekly' },
    { label: 'Monthly', value: 'monthly' },
    { label: 'Annually', value: 'annually' },
  ];

  return (
    <div className="flex items-center bg-gray-100 p-1 rounded-lg">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onSelect(option.value)}
          className={`px-3 py-1 text-sm font-medium rounded-md transition
            ${selected === option.value
              ? 'bg-white text-gray-800 shadow-sm'
              : 'bg-transparent text-gray-600 hover:bg-gray-200'
            }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

const StatsCard = ({ title, count, percentage, period }) => {
  const numericPercentage = typeof percentage === 'string' ? parseFloat(percentage) : percentage;

  const isPositive = numericPercentage > 0;
  const colorClass = isPositive ? 'text-green-500' : (numericPercentage < 0 ? 'text-red-500' : 'text-gray-500');
  const Icon = isPositive ? ArrowUpRight : (numericPercentage < 0 ? ArrowDownRight : MoreHorizontal);
  const bgColorClass = isPositive ? 'bg-green-100' : (numericPercentage < 0 ? 'bg-red-100' : 'bg-gray-200');

  const displayPercentage = typeof numericPercentage === 'number' && !isNaN(numericPercentage)
    ? `${Math.abs(numericPercentage).toFixed(1)}%`
    : 'N/A';

  return (
    <div className="flex-1">
      <div className="flex items-center gap-x-6">
        <h2 className="text-sm font-semibold text-gray-600">{title}</h2>
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[13px] font-semibold ${colorClass} ${bgColorClass}`}
        >
          {displayPercentage}
          <Icon className="h-3.5 w-3.5 ml-1" />
        </span>
      </div>
      <div className="mt-1">
        <p className="text-xl font-semibold text-gray-900 mb-1">
          {typeof count === 'number' ? count.toLocaleString() : 'N/A'}
        </p>
        <p className="text-xs text-gray-500">Avg. {period.toLowerCase()} reports</p>
      </div>
    </div>
  );
};

// --- Main Component ---

export default function StatisticsCard() {
  const [timeFrame, setTimeFrame] = useState('monthly'); // Initial state for the time frame

  // Fetch data using the hook, passing the current timeFrame
  const { data: chartAnalyticsData, isLoading, isError, error } = useIssueChartData(timeFrame);

  // Memoize formatted chart data to prevent unnecessary re-renders
  const formattedChartData = useMemo(() => {
    // Return an empty array if data is not available or an error occurred
    if (isLoading || isError || !chartAnalyticsData?.chartData) return [];
    return chartAnalyticsData.chartData;
  }, [chartAnalyticsData, isLoading, isError]);

  // Extract issuedStats and resolvedStats, providing default empty objects
  const issuedStats = chartAnalyticsData?.issuedStats || {};
  const resolvedStats = chartAnalyticsData?.resolvedStats || {};

  // Dynamic Y-Axis Domain Calculation for chart visibility
  const yAxisDomain = useMemo(() => {
    if (!formattedChartData || formattedChartData.length === 0) {
      return [0, 5]; // Default domain if no data
    }

    const maxDataValue = formattedChartData.reduce((max, entry) => {
      return Math.max(max, entry.issued || 0, entry.resolved || 0);
    }, 0);

    if (maxDataValue === 0) {
      return [0, 5]; // If all data points are 0, still show a small range
    }

    return [0, Math.ceil(maxDataValue * 1.2 / 5) * 5 || 10]; // Scale with a buffer, round up to nearest 5 or default to 10
  }, [formattedChartData]);


  // Conditional rendering for loading state
  if (isLoading) {
    return (
      <div className="w-full bg-white p-5 sm:p-6 rounded-xl shadow-md animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="flex flex-col sm:flex-row gap-6 mt-4 border-t border-gray-100 pt-4">
          <div className="flex-1 h-20 bg-gray-200 rounded"></div>
          <div className="flex-1 h-20 bg-gray-200 rounded"></div>
        </div>
        <div className="h-64 bg-gray-200 rounded mt-6"></div>
      </div>
    );
  }

  // Conditional rendering for error state
  if (isError) {
    return (
      <div className="w-full bg-white p-5 sm:p-6 rounded-xl shadow-md text-red-600">
        <h2 className="text-base font-semibold mb-2">Error Loading Chart Data</h2>
        <p className="text-sm">Failed to load chart analytics: {error?.message || 'Unknown error'}</p>
        <p className="text-xs text-gray-500 mt-2">Please try refreshing the page or checking the backend logs.</p>
      </div>
    );
  }

  // Main render function
  return (
    <div className="w-full bg-white p-5 sm:p-6 rounded-xl shadow-md">
      <CardHeader
        timeFrame={timeFrame}
        setTimeFrame={setTimeFrame}
      />

      <div className="flex flex-col sm:flex-row gap-6 mt-4 border-t border-gray-100 pt-4">
        <StatsCard
          title="Issued"
          count={issuedStats.total ?? 0}
          percentage={issuedStats.percentageChange ?? 0}
          period={timeFrame}
        />
        <StatsCard
          title="Resolved"
          count={resolvedStats.total ?? 0}
          percentage={resolvedStats.percentageChange ?? 0}
          period={timeFrame}
        />
      </div>

      <div className="h-64 w-full mt-6">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={formattedChartData}
            margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 12, fill: '#6b7280' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: '#6b7280' }}
              axisLine={false}
              tickLine={false}
              domain={yAxisDomain} // Apply the dynamically calculated domain
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
              }}
              labelStyle={{ fontWeight: '500', color: '#374151', fontSize: 12 }}
              itemStyle={{ padding: '0.1rem 0', fontSize: 12 }}
            />
            <Line
              type="monotone"
              dataKey="issued"
              stroke="#3b82f6"
              strokeWidth={2.5}
              dot={{ r: 3, fill: '#3b82f6', strokeWidth: 1.5, stroke: '#fff' }}
              activeDot={{ r: 4, fill: '#3b82f6', strokeWidth: 1.5, stroke: '#fff' }}
              name="Reported"
            />
            <Line
              type="monotone"
              dataKey="resolved"
              stroke="#d1d5db"
              strokeWidth={2.5}
              dot={{ r: 3, fill: '#d1d5db', strokeWidth: 1.5, stroke: '#fff' }}
              activeDot={{ r: 4, fill: '#d1d5db', strokeWidth: 1.5, stroke: '#fff' }}
              name="Resolved"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}