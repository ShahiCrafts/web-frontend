import React, { useState, useEffect } from "react";
import { ArrowUpRight, ArrowDownRight, MoreHorizontal, TrendingUp, TrendingDown, Activity, Users, CheckCircle, AlertCircle } from "lucide-react";

function MetricBox({ title, tag, count, change, isPositive, isFirst, icon, color, delay = 0 }) {
  const [animatedCount, setAnimatedCount] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Animate count on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      const numericCount = typeof count === 'string' ? parseInt(count.replace(/[^0-9]/g, '')) : count;
      const increment = numericCount / 30;
      let current = 0;
      
      const interval = setInterval(() => {
        current += increment;
        if (current >= numericCount) {
          setAnimatedCount(numericCount);
          clearInterval(interval);
        } else {
          setAnimatedCount(Math.floor(current));
        }
      }, 50);
      
      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timer);
  }, [count, delay]);

  const formatCount = (num) => {
    if (typeof count === 'string' && count.includes('k')) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  const changeColor = isPositive ? "text-emerald-500" : "text-red-500";
  const changeBgColor = isPositive ? "bg-emerald-50" : "bg-red-50";
  const iconBgColor = isPositive ? "bg-emerald-100" : "bg-red-100";

  return (
    <div 
      className={`w-full group cursor-pointer transition-all duration-300 ${
        isFirst ? "px-0 py-4 lg:py-0 lg:pl-0 lg:pr-8" : "px-0 py-4 lg:py-0 lg:px-8"
      } ${isHovered ? 'transform scale-105' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden">        
        {/* Header section */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${iconBgColor} transition-all duration-300 group-hover:scale-110`}>
              {React.cloneElement(icon, { size: 16, className: `${isPositive ? 'text-emerald-600' : 'text-red-600'}` })}
            </div>
            <div>
              <h3 className="text-sm text-gray-700 font-semibold mb-1 group-hover:text-gray-900 transition-colors">
                {title}
              </h3>
              <p className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full inline-block">
                {tag}
              </p>
            </div>
          </div>
        </div>

        {/* Metrics section */}
        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <p className="text-2xl font-bold text-gray-900 transition-all duration-300">
              {formatCount(animatedCount)}
            </p>
            <div className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${isPositive ? 'bg-emerald-500' : 'bg-red-500'} animate-pulse`}></div>
              <span className="text-xs text-gray-500 font-medium">
                {isPositive ? 'Trending up' : 'Trending down'}
              </span>
            </div>
          </div>
          
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${changeBgColor} transition-all duration-300 group-hover:shadow-md`}>
            <span className={`text-sm font-bold ${changeColor}`}>
              {isPositive ? '+' : ''}{change}%
            </span>
            <div className={`p-0.5 rounded-full ${isPositive ? 'bg-emerald-200' : 'bg-red-200'}`}>
              {isPositive ? (
                <ArrowUpRight className={`h-3 w-3 ${changeColor}`} />
              ) : (
                <ArrowDownRight className={`h-3 w-3 ${changeColor}`} />
              )}
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-3 w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
          <div 
            className={`h-full bg-gradient-to-r ${color} transition-all duration-1000 ease-out`}
            style={{ 
              width: `${Math.min(Math.abs(change) * 10, 100)}%`,
              animationDelay: `${delay}ms`
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}

export default function AnalyticsCard() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const metrics = [
    {
      title: "Issues Reported",
      tag: "All Time",
      count: "1.24k",
      change: 5.4,
      isPositive: true,
      icon: <AlertCircle />,
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "Issues Resolved",
      tag: "This Month",
      count: 120,
      change: -2.1,
      isPositive: false,
      icon: <CheckCircle />,
      color: "from-green-500 to-emerald-500"
    },
    {
      title: "Active Users",
      tag: "Online Now",
      count: "456",
      change: 1.2,
      isPositive: true,
      icon: <Users />,
      color: "from-purple-500 to-violet-500"
    },
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <Activity size={14} /> },
    { id: 'trends', label: 'Trends', icon: <TrendingUp size={14} /> },
  ];

  if (isLoading) {
    return (
      <div className="bg-white/80 backdrop-blur-sm px-6 py-6 rounded-2xl shadow-lg border border-gray-200/50 w-full mx-auto">
        <div className="animate-pulse">
          <div className="flex justify-between items-start mb-6">
            <div className="space-y-2">
              <div className="h-5 bg-gray-200 rounded w-48"></div>
              <div className="h-4 bg-gray-200 rounded w-64"></div>
            </div>
            <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
          </div>
          <div className="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-gray-200/80">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex-1 px-0 py-4 lg:py-0 lg:px-8">
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                  <div className="h-8 bg-gray-200 rounded w-20"></div>
                  <div className="h-2 bg-gray-200 rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm px-6 py-6 rounded-2xl shadow-lg border border-gray-200/50 w-full mx-auto hover:shadow-xl transition-all duration-300 group">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-r from-orange-500/10 to-purple-500/10">
              <Activity className="h-5 w-5 text-orange-500" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 group-hover:text-gray-800 transition-colors">
                Performance Dashboard
              </h2>
              <p className="text-sm text-gray-600">
                Real-time metrics and key performance indicators
              </p>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="flex gap-2 mt-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-orange-500 to-purple-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        
        <div className="relative">
          <button className="p-2 rounded-xl hover:bg-gray-100/80 transition-all duration-200 hover:scale-105 backdrop-blur-sm group">
            <MoreHorizontal className="h-5 w-5 text-gray-500 group-hover:text-gray-700" />
          </button>
        </div>
      </div>

      {/* Metrics container */}
      <div className="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-gray-200/50">
        {metrics.map((metric, idx) => (
          <MetricBox
            key={idx}
            title={metric.title}
            tag={metric.tag}
            count={metric.count}
            change={metric.change}
            isPositive={metric.isPositive}
            isFirst={idx === 0}
            icon={metric.icon}
            color={metric.color}
            delay={idx * 200}
          />
        ))}
      </div>

      {/* Footer insights */}
      <div className="mt-6 pt-4 border-t border-gray-200/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Live data • Updated 2 minutes ago</span>
          </div>
          <button className="text-sm text-orange-500 hover:text-orange-600 font-medium transition-colors">
            View detailed report →
          </button>
        </div>
      </div>
    </div>
  );
}