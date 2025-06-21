import React, { useState } from 'react';
import { Search, Filter, LayoutGrid, MoreHorizontal } from 'lucide-react';

// --- Mock Data ---
const flaggedContent = [
    {
        id: 1,
        flagType: 'Spam',
        preview: "This post seems like an advertisement for external plumbing services and doesn't describe any real civic issue happening in the mentioned area.",
        reportedBy: 'Amit Shrestha',
        reason: 'Promoting unrelated services',
        dateFlagged: '2080-01-07',
    },
    {
        id: 2,
        flagType: 'Offensive',
        preview: "The people managing this ward are totally useless. They never respond to complaints and act like they don't care about the citizens at all.",
        reportedBy: 'Deepika Raut',
        reason: 'Hate Speech',
        dateFlagged: '2079-02-12',
    },
    {
        id: 3,
        flagType: 'Misleading',
        preview: "This user claimed water issues in Ward 5, but after checking the photos and description, it's clear the incident happened in Ward 4 last year.",
        reportedBy: 'Prakash Adhikari',
        reason: 'Incorrect Location',
        dateFlagged: '2079-03-16',
    },
    {
        id: 4,
        flagType: 'Spam',
        preview: 'This post is just promoting a private contractor, claiming they fix roads better than the city. It contains a link to an external paid service..',
        reportedBy: 'Suman Maharjan',
        reason: 'Promoting Private Business',
        dateFlagged: '2081-12-04',
    },
    {
        id: 5,
        flagType: 'Spam',
        preview: 'Get paid fixing potholes by investing in crypto! Visit potholecoin.net now and earn rewards — no actual issue reported, just an ad with a shady link.',
        reportedBy: 'Nirajan Poudel',
        reason: 'Scam link and unrelated ad',
        dateFlagged: '2081-01-16',
    },
    {
        id: 6,
        flagType: 'Offensive',
        preview: "The municipal workers are brainless clowns. It's no surprise nothing works in this city when those idiots are in charge of our basic services.",
        reportedBy: 'Rekha Singh',
        reason: 'Insulting public employees',
        dateFlagged: '2076-01-29',
    },
    {
        id: 7,
        flagType: 'Misleading',
        preview: 'The user attached an image showing garbage overflow supposedly from today, but reverse search shows it\'s from 2023 during a local strike event.',
        reportedBy: 'Bishal Adhikari',
        reason: 'Misleading media used in report',
        dateFlagged: '2079-03-16',
    },
    {
        id: 8,
        flagType: 'Spam',
        preview: 'If you want clean roads, vote for Bikash Dai in the next ward election. Only he can fix these problems! This is clearly a political promo post.',
        reportedBy: 'Anonymous',
        reason: 'Political advertising',
        dateFlagged: '2081-09-12',
    },
];
// --- Flag Type Badge ---
const FlagTypeBadge = ({ type }) => {
    const baseClasses = 'px-2.5 py-1 text-xs font-semibold rounded-md inline-block whitespace-nowrap';
    let typeClasses = '';

    switch (type) {
        case 'Spam':
            typeClasses = 'bg-yellow-100 text-yellow-800';
            break;
        case 'Offensive':
            typeClasses = 'bg-red-100 text-red-800';
            break;
        case 'Misleading':
            typeClasses = 'bg-blue-100 text-blue-800';
            break;
        default:
            typeClasses = 'bg-gray-100 text-gray-800';
    }

    return <span className={`${baseClasses} ${typeClasses}`}>{type}</span>;
};

// --- Main Component ---
export default function App() {
    const [selectedIds, setSelectedIds] = useState([]);

    const handleSelectAll = (e) => {
        setSelectedIds(e.target.checked ? flaggedContent.map((i) => i.id) : []);
    };

    const handleSelectOne = (id) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    const isAllSelected = selectedIds.length === flaggedContent.length && flaggedContent.length > 0;

    return (
        <div className="bg-slate-50 flex items-center justify-center font-sans">
            <div className="w-full max-w-7xl bg-white rounded-xl shadow-lg p-6">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                    <div className="mb-4 md:mb-0">
                        <h2 className="text-base font-semibold text-gray-800">Flagged Content Review</h2>
                        <p className="text-sm font-medium text-gray-500 mt-1">
                            Investigate user reports and maintain civic content integrity.
                        </p>
                    </div>
                    <div className="flex items-center space-x-2 w-full md:w-auto">
                        <div className="relative flex-grow md:flex-grow-0">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                            />
                        </div>
                        <button className="flex items-center space-x-1 px-3 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition text-sm">
                            <Filter className="w-4 h-4 text-gray-600" />
                            <span className="text-gray-700 font-medium">Filter</span>
                        </button>
                        <button className="p-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition">
                            <LayoutGrid className="w-4 h-4 text-gray-600" />
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 table-fixed">
                        <thead className="bg-gray-50 text-xs">
                            <tr>
                                <th className="w-12 p-4">
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                        checked={isAllSelected}
                                        onChange={handleSelectAll}
                                    />
                                </th>
                                <th className="w-32 px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Flag Type</th>
                                <th className="w-[32rem] px-5 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Preview</th>
                                <th className="w-48 px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Reported By</th>
                                <th className="w-48 px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                                <th className="w-40 px-4 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Flagged On</th>
                                <th className="w-24 px-6 py-3 text-left font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200 text-sm">
                            {flaggedContent.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50">
                                    <td className="p-4 align-top">
                                        <input
                                            type="checkbox"
                                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                            checked={selectedIds.includes(item.id)}
                                            onChange={() => handleSelectOne(item.id)}
                                        />
                                    </td>
                                    <td className="px-6 py-4 align-top">
                                        <FlagTypeBadge type={item.flagType} />
                                    </td>
                                    <td className="px-5 py-4 align-top text-gray-600 whitespace-nowrap overflow-hidden text-ellipsis max-w-[28rem]">
                                        {item.preview}
                                    </td>

                                    <td className="px-6 py-4 align-top whitespace-nowrap text-gray-800">{item.reportedBy}</td>
                                    <td className="px-6 py-4 align-top whitespace-nowrap text-gray-800">{item.reason}</td>
                                    <td className="px-6 py-4 align-top whitespace-nowrap text-gray-800">{item.dateFlagged}</td>
                                    <td className="px-6 py-4 align-top whitespace-nowrap">
                                        <button className="text-gray-500 hover:text-gray-700">
                                            <MoreHorizontal className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    );
}
