import React from 'react';
import { MessageSquare, AlertTriangle, Calendar, BarChart2 } from 'lucide-react';
import IconWrapper from './IconWrapper';

export default function PostTypeSelector({ selectedType, setSelectedType }) {
    const postTypes = [
        { name: 'Discussion', icon: MessageSquare, description: 'Share thoughts, ask questions, or start discussions' },
        { name: 'Report Issue', icon: AlertTriangle, description: 'Report problems, infrastructure issues, or concerns' },
        { name: 'Event', icon: Calendar, description: 'Organize meetings, workshops, or community gatherings' },
        { name: 'Poll', icon: BarChart2, description: 'Create polls and surveys to gather community input' }
    ];

    return (
        <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {postTypes.map(type => {
                    const isSelected = selectedType === type.name;

                    return (
                        <button
                            key={type.name}
                            onClick={() => setSelectedType(type.name)}
                            className={`text-left p-4 border rounded-lg transition-all duration-200 
                                ${isSelected
                                    ? 'bg-[#FFF5F0] border-[#FF5C00] ring-2 ring-[#FFD6BF]'
                                    : 'bg-white border-gray-200 hover:border-gray-400'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <IconWrapper
                                    icon={type.icon}
                                    className={isSelected ? 'text-[#FF5C00]' : 'text-gray-500'}
                                />
                                <h3
                                    className="font-semibold text-base text-gray-800 truncate max-w-[8ch]"
                                    title={type.name}
                                >
                                    {type.name}
                                </h3>
                            </div>
                            <p className="text-sm text-gray-500 mt-2 line-clamp-2">{type.description}</p>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
