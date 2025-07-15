import React, { useState } from 'react';
import AllContent from './AllContent';
import FlaggedContent from './FlaggedContent';
import ContentAnalytics from './ContentAnalytics';

const Tab = ({ label, count, isActive, onClick }) => {
    const isFlaggedTab = label === 'Flagged Content';
    const badgeBaseStyle = "ml-2 px-2 py-0.5 text-xs rounded-full font-bold text-white";
    const badgeStyle = isFlaggedTab
        ? { backgroundColor: '#FF5C00' }
        : {};
    const badgeClassName = isFlaggedTab
        ? `${badgeBaseStyle}`
        : `${badgeBaseStyle} ${isActive ? 'bg-gray-500' : 'bg-gray-300'}`;

    return (
        <button
            onClick={onClick}
            className={`px-4 py-2 text-sm rounded-md transition-colors focus:outline-none ${isActive
                    ? 'bg-gray-100 text-gray-800 font-semibold'
                    : 'text-gray-500 hover:bg-gray-200/60 font-medium'
                }`}
        >
            {label}
            {count > 0 && (
                <span
                    className={badgeClassName}
                    style={badgeStyle}
                >
                    {count}
                </span>
            )}
        </button>
    );
};

export default function MainContentPage() {
    const [activeTab, setActiveTab] = useState('All Content');

    const renderContent = () => {
        switch (activeTab) {
            case 'Flagged Content': return <FlaggedContent />;
            case 'Analytics': return <ContentAnalytics />;
            case 'All Content': default: return <AllContent />;
        }
    };

    return (
        <div className="bg-slate-50 font-sans">
            <div className="w-full max-w-7xl mx-auto">
                <div className="bg-white rounded-xl shadow-lg p-5 sm:p-6">
                    <header className="mb-6 pb-4 border-b border-gray-200">
                        <h1 className="text-xl font-bold text-gray-900">Content Management</h1>
                        <p className="text-sm text-gray-600 mt-1">
                            Manage all platform content including posts, articles, and media assets.
                        </p>
                    </header>

                    {/* Tabs */}
                    <nav className="flex items-center space-x-2 mb-6">
                        <Tab label="All Content" isActive={activeTab === 'All Content'} onClick={() => setActiveTab('All Content')} />
                        <Tab label="Flagged Content" count={1} isActive={activeTab === 'Flagged Content'} onClick={() => setActiveTab('Flagged Content')} />
                        <Tab label="Analytics" isActive={activeTab === 'Analytics'} onClick={() => setActiveTab('Analytics')} />
                    </nav>

                    <main>
                        {renderContent()}
                    </main>
                </div>
            </div>
        </div>
    );
}