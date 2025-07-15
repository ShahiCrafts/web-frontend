import React, { useState } from 'react';
import AuditLog from "./AuditLog";
import PermissionMatrix from "./PermissionMatrix";
import UserAssignments from "./UserAssignments";
import Roles from './Roles';

const Tab = ({ label, isActive, onClick }) => {
    return (
        <button
            onClick={onClick}
            className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors focus:outline-none ${isActive
                ? 'bg-gray-100 text-gray-800'
                : 'text-gray-500 hover:bg-gray-200/60'
            }`}
        >
            {label}
        </button>
    );
};


export default function MainRolePage() {
    const [activeTab, setActiveTab] = useState('Roles');

    const renderContent = () => {
        switch (activeTab) {
            case 'User Assignments': return <UserAssignments />;
            case 'Permission Matrix': return <PermissionMatrix />;
            case 'Audit Log': return <AuditLog />;
            case 'Roles':
            default:
                return <Roles />;
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-5 sm:p-6">
            <header className="mb-6 pb-4 border-b border-gray-200">
                <h1 className="text-xl font-bold text-gray-900">Roles & Permissions</h1>
                <p className="text-sm text-gray-600 mt-1">
                    Manage user roles, permissions, and access control across the platform.
                </p>
            </header>

            <nav className="flex items-center space-x-2 mb-6 overflow-x-auto pb-2">
                <Tab label="Roles" isActive={activeTab === 'Roles'} onClick={() => setActiveTab('Roles')} />
                <Tab label="User Assignments" isActive={activeTab === 'User Assignments'} onClick={() => setActiveTab('User Assignments')} />
                <Tab label="Permission Matrix" isActive={activeTab === 'Permission Matrix'} onClick={() => setActiveTab('Permission Matrix')} />
                <Tab label="Audit Log" isActive={activeTab === 'Audit Log'} onClick={() => setActiveTab('Audit Log')} />
            </nav>

            <main>
                {renderContent()}
            </main>
        </div>
    );
};