import React from 'react';

const CopyrightIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-3 h-3 inline-block mb-0.5 mx-1 text-gray-400"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    {...props}
  >
    <circle cx="12" cy="12" r="10" strokeWidth="2" />
    <path d="M15 9.354a4 4 0 1 0 0 5.292" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export default function CopyrightFooter() {
  return (
    <div className="text-gray-500 text-sm mt-10 w-full px-4 sm:px-0">
      {/* Top row links */}
      <div className="flex flex-wrap justify-center gap-6 mb-2">
        <a href="/privacy-policy" className="hover:underline hover:text-gray-700">Privacy Policy</a>
        <a href="/terms-and-conditions" className="hover:underline hover:text-gray-700">Terms & Conditions</a>
      </div>

      {/* Bottom copyright row */}
      <div className="text-center">
        <span className="text-gray-500">
          OnGoDesk Civic’s
          <CopyrightIcon />
          2025, All Rights Reserved.
        </span>
      </div>
    </div>
  );
}
