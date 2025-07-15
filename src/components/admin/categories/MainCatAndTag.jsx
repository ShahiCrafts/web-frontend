import React, { useState } from 'react';
import { ChevronDown, LayoutGrid, Tag as TagIcon } from 'lucide-react';
import Tags from './Tags';
import Categories from './Categories';

// --- Reusable Badge Components ---
const StatusBadge = ({ status }) => {
  const styles = {
    active: "bg-green-100 text-green-800",
    inactive: "bg-yellow-100 text-yellow-800",
  };
  return (
    <span
      className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
        styles[status] || "bg-gray-100 text-gray-800"
      }`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const categoryData = [
  { id: 1, name: 'Environment', description: 'Environmental issues and initiatives', status: 'active', issues: 45, created: '2024-01-15', author: 'Admin' },
  { id: 2, name: 'Infrastructure', description: 'Roads, utilities, and public facilities', status: 'active', issues: 32, created: '2024-01-10', author: 'Jane Doe' },
  { id: 3, name: 'Education', description: 'Schools and educational programs', status: 'active', issues: 28, created: '2024-01-08', author: 'Admin' },
  { id: 4, name: 'Public Safety', description: 'Police, fire, and emergency services', status: 'active', issues: 19, created: '2024-01-05', author: 'John Smith' },
  { id: 5, name: 'Transportation', description: 'Public transit and traffic management', status: 'inactive', issues: 15, created: '2024-01-03', author: 'Jane Doe' },
];

const tagData = [
  { id: 1, name: 'Road Repair', description: 'Potholes, cracks, and other road issues', issues: 12, created: '2024-02-10', author: 'John Smith' },
  { id: 2, name: 'Water Quality', description: 'Concerns about drinking water safety', issues: 8, created: '2024-02-05', author: 'Admin' },
  { id: 3, name: 'Park Maintenance', description: 'Upkeep of public parks and recreational areas', issues: 7, created: '2024-02-01', author: 'Jane Doe' },
  { id: 4, name: 'Public Transport', description: 'Bus routes, schedules, and accessibility', issues: 5, created: '2024-01-28', author: 'Admin' },
];

const Tab = ({ label, count, icon, isActive, onClick }) => {
  const badgeClassName = `ml-2 px-2 py-0.5 text-xs rounded-full font-bold text-white`;
  const badgeStyle = {
    backgroundColor: '#FF5C00'
  };

  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center px-3 py-2 text-sm rounded-md transition-colors focus:outline-none whitespace-nowrap
        ${isActive
          ? 'bg-gray-100 text-gray-800 font-semibold'
          : 'text-gray-500 hover:bg-gray-200/60 font-medium'
        }
      `}
      aria-pressed={isActive}
      type="button"
    >
      {icon}
      <span className="ml-2">{label}</span>
      {count > 0 && (
        <span className={badgeClassName} style={badgeStyle}>
          {count}
        </span>
      )}
    </button>
  );
};

export default function MainCatAndTag() {
  const [activeTab, setActiveTab] = useState('categories');

  return (
    <div className="antialiased bg-slate-50 font-sans min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8">
          <header className="mb-6 pb-4 border-b border-gray-200">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Categories & Tags Management</h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1 max-w-2xl">
              Organize and manage categories and tags for civic engagement issues.
            </p>
          </header>

          <nav className="flex flex-wrap gap-2 mb-6" role="tablist" aria-label="Categories and Tags Tabs">
            <Tab
              label="Categories"
              count={categoryData.length}
              icon={<LayoutGrid className="w-4 h-4" />}
              isActive={activeTab === 'categories'}
              onClick={() => setActiveTab('categories')}
            />
            <Tab
              label="Tags"
              count={tagData.length}
              icon={<TagIcon className="w-4 h-4" />}
              isActive={activeTab === 'tags'}
              onClick={() => setActiveTab('tags')}
            />
          </nav>

          <main>
            {activeTab === 'categories' ? <Categories /> : <Tags />}
          </main>
        </div>
      </div>
    </div>
  );
}
