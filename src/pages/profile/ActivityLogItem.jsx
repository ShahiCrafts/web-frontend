import React from 'react';
import clsx from 'clsx';
import { LogOut, FileText, Flag, MessageCircle, User } from 'lucide-react';

export function ActivityLogItem({ activity }) {
    return (
        <div className="flex items-center gap-4 p-4 bg-white/50 backdrop-blur-sm rounded-xl hover:bg-white/80 transition-all duration-300 border border-gray-200/30">
            <div className={clsx(
                "w-10 h-10 rounded-full flex items-center justify-center",
                activity.type === 'login' ? 'bg-green-100 text-green-600' :
                activity.type === 'post' ? 'bg-blue-100 text-blue-600' :
                activity.type === 'report' ? 'bg-orange-100 text-orange-600' :
                activity.type === 'comment' ? 'bg-purple-100 text-purple-600' :
                'bg-gray-100 text-gray-600'
            )}>
                {activity.type === 'login' && <LogOut className="w-5 h-5" />}
                {activity.type === 'post' && <FileText className="w-5 h-5" />}
                {activity.type === 'report' && <Flag className="w-5 h-5" />}
                {activity.type === 'comment' && <MessageCircle className="w-5 h-5" />}
                {activity.type === 'profile' && <User className="w-5 h-5" />}
            </div>
            <div className="flex-1">
                <div className="font-medium text-gray-900">{activity.action}</div>
                <div className="text-sm text-gray-500">{activity.details}</div>
            </div>
            <div className="text-sm text-gray-500">{activity.timestamp}</div>
        </div>
    );
}