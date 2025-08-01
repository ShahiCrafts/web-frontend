import React from 'react';
import Card from './Card';
import { FileText, CheckCircle, Eye, TrendingUp, BarChart, PieChart } from 'lucide-react';
import { useGetContentStats } from '../../../hooks/useReportContentHook'; // Adjust path accordingly

export default function ContentAnalytics() {
  const { data, isLoading, isError } = useGetContentStats();

  if (isLoading) return <p>Loading content analytics...</p>;
  if (isError) return <p>Failed to load content analytics.</p>;

  // Fallbacks or formatted values
  const totalContent = data?.totalPosts ?? 0;
  const published = data?.publishedPosts ?? 0;
  const totalShares = data?.totalShares ?? 0;
  const engagementPercent = data?.engagementPerPost ?? '0.0';

  // Use actual data from API response
  const topContent = data?.topContent || [];
  const categoryDistribution = data?.categoryDistribution || [];

  return (
    <div className="space-y-8">
      {/* Top Level Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card title="Total Content" value={totalContent} details="+3 last week" icon={<FileText size={18} />} />
        <Card title="Published" value={published} details="Active content" icon={<CheckCircle size={18} />} />
        <Card title="Total Shares" value={totalShares.toLocaleString()} details="Across all content" icon={<Eye size={18} />} />
        <Card title="Engagement" value={`${engagementPercent}`} details="Engagement per post" icon={<TrendingUp size={18} />} />
      </div>

      {/* Performance and Category Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section>
          <header className="mb-4">
            <h2 className="text-base font-semibold text-gray-800 flex items-center gap-2">
              <BarChart className="w-5 h-5" style={{ color: '#FF5C00' }} />
              Content Performance
            </h2>
            <p className="text-sm text-gray-500 mt-1">Top content by engagement.</p>
          </header>
          <ul className="space-y-3">
            {topContent.length > 0 ? (
              topContent.map((item, index) => (
                <li key={item._id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50">
                  <span className="bg-gray-100 text-gray-600 text-sm font-bold rounded-full w-8 h-8 flex items-center justify-center">{index + 1}</span>
                  <div className="flex-1">
                    <p className="font-medium text-sm text-gray-800">{item.title}</p>
                  </div>
                  <div className="text-sm text-gray-600">{item.engagement} engagements</div>
                </li>
              ))
            ) : (
              <p className="text-sm text-gray-500">No top content data available.</p>
            )}
          </ul>
        </section>
        <section>
          <header className="mb-4">
            <h2 className="text-base font-semibold text-gray-800 flex items-center gap-2">
              <PieChart className="w-5 h-5" style={{ color: '#FF5C00' }} />
              Content by Category
            </h2>
            <p className="text-sm text-gray-500 mt-1">Distribution of content.</p>
          </header>
          <div className="space-y-4">
            {categoryDistribution.length > 0 ? (
              categoryDistribution.map((cat) => (
                <div key={cat.categoryName}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700">{cat.categoryName}</span>
                    <span className="text-gray-500">{cat.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="h-2 rounded-full" style={{ width: `${cat.percentage}%`, backgroundColor: '#FF5C00' }}></div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No category distribution data available.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
