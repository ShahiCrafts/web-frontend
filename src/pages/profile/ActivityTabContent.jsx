import React from 'react';
import { Activity } from 'lucide-react';
import { ActivityLogItem } from './ActivityLogItem'; // Assuming ActivityLogItem is in a separate file

export function ActivityTabContent({ mockActivities }) {
    return (
        <section className="space-y-6">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <Activity className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                    Activity Log
                </h2>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-200/50">
                <div className="space-y-4">
                    {mockActivities.map((activity) => (
                        <ActivityLogItem key={activity.id} activity={activity} />
                    ))}
                </div>
            </div>
        </section>
    );
}