import React, { useState } from 'react';
import { ChevronDown, LayoutGrid, Tag as TagIcon } from 'lucide-react';
import Tags from './Tags';
import Categories from './Categories';

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
        <div className="bg-white rounded-xl p-2 sm:p-4 md:p-6">
          <header className="mb-6 pb-4 border-b border-gray-200">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Categories & Tags Management</h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1 max-w-2xl">
              Organize and manage categories and tags for civic engagement issues.
            </p>
          </header>

          <nav className="flex flex-wrap gap-2 mb-6" role="tablist" aria-label="Categories and Tags Tabs">
            <Tab
              label="Categories"
              count={5} // Hardcoded for demonstration, replace with actual data length
              icon={<LayoutGrid className="w-4 h-4" />}
              isActive={activeTab === 'categories'}
              onClick={() => setActiveTab('categories')}
            />
            <Tab
              label="Tags"
              count={4} // Hardcoded for demonstration, replace with actual data length
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