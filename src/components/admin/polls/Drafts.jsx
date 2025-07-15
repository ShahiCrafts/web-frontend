import React, { useState, useEffect } from 'react';
import { Plus, Search, ChevronDown, MoreHorizontal, CheckCircle2, AlertCircle, FileEdit, Clock, Users as UserGroupIcon, Calendar, List, BarChart2 } from 'lucide-react';

export default function Drafts() {
    const draft = {
        id: 1,
        title: 'Budget Allocation for Youth Programs',
        question: 'How should we allocate the youth program budget?',
        createdBy: 'David Wilson',
        createdDate: '2025-06-20',
        endDate: '2025-07-25',
        avatar: 'https://placehold.co/24x24/a78bfa/ffffff?text=DW',
        options: [
            { id: 1, text: 'Sports and Recreation Programs' },
            { id: 2, text: 'Arts and Culture Workshops' },
            { id: 3, text: 'STEM Education and Tutoring' },
        ]
    };

    return (
        <div className="space-y-6">
             <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                    <h2 className="text-lg font-bold text-gray-900 flex items-center"><FileEdit className="w-6 h-6 mr-2 text-yellow-500"/> Draft Polls</h2>
                    <p className="text-gray-500 mt-1 text-sm">Unpublished polls and surveys ready for review</p>
                </div>
            </div>
            <div className="bg-white border-l-4 border-yellow-400 rounded-r-lg p-5 shadow-sm">
                 <div className="flex justify-between items-start">
                    <div>
                        <div className="flex items-center space-x-3">
                            <h3 className="text-base font-bold text-gray-900">{draft.title}</h3>
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Draft</span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{draft.question}</p>
                         <div className="flex items-center space-x-4 text-xs text-gray-500 mt-2">
                             <span className="flex items-center"><img src={draft.avatar} alt={draft.createdBy} className="w-5 h-5 rounded-full mr-1.5" /> Created by {draft.createdBy}</span>
                             <span className="flex items-center"><Calendar className="w-4 h-4 mr-1.5" /> Created {draft.createdDate}</span>
                             <span className="flex items-center"><Calendar className="w-4 h-4 mr-1.5" /> Scheduled to end {draft.endDate}</span>
                         </div>
                    </div>
                    <div className="flex items-center space-x-2">
                         <button className="bg-white border border-gray-300 text-gray-800 font-semibold px-4 py-2 text-sm rounded-lg hover:bg-gray-50">Publish Poll</button>
                         <button className="text-gray-400 hover:text-gray-700"><MoreHorizontal className="w-5 h-5" /></button>
                    </div>
                </div>
                 <div className="mt-4 pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-semibold text-gray-800 mb-3">Poll Options:</h4>
                    <div className="space-y-2">
                        {draft.options.map((opt) => (
                           <div key={opt.id} className="flex items-center bg-gray-100 p-3 rounded-md">
                               <span className="text-sm font-bold text-gray-500 mr-3">{opt.id}</span>
                               <span className="text-sm text-gray-800">{opt.text}</span>
                           </div>
                        ))}
                    </div>
                 </div>
            </div>
        </div>
    );
};