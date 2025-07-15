import React, { useState } from "react";

import { Bell, Calendar, FileText, Send, Settings } from "lucide-react";
import AllNotifications from "./AllNotifications";
import SentNotifications from "./SentNotifications";
import ScheduledNotifications from "./ScheduledNotifications";
import Templates from "./Templates";

const Tab = ({ label, count, icon, isActive, onClick }) => {
    const badgeClassName = `ml-2 px-2 py-0.5 text-xs rounded-full font-bold text-white`
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

export default function App() {
    const [activeTab, setActiveTab] = useState('All Notifications');

    const renderContent = () => {
        switch (activeTab) {
            case 'Sent': return <SentNotifications />;
            case 'Scheduled': return <ScheduledNotifications />;
            case 'Templates': return <Templates />;
            case 'Settings': return <SettingsComponent />;
            case 'All Notifications':
            default: return <AllNotifications />;
        }
    };

    return (
        <div className="bg-slate-50 font-sans">
            <div className="w-full max-w-7xl mx-auto">
                <div className="bg-white rounded-xl shadow-lg p-5 sm:p-6">
                    <header className="mb-6 pb-4 border-b border-gray-200">
                        <h1 className="text-xl font-bold text-gray-900">Notification Management</h1>
                        <p className="text-sm text-gray-600 mt-1">
                            Manage platform notifications, alerts, and communication preferences across the community.
                        </p>
                    </header>

                    {/* Tabs */}
                    <nav className="flex items-center space-x-2 mb-6">
                        <Tab label="All Notifications" icon={<Bell className="w-4 h-4" />} isActive={activeTab === 'All Notifications'} onClick={() => setActiveTab('All Notifications')} />
                        <Tab label="Sent" count={2} icon={<Send className="w-4 h-4" />} isActive={activeTab === 'Sent'} onClick={() => setActiveTab('Sent')} />
                        <Tab label="Scheduled" count={1} icon={<Calendar className="w-4 h-4" />} isActive={activeTab === 'Scheduled'} onClick={() => setActiveTab('Scheduled')} />
                        <Tab label="Templates" icon={<FileText className="w-4 h-4" />} isActive={activeTab === 'Templates'} onClick={() => setActiveTab('Templates')} />
                        <Tab label="Settings" icon={<Settings className="w-4 h-4" />} isActive={activeTab === 'Settings'} onClick={() => setActiveTab('Settings')} />
                    </nav>

                    <main>
                        {renderContent()}
                    </main>
                </div>
            </div>
        </div>
    );
}
