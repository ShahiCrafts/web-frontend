import React, { useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const chartData = [
  { name: 'Jan', issued: 50, resolved: 128 },
  { name: 'Feb', issued: 75, resolved: 28 },
  { name: 'Mar', issued: 48, resolved: 40 },
  { name: 'Apr', issued: 130, resolved: 100 },
  { name: 'May', issued: 175, resolved: 122 },
  { name: 'Jun', issued: 150, resolved: 120 },
  { name: 'Jul', issued: 185, resolved: 148 },
  { name: 'Aug', issued: 250, resolved: 45 },
  { name: 'Sep', issued: 220, resolved: 140 },
  { name: 'Oct', issued: 125, resolved: 180 },
  { name: 'Nov', issued: 127, resolved: 210 },
  { name: 'Dec', issued: 175, resolved: 250 },
];

const CardHeader = ({ timeFrame, setTimeFrame }) => (
  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
    <div>
      <h2 className="text-base font-semibold text-gray-800 mb-1">Resolved vs Reopened Issues</h2>
      <p className="text-sm text-gray-500 mt-1">Track reliability of resolutions</p>
    </div>
    <div className="mt-3 sm:mt-0">
      <TimeFrameToggle selected={timeFrame} onSelect={setTimeFrame} />
    </div>
  </div>
);

const TimeFrameToggle = ({ selected, onSelect }) => {
  const options = ['Weekly', 'Monthly', 'Annually'];
  return (
    <div className="flex items-center bg-gray-100 p-1 rounded-lg">
      {options.map((option) => (
        <button
          key={option}
          onClick={() => onSelect(option)}
          className={`px-3 py-1 text-sm font-medium rounded-md transition
            ${selected === option
              ? 'bg-white text-gray-800 shadow-sm'
              : 'bg-transparent text-gray-600 hover:bg-gray-200'
            }`}
        >
          {option}
        </button>
      ))}
    </div>
  );
};

const StatsCard = ({ title, count, percentage, changeType, period }) => {
  const isPositive = changeType === 'positive';
  const colorClass = isPositive ? 'text-green-500' : 'text-red-500';
  const Icon = isPositive ? ArrowUpRight : ArrowDownRight;
  const bgColorClass = isPositive ? 'bg-green-100' : 'bg-red-100';

  return (
    <div className="flex-1">
      <div className="flex items-center gap-x-6">
        <h2 className="text-sm font-semibold text-gray-600">{title}</h2>
        <span
  className={`inline-flex items-center px-2 py-0.5 rounded-full text-[13px] font-semibold ${colorClass} ${bgColorClass}`}
>
  {percentage}%
  <Icon className="h-3.5 w-3.5 ml-1" />
</span>


      </div>
      <div className="mt-1">
        <p className="text-xl font-semibold text-gray-900 mb-1">{count.toLocaleString()}</p>
        <p className="text-xs text-gray-500">Avg. {period} reports</p>
      </div>
    </div>
  );
};

const IssuesChart = () => (
  <div className="h-64 w-full mt-6">
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={chartData}
        margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
        <XAxis
          dataKey="name"
          tick={{ fontSize: 12, fill: '#6b7280' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 12, fill: '#6b7280' }}
          axisLine={false}
          tickLine={false}
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
          name="Issued"
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
);

export default function StatisticsCard() {
  const [timeFrame, setTimeFrame] = useState('Annually');

  return (
    <div className="w-full bg-white p-5 sm:p-6 rounded-xl shadow-md">
      <CardHeader timeFrame={timeFrame} setTimeFrame={setTimeFrame} />

      <div className="flex flex-col sm:flex-row gap-6 mt-4 border-t border-gray-100 pt-4">
        <StatsCard
          title="Issued"
          count={47153}
          percentage={23.2}
          changeType="positive"
          period={timeFrame}
        />
        <StatsCard
          title="Resolved"
          count={19728}
          percentage={12.3}
          changeType="negative"
          period={timeFrame}
        />
      </div>

      <IssuesChart />
    </div>
  );
}
