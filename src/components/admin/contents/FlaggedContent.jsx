import React, { useState } from 'react';
import { Flag, Eye, Trash2, ShieldAlert } from 'lucide-react';
import Pagination from '../../../components/common/Pagination';

const flaggedItems = [
    {
        id: 1,
        title: 'Traffic Safety Concerns on Main Street',
        preview: 'Residents have raised concerns about pedestrian safety, citing speeding vehicles and lack of crosswalks.',
        author: 'Carol Davis',
        category: 'Transportation',
        date: '2024-01-18',
        flagType: 'Offensive',
        flagReason: 'User used hateful language towards city officials.',
        flaggedBy: 'Amit Shrestha',
    },
    {
        id: 2,
        title: 'Get Rich Quick with PotholeCoin!',
        preview: 'Invest in PotholeCoin, the new crypto that rewards you for reporting infrastructure issues! Click here to invest now!',
        author: 'CryptoKing',
        category: 'Finance',
        date: '2024-03-10',
        flagType: 'Spam',
        flagReason: 'The post is an unrelated advertisement for a cryptocurrency scam.',
        flaggedBy: 'Prakash Adhikari',
    },
];


export default function FlaggedContent() {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const totalCount = 10;

    const FlagTypeBadge = ({ type }) => {
        const styles = {
            'Spam': 'bg-yellow-100 text-yellow-800',
            'Offensive': 'bg-red-100 text-red-800',
            'Misleading': 'bg-blue-100 text-blue-800',
        };
        return (
            <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${styles[type] || 'bg-gray-100 text-gray-800'}`}>
                {type}
            </span>
        );
    };

    return (
        <>
            <div>
                <header className="mb-6">
                    <h2 className="text-base font-semibold text-gray-800 flex items-center gap-2">
                        <Flag className="w-5 h-5" style={{ color: '#FF5C00' }} />
                        Flagged Content Queue
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">Review content that has been reported by the community.</p>
                </header>
                <div className="space-y-5">
                    {flaggedItems.map((item) => (
                        <div key={item.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                            {/* Original Content Info with Action Icons */}
                            <div className="p-4 bg-gray-50/70 flex justify-between items-start">
                                <div>
                                    <p className="text-sm font-semibold text-gray-900">{item.title}</p>
                                    <p className="text-sm text-gray-600 mt-1 max-w-xl">{item.preview}</p>
                                    <p className="text-xs text-gray-500 mt-2">By {item.author} · {item.category} · {item.date}</p>
                                </div>
                                <div className="flex items-center gap-4 pl-4">
                                    <button className="text-gray-400 hover:text-orange-500 transition-colors" title="Review Content">
                                        <Eye size={18} />
                                    </button>
                                    <button className="text-gray-400 hover:text-red-600 transition-colors" title="Dismiss Flag">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>

                            {/* Flagging Details */}
                            <div className="px-4 py-3 bg-orange-50 border-t border-orange-200">
                                <div className="flex items-center gap-3">
                                    <ShieldAlert className="w-5 h-5 text-orange-600 flex-shrink-0" />
                                    <div>
                                        <p className="text-sm font-semibold" style={{ color: '#E05100' }}>Reason for Flagging:</p>
                                        <p className="text-sm text-orange-800">{item.flagReason}</p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            <FlagTypeBadge type={item.flagType} /> · Reported by {item.flaggedBy}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    {flaggedItems.length === 0 && <p className="text-sm text-gray-500 text-center py-8">The flagged content queue is empty.</p>}
                </div>
            </div>
            <Pagination
                currentPage={currentPage}
                totalCount={totalCount}
                itemsPerPage={itemsPerPage}
                totalPages={Math.ceil(totalCount / itemsPerPage)}
                onPageChange={setCurrentPage}
                onLimitChange={(limit) => {
                    setCurrentPage(1);
                    setItemsPerPage(limit);
                }}
            />
        </>
    );
};