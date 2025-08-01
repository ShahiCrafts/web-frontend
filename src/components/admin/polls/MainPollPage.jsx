import React, { useState } from 'react';
import { Plus, List, CheckCircle2 } from 'lucide-react';
import ActivePolls from './ActivePolls';
import AllPolls from './AllPolls';
import { useFetchPolls } from '../../../hooks/admin/usePollHook'; // Import the poll hook

const Tab = ({ label, count, isActive, onClick, icon: Icon, isLoading }) => {
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
            {Icon && <Icon className="w-4 h-4" />}
            <span className="ml-2">{label}</span>
            {isLoading ? (
                <span className={`${badgeClassName} animate-pulse bg-gray-400`}>...</span>
            ) : (
                count > 0 && (
                    <span className={badgeClassName} style={badgeStyle}>
                        {count}
                    </span>
                )
            )}
        </button>
    );
};


export default function MainPollPage() {
    const [activeTab, setActiveTab] = useState('All Polls');

    // Fetch total count for all polls
    const { data: allPollsData, isLoading: isLoadingAll } = useFetchPolls({ limit: 1 });
    const allPollsCount = allPollsData?.totalPolls || 0;

    // Fetch total count for active polls
    const { data: activePollsData, isLoading: isLoadingActive } = useFetchPolls({ status: 'Active', limit: 1 });
    const activePollsCount = activePollsData?.totalPolls || 0;


    const renderContent = () => {
        switch (activeTab) {
            case 'Active':
                // The AllPolls component can handle filtering based on a prop
                // A better approach is to have a dedicated component for ActivePolls
                // but for now, we'll assume the AllPolls component can filter.
                // Or you can create a separate ActivePolls component. The provided code
                // has an ActivePolls component, so we'll use that.
                return <ActivePolls />;
            case 'All Polls':
            default:
                return <AllPolls />;
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-5 sm:p-6">
            <header className="mb-6 pb-4 border-b border-gray-200">
                <h1 className="text-xl font-bold text-gray-900">Polls & Surveys</h1>
                <p className="text-sm text-gray-600 mt-1">
                    Create and manage community polls, surveys, and voting initiatives.
                </p>
            </header>

            <nav className="flex items-center space-x-2 mb-6">
                <Tab
                    label="All Polls"
                    icon={List}
                    isActive={activeTab === 'All Polls'}
                    onClick={() => setActiveTab('All Polls')}
                    count={allPollsCount}
                    isLoading={isLoadingAll}
                />
                <Tab
                    label="Active"
                    icon={CheckCircle2}
                    isActive={activeTab === 'Active'}
                    onClick={() => setActiveTab('Active')}
                    count={activePollsCount}
                    isLoading={isLoadingActive}
                />
            </nav>

            <main>
                {renderContent()}
            </main>
        </div>
    );
}