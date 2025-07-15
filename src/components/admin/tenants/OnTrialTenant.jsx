import React, { useState, useEffect } from 'react';
import { Plus, Search, ChevronDown, MoreHorizontal, Building, CheckCircle2, User, HardDrive, BarChart2, TrendingUp, Clock, Archive } from 'lucide-react';

export default function OnTrialTenants() {
     const trials = [
        { name: 'Riverside Township', domain: 'riverside.civicengage.com', started: '2025-06-10', admin: 'Emma Davis', avatar: 'https://placehold.co/40x40/a78bfa/ffffff?text=R' }
    ];

    return (
        <div className="space-y-6">
             <div>
                <h2 className="text-lg font-bold text-gray-900 flex items-center"><TrendingUp className="w-6 h-6 mr-2 text-blue-500"/>Trial Tenants</h2>
                <p className="text-gray-500 mt-1 text-sm">Organizations evaluating the platform</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg">
                {trials.map(trial => (
                    <div key={trial.name} className="flex flex-col md:flex-row items-center justify-between p-5">
                         <div className="flex items-center space-x-4">
                            <img className="h-10 w-10 rounded-full" src={trial.avatar} alt={trial.name} />
                             <div>
                                <h3 className="font-bold text-gray-900">{trial.name}</h3>
                                <p className="text-sm text-gray-500">{trial.domain}</p>
                                <div className="text-xs text-gray-400 mt-1">
                                    <span>Started: {trial.started}</span>
                                    <span className="mx-2">|</span>
                                    <span>Admin: {trial.admin}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2 mt-4 md:mt-0">
                            <button className="bg-white border border-gray-300 text-gray-800 font-semibold px-4 py-2 rounded-lg hover:bg-gray-50 text-sm">Convert to Paid</button>
                            <button className="bg-white border border-gray-300 text-gray-800 font-semibold px-4 py-2 rounded-lg hover:bg-gray-50 text-sm">Extend Trial</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};