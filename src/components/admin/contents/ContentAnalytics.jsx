import React from 'react';
import Card from './Card';
import { FileText, CheckCircle, Eye, TrendingUp, BarChart, PieChart } from 'lucide-react';

// Mock data
const topContent = [
    { id: 1, title: 'New Park Development Plans', views: 2156 },
    { id: 2, title: 'Budget Proposal Discussion for 2024', views: 1247 },
];
const categoryDistribution = [
    { name: 'Recreation', percentage: 50.0 },
    { name: 'Budget', percentage: 25.0 },
    { name: 'Transportation', percentage: 25.0 },
];

export default function ContentAnalytics() {
    return (
        <div className="space-y-8">
            {/* Top Level Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <Card title="Total Content" value="5" details="+3 last week" icon={<FileText size={18} />} />
                <Card title="Published" value="3" details="Active content" icon={<CheckCircle size={18} />} />
                <Card title="Total Views" value="4.4k" details="Across all content" icon={<Eye size={18} />} />
                <Card title="Engagement" value="9.5%" details="Likes/Views" icon={<TrendingUp size={18} />} />
            </div>

            {/* Performance and Category Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <section>
                    <header className="mb-4"><h2 className="text-base font-semibold text-gray-800 flex items-center gap-2"><BarChart className="w-5 h-5" style={{ color: '#FF5C00' }} />Content Performance</h2><p className="text-sm text-gray-500 mt-1">Top content by views.</p></header>
                    <ul className="space-y-3">
                        {topContent.map((item, index) => (
                            <li key={item.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50">
                                <span className="bg-gray-100 text-gray-600 text-sm font-bold rounded-full w-8 h-8 flex items-center justify-center">{index + 1}</span>
                                <div className="flex-1"><p className="font-medium text-sm text-gray-800">{item.title}</p></div>
                                <div className="text-sm text-gray-600">{item.views.toLocaleString()} views</div>
                            </li>
                        ))}
                    </ul>
                </section>
                <section>
                    <header className="mb-4"><h2 className="text-base font-semibold text-gray-800 flex items-center gap-2"><PieChart className="w-5 h-5" style={{ color: '#FF5C00' }} />Content by Category</h2><p className="text-sm text-gray-500 mt-1">Distribution of content.</p></header>
                    <div className="space-y-4">
                        {categoryDistribution.map((cat) => (
                            <div key={cat.name}>
                                <div className="flex justify-between text-sm mb-1"><span className="font-medium text-gray-700">{cat.name}</span><span className="text-gray-500">{cat.percentage}%</span></div>
                                <div className="w-full bg-gray-200 rounded-full h-2"><div className="h-2 rounded-full" style={{ width: `${cat.percentage}%`, backgroundColor: '#FF5C00' }}></div></div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};