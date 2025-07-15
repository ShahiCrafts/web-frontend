import React, { useState, useEffect } from 'react';
import { Plus, Search, ChevronDown, MoreHorizontal, CheckCircle2, AlertCircle, FileEdit, Clock, Users as UserGroupIcon, Calendar, List, BarChart2 } from 'lucide-react';
import ActivePolls from './ActivePolls';
import Drafts from './Drafts';
import AllPolls from './AllPolls';

const Tab = ({ label, count, isActive, onClick, icon: Icon }) => {
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
            {count > 0 && (
                <span className={badgeClassName} style={badgeStyle}>
                    {count}
                </span>
            )}
        </button>
    );
};


export default function MainPollPage() {
    const [activeTab, setActiveTab] = useState('All Polls');

    const renderContent = () => {
        switch (activeTab) {
            case 'Active': return <ActivePolls />;
            case 'Drafts': return <Drafts />;
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
                <Tab label="All Polls" icon={List} isActive={activeTab === 'All Polls'} onClick={() => setActiveTab('All Polls')} />
                <Tab label="Active" count={3} icon={CheckCircle2} isActive={activeTab === 'Active'} onClick={() => setActiveTab('Active')} />
                <Tab label="Drafts" count={1} icon={FileEdit} isActive={activeTab === 'Drafts'} onClick={() => setActiveTab('Drafts')} />
            </nav>

            <main>
                {renderContent()}
            </main>
        </div>
    );
};