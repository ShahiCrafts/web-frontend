import React, { useState, useEffect } from 'react';
import { Plus, Search, ChevronDown, MoreHorizontal, Building, CheckCircle2, User, HardDrive, BarChart2, TrendingUp, Clock, Archive } from 'lucide-react';

export default function AllTenants() {
    const tenants = [
        { name: 'City of Springfield', domain: 'engage.springfield.gov', plan: 'enterprise', status: 'active', users: 12847, userLimit: 15000, storage: 2.4, storageLimit: 5, adminName: 'Sarah Johnson', adminEmail: 'sarah@springfield.gov', lastActivity: '2 hours ago', avatar: 'https://placehold.co/40x40/6366f1/ffffff?text=S' },
        { name: 'Metro County', domain: 'metro.civicengage.com', plan: 'professional', status: 'active', users: 5432, userLimit: 10000, storage: 1.8, storageLimit: 2, adminName: 'Mike Chen', adminEmail: 'mike@metro.gov', lastActivity: '1 day ago', avatar: 'https://placehold.co/40x40/3b82f6/ffffff?text=M' },
        { name: 'Riverside Township', domain: 'riverside.civicengage.com', plan: 'trial', status: 'trial', users: 78, userLimit: 100, storage: 0.2, storageLimit: 1, adminName: 'Emma Davis', adminEmail: 'emma@riverside.gov', lastActivity: '3 days ago', avatar: 'https://placehold.co/40x40/a78bfa/ffffff?text=R' },
        { name: 'Oak Valley', domain: 'oak.civicengage.com', plan: 'standard', status: 'inactive', users: 1200, userLimit: 2000, storage: 0.8, storageLimit: 1, adminName: 'John Doe', adminEmail: 'john@oakvalley.gov', lastActivity: '2 weeks ago', avatar: 'https://placehold.co/40x40/f59e0b/ffffff?text=O' },
    ];

    const PlanBadge = ({ plan }) => {
        const styles = {
            enterprise: 'bg-purple-100 text-purple-800',
            professional: 'bg-blue-100 text-blue-800',
            standard: 'bg-gray-100 text-gray-800',
            trial: 'bg-yellow-100 text-yellow-800',
        };
        return <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${styles[plan]}`}>{plan}</span>
    }
    
    const UsageBar = ({ value, limit, unit }) => {
        const percentage = limit > 0 ? (value / limit) * 100 : 0;
        return (
            <div>
                 <div className="flex justify-between text-xs font-medium text-gray-600">
                    <span>{value.toLocaleString()}{unit}</span>
                    <span>{limit.toLocaleString()}{unit}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                    <div className="bg-[#ff5c00] h-1.5 rounded-full" style={{ width: `${percentage}%` }}></div>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                    <h2 className="text-lg font-bold text-gray-900">Tenant Organizations</h2>
                    <p className="text-gray-500 mt-1 text-sm">Manage all tenant organizations and their configurations</p>
                </div>
                <button className="flex items-center bg-[#ff5c00] text-white font-semibold px-4 py-2 rounded-lg mt-4 md:mt-0 hover:bg-[#e05100] transition-colors">
                    <Plus className="w-5 h-5 mr-2" />
                    Add Tenant
                </button>
            </div>

             <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input type="text" placeholder="Search tenants..." className="w-full bg-white border border-gray-300 rounded-lg pl-10 pr-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#ff5c00]" />
                </div>
                <div className="relative">
                    <select className="appearance-none w-full md:w-auto bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#ff5c00]">
                        <option>All Status</option>
                        <option>Active</option>
                        <option>Inactive</option>
                        <option>Trial</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"/>
                </div>
                <div className="relative">
                    <select className="appearance-none w-full md:w-auto bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#ff5c00]">
                        <option>All Plans</option>
                        <option>Enterprise</option>
                        <option>Professional</option>
                        <option>Standard</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"/>
                </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Organization</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">Usage</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admin</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Activity</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {tenants.map(tenant => (
                            <tr key={tenant.name}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <img className="h-10 w-10 rounded-full" src={tenant.avatar} alt={tenant.name} />
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">{tenant.name}</div>
                                            <div className="text-sm text-gray-500">{tenant.domain}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap"><PlanBadge plan={tenant.plan} /></td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${tenant.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{tenant.status}</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <div className="space-y-2">
                                        <UsageBar value={tenant.users} limit={tenant.userLimit} unit="" />
                                        <UsageBar value={tenant.storage} limit={tenant.storageLimit} unit="GB" />
                                    </div>
                                </td>
                                 <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{tenant.adminName}</div>
                                    <div className="text-sm text-gray-500">{tenant.adminEmail}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tenant.lastActivity}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button className="text-gray-400 hover:text-gray-700"><MoreHorizontal className="w-5 h-5" /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};