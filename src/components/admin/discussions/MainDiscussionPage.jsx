import React, { useState } from 'react';
import AllDiscussions from "./AllDiscussions";
import DiscussionModeration from "./DiscussionModeration";
import PinnedDiscussions from "./PinnedDiscussions";
import { Flag, List, Pin } from 'lucide-react';

const Tab = ({ label, count, icon, isActive, onClick }) => {
    const badgeClassName = `ml-2 px-2 py-0.5 text-xs rounded-full font-bold text-white`;
    const badgeStyle = {
        backgroundColor: '#FF5C00'
    };

    return (
        <button
            onClick={onClick}
            className={`flex items-center justify-center px-4 py-2 text-sm rounded-md transition-colors focus:outline-none ${isActive
                ? 'bg-gray-100 text-gray-800 font-semibold'
                : 'text-gray-500 hover:bg-gray-200/60 font-medium'
            }`}
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

export default function MainDiscussionPage() {
    const [activeTab, setActiveTab] = useState('all');

    const renderContent = () => {
        switch (activeTab) {
            case 'pinned':
                return <PinnedDiscussions />;
            case 'moderation':
                return <DiscussionModeration />;
            case 'all':
            default:
                return <AllDiscussions />;
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-5 sm:p-6">
            <header className="mb-6 pb-4 border-b border-gray-200">
                <h1 className="text-xl font-bold text-gray-900">Discussion Management</h1>
                <p className="text-sm text-gray-600 mt-1">
                    Manage platform discussions, forums, and conversation threads.
                </p>
            </header>

            <nav className="flex items-center space-x-2 mb-6">
                <Tab label="All Discussions" icon={<List className="w-4 h-4" />} isActive={activeTab === 'all'} onClick={() => setActiveTab('all')} />
                <Tab label="Pinned" count={2} icon={<Pin className="w-4 h-4" />} isActive={activeTab === 'pinned'} onClick={() => setActiveTab('pinned')} />
                <Tab label="Moderation" count={2} icon={<Flag className="w-4 h-4" />} isActive={activeTab === 'moderation'} onClick={() => setActiveTab('moderation')} />
            </nav>

            <main>
                {renderContent()}
            </main>
        </div>
    );
};