import React from 'react';
import {
  Building,
  CheckCircle2,
  User,
  HardDrive,
} from 'lucide-react';

const StatCard = ({ title, value, change, icon: Icon, color }) => (
  <div className="bg-white border border-gray-200 p-5 rounded-lg shadow-sm">
    <div className="flex items-center justify-between">
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <Icon className={`w-6 h-6 ${color}`} />
    </div>
    <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
    {change && <p className="text-sm text-gray-500 mt-1">{change}</p>}
  </div>
);

export default function TenantAnalytics() {
  // Tenant growth sample data (month + value)
  const tenantGrowthData = [
    { month: 'Jan', value: 12 },
    { month: 'Feb', value: 15 },
    { month: 'Mar', value: 18 },
    { month: 'Apr', value: 22 },
    { month: 'May', value: 25 },
    { month: 'Jun', value: 28 },
  ];

  const max = Math.max(...tenantGrowthData.map(d => d.value));

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Tenants"
          value="28"
          change="+2 from last month"
          icon={Building}
          color="text-blue-500"
        />
        <StatCard
          title="Active Tenants"
          value="25"
          change="Currently active"
          icon={CheckCircle2}
          color="text-green-500"
        />
        <StatCard
          title="Total Users"
          value="20,080"
          change="Across all tenants"
          icon={User}
          color="text-purple-500"
        />
        <StatCard
          title="Storage Used"
          value="5.3GB"
          change="Total usage"
          icon={HardDrive}
          color="text-orange-500"
        />
      </div>

      {/* Tenant Growth Bar Chart */}
      <div className="bg-white border border-gray-200 p-5 rounded-lg shadow-sm">
        <h3 className="font-semibold text-gray-800 mb-4">Tenant Growth Over Time</h3>
        <div className="flex items-end justify-between h-48 space-x-4 overflow-x-auto">
          {tenantGrowthData.map((d, i) => (
            <div key={i} className="flex flex-col items-center justify-end w-12 min-w-[3rem]">
              <div
                className="w-full bg-[#ff5c00] rounded-t transition-all duration-500"
                style={{ height: `${(d.value / max) * 100}%` }}
                title={`${d.month}: ${d.value}`}
              />
              <span className="mt-2 text-xs text-gray-600 select-none">{d.month}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
