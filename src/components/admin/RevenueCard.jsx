import React from 'react';
import { MoreVertical } from "lucide-react";
import { ChevronRight } from "lucide-react";

const MoreIcon = () => <MoreVertical className="w-5 h-5 text-gray-500" />;
const ChevronRightIcon = () => <ChevronRight className="w-5 h-5 text-gray-500" />;


const CircularProgress = ({ percentage, strokeWidth = 8 }) => {
  const radius = 100;
  const circumference = 2 * Math.PI * radius;
  const arcPercentage = 0.5;
  const arcLength = circumference * arcPercentage;
  const progress = (percentage / 100) * arcLength;
  const offset = arcLength - progress;

  return (
    <div className="relative flex items-center justify-center w-[220px] h-[110px] overflow-hidden">
      <svg width="220" height="220" viewBox="0 0 220 220" className="absolute top-0">
        <circle
          stroke="#e5e7eb"
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          r={radius}
          cx="110"
          cy="110"
          transform="rotate(-180 110 110)"
          style={{
            strokeDasharray: `${arcLength} ${circumference}`,
          }}
        />
        <circle
          stroke="#f97316"
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          r={radius}
          cx="110"
          cy="110"
          transform="rotate(-180 110 110)"
          style={{
            strokeDasharray: arcLength,
            strokeDashoffset: offset,
            transition: 'stroke-dashoffset 0.5s ease-in-out',
          }}
        />
      </svg>
      <div className="absolute bottom-1 flex flex-col items-center justify-center">
        <span className="text-gray-500 text-sm">
          Revenue
        </span>
        <span className="font-bold text-gray-800 text-lg">
          NRs. 45,780
        </span>
        <span className="text-gray-500 text-sm">
          Out of 80,000
        </span>
      </div>
    </div>
  );
};

export default function RevenueCard() {
  const revenue = 45780;
  const target = 80000;
  const percentageOfTarget = (revenue / target) * 100;

  return (
    <div className="w-full max-w-md p-5 bg-white rounded-2xl shadow-md flex flex-col">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-gray-800 font-semibold text-base mb-1">
            Estimated Revenue
          </h2>
          <p className="text-gray-500 text-sm font-medium">
            Target you've set for each month.
          </p>
        </div>
        <button className="p-1 -mt-1 -mr-1 rounded-full hover:bg-gray-100">
          <MoreIcon />
        </button>
      </div>

      <div className="flex justify-center my-4">
        <CircularProgress percentage={percentageOfTarget} />
      </div>

      <div className="flex items-center justify-center space-x-8">
        <div>
          <p className="text-gray-500 text-sm">
            Subscriptions
          </p>
          <p className="font-bold text-gray-800 text-base">
            NRs. 18,230
          </p>
        </div>
        <div className="h-10 w-px bg-gray-200 transform -rotate-12"></div>
        <div className="text-green-600 bg-green-100 px-3 py-1 rounded-full text-sm">
          42% of Total
        </div>
      </div>

      <div className="border-t border-gray-200 mt-6 mb-4"></div>

      <div className="flex items-center justify-center text-gray-500 hover:text-gray-800 cursor-pointer">
        <a href="#" className="flex items-center text-gray-500 font-medium text-sm">
          See more
          <ChevronRightIcon />
        </a>
      </div>
    </div>
  );
}