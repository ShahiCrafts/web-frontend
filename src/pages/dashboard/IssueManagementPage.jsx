import React, { useState } from 'react';
import { Search, Filter, LayoutGrid, MoreHorizontal } from 'lucide-react';

// --- Mock Data ---
const issues = [
    {
        id: 'CHD-0456',
        title:
            'Streetlight near Ward 4 park entrance has been broken for over a month and is a major safety concern for the community.',
        reportedBy: 'Amit Shrestha',
        category: 'Electricity',
        status: 'Pending',
        dateReported: '2080-01-07',
        area: 'Kathmandu, Ward No. 04',
    },
    {
        id: 'CHD-0067',
        title:
            'Large pothole on the main road connecting Baneshwor and Shankhamul is causing significant traffic delays and vehicle damage.',
        reportedBy: 'Nisha Karki',
        category: 'Roads',
        status: 'In Progress',
        dateReported: '2080-12-27',
        area: 'Lalitpur, Ward No. 12',
    },
    {
        id: 'CHD-0012-1',
        title: 'Overflowing garbage bins near the New Bus Park are creating a health hazard.',
        reportedBy: 'Prakash Adhikari',
        category: 'Sanitation',
        status: 'Pending',
        dateReported: '2081-01-09',
        area: 'Kathmandu, Ward No. 14',
    },
    {
        id: 'CHD-0456-2',
        title: 'Exposed electrical wires dangling from a pole near the school.',
        reportedBy: 'Suman Lama',
        category: 'Electricity',
        status: 'Resolved',
        dateReported: '2081-01-12',
        area: 'Lalitpur, Ward No. 23',
    },
    {
        id: 'CHD-0012-2',
        title: 'Drinking water supply has been completely cut off for three days.',
        reportedBy: 'Rina Tamang',
        category: 'Water',
        status: 'Pending',
        dateReported: '2081-01-09',
        area: 'Kathmandu, Ward No. 27',
    },
    {
        id: 'CHD-0012-3',
        title: 'Illegal parking near the gate of Bir Hospital is causing traffic congestion.',
        reportedBy: 'Bikash Shrestha',
        category: 'Traffic',
        status: 'In Progress',
        dateReported: '2081-01-09',
        area: 'Kathmandu, Ward No. 14',
    },
    {
        id: 'CHD-0012-4',
        title: 'Broken public bench at Maitidevi Chowk park.',
        reportedBy: 'Deepika Raut',
        category: 'Public Property',
        status: 'Pending',
        dateReported: '2081-01-09',
        area: 'Kathmandu, Ward No. 14',
    },
    {
        id: 'CHD-0012-5',
        title: 'Loud construction noises past midnight by a contractor.',
        reportedBy: 'Shyam Bista',
        category: 'Public Disturbance',
        status: 'Reopened',
        dateReported: '2081-01-09',
        area: 'Kathmandu, Ward No. 14',
    },
    {
        id: 'CHD-0012-6',
        title: 'Several road lights on the Ring Road from Balkhu to Kalanki are not working.',
        reportedBy: 'Ritesh Mahat',
        category: 'Electricity',
        status: 'Resolved',
        dateReported: '2081-01-09',
        area: 'Kathmandu, Ward No. 14',
    },
    {
        id: 'CHD-0012-7',
        title: 'Missing manhole cover at the corner of Bishal Nagar street.',
        reportedBy: 'Anju Thapa',
        category: 'Roads',
        status: 'In Progress',
        dateReported: '2081-01-09',
        area: 'Kathmandu, Ward No. 14',
    },
];

// --- Status Badge Component ---
const StatusBadge = ({ status }) => {
    const baseClasses =
        'px-2.5 py-1 text-xs font-semibold rounded-md inline-block whitespace-nowrap';
    let statusClasses = '';

    switch (status) {
        case 'Pending':
            statusClasses = 'bg-red-100 text-red-800';
            break;
        case 'In Progress':
            statusClasses = 'bg-orange-100 text-orange-800';
            break;
        case 'Resolved':
            statusClasses = 'bg-green-100 text-green-800';
            break;
        case 'Reopened':
            statusClasses = 'bg-blue-100 text-blue-800';
            break;
        default:
            statusClasses = 'bg-gray-100 text-gray-800';
    }

    return <span className={`${baseClasses} ${statusClasses}`}>{status}</span>;
};

// --- Main Component ---
export default function App() {
    const [selectedIds, setSelectedIds] = useState([]);

    const handleSelectAll = (event) => {
        if (event.target.checked) {
            setSelectedIds(issues.map((issue) => issue.id));
        } else {
            setSelectedIds([]);
        }
    };

    const handleSelectOne = (id) => {
        setSelectedIds((prevSelectedIds) =>
            prevSelectedIds.includes(id)
                ? prevSelectedIds.filter((selectedId) => selectedId !== id)
                : [...prevSelectedIds, id]
        );
    };

    const isAllSelected = selectedIds.length === issues.length && issues.length > 0;

    return (
        <div className="bg-slate-50 min-h-screen flex items-start justify-center font-sans">
            <div className="w-full max-w-7xl bg-white rounded-xl shadow-md p-4 md:p-6 max-h-screen overflow-auto">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                    <div className="mb-4 md:mb-0">
                        <h2 className="text-base font-semibold text-gray-800">Manage Reported Issues</h2>
                        <p className="text-sm font-medium text-gray-500 mt-1">
                            Review, filter, and take action on all citizen-reported problems across city wards.
                        </p>
                    </div>
                    <div className="flex items-center space-x-2 w-full md:w-auto">
                        <div className="relative flex-grow md:flex-grow-0">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm"
                            />
                        </div>
                        <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition text-sm">
                            <Filter className="w-5 h-5 text-gray-600" />
                            <span className="text-gray-700 font-medium">Filter</span>
                        </button>
                        <button className="p-2.5 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition">
                            <LayoutGrid className="w-5 h-5 text-gray-600" />
                        </button>
                    </div>
                </div>

                {/* Table Section */}
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="p-4">
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                        checked={isAllSelected}
                                        onChange={handleSelectAll}
                                    />
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                                >
                                    Ticket ID
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                                >
                                    Title
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                                >
                                    Reported By
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                                >
                                    Category
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                                >
                                    Status
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                                >
                                    Date Reported
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                                >
                                    Area
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                                ></th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {issues.map((issue) => (
                                <tr key={issue.id} className="hover:bg-gray-50">
                                    <td className="p-4">
                                        <input
                                            type="checkbox"
                                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                            checked={selectedIds.includes(issue.id)}
                                            onChange={() => handleSelectOne(issue.id)}
                                        />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">
                                        {issue.id}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 max-w-xs truncate">
                                        {issue.title}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{issue.reportedBy}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{issue.category}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <StatusBadge status={issue.status} />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{issue.dateReported}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{issue.area}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button className="text-gray-500 hover:text-gray-700">
                                            <MoreHorizontal className="w-5 h-5" />
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
