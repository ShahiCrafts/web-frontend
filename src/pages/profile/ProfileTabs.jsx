import React from 'react';
import clsx from 'clsx';
import { User, FileText, Flag, Activity, Shield } from 'lucide-react';

export function ProfileTabs({ activeTab, setActiveTab, headerHeight }) {
    const tabs = [
        { id: 'overview', label: 'Overview', icon: User },
        { id: 'posts', label: 'Posts', icon: FileText },
        { id: 'reports', label: 'Report Tracker', icon: Flag },
        { id: 'activity', label: 'Activity', icon: Activity },
        { id: 'security', label: 'Security', icon: Shield }
    ];

    return (
        <nav className="bg-white/60 backdrop-blur-sm border-b border-gray-200/50 z-10" style={{ top: headerHeight }}>
            <div className="px-6">
                <div className="flex space-x-8">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={clsx(
                                "flex items-center gap-2 py-4 px-1 border-b-2 font-semibold text-sm transition-all duration-300 relative",
                                activeTab === tab.id
                                    ? "border-blue-500 text-blue-600"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            )}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                            {activeTab === tab.id && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                            )}
                        </button>
                    ))}
                </div>
            </div>
        </nav>
    );
}