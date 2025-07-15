import React, { useState, useEffect } from 'react';
import { Plus, Search, ChevronDown, MoreHorizontal, Building, CheckCircle2, User, HardDrive, BarChart2, TrendingUp, Clock, Archive } from 'lucide-react';

export default function ActiveTenants() {
     const tenants = [
        { name: 'City of Springfield', domain: 'engage.springfield.gov', plan: 'enterprise', users: 12847, storage: 2.4, lastActivity: '2 hours ago', avatar: 'https://placehold.co/40x40/6366f1/ffffff?text=S' },
        { name: 'Metro County', domain: 'metro.civicengage.com', plan: 'professional', users: 5432, storage: 1.8, lastActivity: '1 day ago', avatar: 'https://placehold.co/40x40/3b82f6/ffffff?text=M' },
    ];
    
    const PlanBadge = ({ plan }) => {
        const styles = {
            enterprise: 'bg-purple-100 text-purple-800',
            professional: 'bg-blue-100 text-blue-800',
        };
        return <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${styles[plan]}`}>{plan}</span>
    }

    const TenantCard = ({ tenant }) => (
        <div className="bg-white border border-gray-200 rounded-lg p-5">
            <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                    <img className="h-12 w-12 rounded-full" src={tenant.avatar} alt={tenant.name}/>
                     <div>
                        <h3 className="font-bold text-gray-900">{tenant.name}</h3>
                        <p className="text-sm text-gray-500">{tenant.domain}</p>
                    </div>
                </div>
                <PlanBadge plan={tenant.plan}/>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-3 gap-4 text-sm">
                <div className="flex items-center text-gray-500"><User className="w-4 h-4 mr-2"/> Users: <span className="font-semibold text-gray-800 ml-1">{tenant.users.toLocaleString()}</span></div>
                <div className="flex items-center text-gray-500"><HardDrive className="w-4 h-4 mr-2"/> Storage: <span className="font-semibold text-gray-800 ml-1">{tenant.storage}GB</span></div>
                <div className="flex items-center text-gray-500"><Clock className="w-4 h-4 mr-2"/> Last Active: <span className="font-semibold text-gray-800 ml-1">{tenant.lastActivity}</span></div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
                <button className="w-full bg-gray-100 text-gray-700 font-semibold py-2 rounded-lg hover:bg-gray-200 transition-colors">Manage Tenant</button>
            </div>
        </div>
    )

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-lg font-bold text-gray-900 flex items-center"><CheckCircle2 className="w-6 h-6 mr-2 text-green-500"/>Active Tenants</h2>
                <p className="text-gray-500 mt-1 text-sm">Organizations currently using the platform</p>
            </div>
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {tenants.map(tenant => <TenantCard key={tenant.name} tenant={tenant} />)}
            </div>
        </div>
    );
};