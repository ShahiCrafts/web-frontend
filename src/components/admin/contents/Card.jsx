import React from 'react';

export default function Card({ title, value, icon, details }) {
    return <>
        <div className="bg-slate-50/50 p-5 rounded-lg border border-gray-200 flex-1">
            <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-medium text-gray-600">{title}</p>
                <div className="text-gray-400">{icon}</div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">{value}</h2>
            {details && <p className="text-xs text-gray-500 mt-2">{details}</p>}
        </div>
    </>
}