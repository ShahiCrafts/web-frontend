import { ArrowUpRight, ArrowDownRight, MoreHorizontal } from "lucide-react";

function MetricBox({ title, tag, count, change, isPositive, isFirst }) {
  const changeColor = isPositive ? "text-green-500" : "text-red-500";

  const paddingClasses = isFirst
    ? "px-0 py-2 lg:py-0 lg:pl-0 lg:px-8"
    : "px-0 py-2 lg:py-0 lg:px-8";

  return (
    <div className={`w-full ${paddingClasses}`}>
      <h3 className="text-sm text-gray-500 font-medium mb-1">{title}</h3>
      <p className="text-xs text-gray-400 mb-2">{tag}</p>

      <div className="flex justify-between items-baseline">
        <p className="text-xl font-semibold text-gray-800">{count}</p>
        <div className={`flex items-center gap-x-1 text-[15px] font-semibold ${changeColor}`}>
          <span>{Math.abs(change)}%</span>
          {isPositive ? (
            <ArrowUpRight className="h-5 w-5" />
          ) : (
            <ArrowDownRight className="h-5 w-5" />
          )}
        </div>
      </div>
    </div>
  );
}


export default function DashboardCard() {
  const metrics = [
    {
      title: "Total Reported Issues",
      tag: "All",
      count: "1,24k",
      change: 5.4,
      isPositive: true,
    },
    {
      title: "Issues Resolved",
      tag: "All",
      count: 120,
      change: -2.1,
      isPositive: false,
    },
    {
      title: "Active Users",
      tag: "All",
      count: "456",
      change: 1.2,
      isPositive: true,
    },
  ];

  return (
    <div className="bg-white px-5 py-5 rounded-xl shadow-md w-full mx-auto">
      {/* Header */}
      <div className="flex justify-between items-start mb-4 md:mb-6">
        <div>
          <h2 className="text-base font-semibold text-gray-800 mb-1">Performance Summary</h2> {/* ~16px */}
          <p className="text-sm text-gray-500">
            View key profile performance metrics from the reporting
          </p> {/* ~14px */}
        </div>
        <button className="p-1 rounded-full hover:bg-gray-100 transition-colors">
          <MoreHorizontal className="h-5 w-5 text-gray-500" />
        </button>
      </div>

      {/* Metrics container */}
      <div className="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-gray-200/80">
        {metrics.map((metric, idx) => (
          <MetricBox
            key={idx}
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
