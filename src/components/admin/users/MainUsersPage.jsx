import React, { useState, useEffect, useRef } from 'react';
import { Users, UserCheck, UserPlus, BarChart2, Search, Download } from 'lucide-react';
import Card from '../../../components/admin/contents/Card';
import UserAccounts from './UserAccounts';
import { useFetchUsers } from '../../../hooks/admin/useUserTan';

export default function MainUsersPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [showDownloadMenu, setShowDownloadMenu] = useState(false);
    const downloadRef = useRef(null);
    const { data } = useFetchUsers({ limit: -1 });
    const totalCount = data?.total || 0;

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 300);
        return () => clearTimeout(handler);
    }, [searchTerm]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (downloadRef.current && !downloadRef.current.contains(event.target)) {
                setShowDownloadMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleDownload = (type) => {
        setShowDownloadMenu(false);
        alert(`Download as ${type}`);
    };

    return (
        <div className="bg-slate-50 font-sans">
            <div className="max-w-7xl mx-auto">
                <div className="bg-white rounded-xl shadow-lg p-5 sm:p-6">
                    <header className="mb-6 pb-4 border-b border-gray-200">
                        <h1 className="text-xl font-bold text-gray-900">User Management</h1>
                        <p className="text-sm text-gray-600 mt-1">
                            Manage citizens, moderators, and organization accounts.
                        </p>
                    </header>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <Card
                            title="Total Users"
                            value={totalCount}
                            icon={<Users className="w-5 h-5" />}
                            details={<span className="text-green-600">+12.5% from last month</span>}
                        />
                        <Card
                            title="Active Users"
                            value="0"
                            icon={<UserCheck className="w-5 h-5" />}
                            details={`0% of total users`}
                        />
                        <Card
                            title="New This Month"
                            value="234"
                            icon={<UserPlus className="w-5 h-5" />}
                            details={<span className="text-green-600">+18.2% from last month</span>}
                        />
                        <Card
                            title="Avg. Engagement"
                            value="72%"
                            icon={<BarChart2 className="w-5 h-5" />}
                            details={<span className="text-red-600">-5.1% from last month</span>}
                        />
                    </div>

                    <div className="flex justify-end items-center mb-4 gap-2">
                        <div className="relative w-full max-w-[260px]">
                            <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search users..."
                                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none"
                            />
                        </div>

                        <div className="relative" ref={downloadRef}>
                            <button
                                onClick={() => setShowDownloadMenu(prev => !prev)}
                                style={{ backgroundColor: '#ff5c00' }}
                                className="flex items-center justify-center text-white p-2 rounded-md hover:bg-[#e64f00] focus:outline-none"
                            >
                                <Download className="w-4 h-4" />
                            </button>
                            {showDownloadMenu && (
                                <div className="absolute right-0 mt-2 w-24 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                                    <button
                                        onClick={() => handleDownload('xls')}
                                        className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
                                    >
                                        .xls
                                    </button>
                                    <button
                                        onClick={() => handleDownload('pdf')}
                                        className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
                                    >
                                        .pdf
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <UserAccounts search={debouncedSearchTerm} />
                </div>
            </div>
        </div>
    );
}
