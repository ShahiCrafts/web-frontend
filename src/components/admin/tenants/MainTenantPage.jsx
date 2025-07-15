import React, { useState, useEffect } from 'react';
import {
  Plus, Search, ChevronDown, MoreHorizontal, Building, CheckCircle2,
  User, HardDrive, BarChart2, TrendingUp, Clock, Archive,
  List,
  FileEdit,
  LineChart
} from 'lucide-react';

import ActiveTenants from './ActiveTenants';
import OnTrialTenants from './OnTrialTenant';
import TenantAnalytics from './TenantAnalytics';
import AllTenants from './AllTenants';

const Tab = ({ label, count, isActive, onClick, icon: Icon }) => {
    const badgeClassName = `ml-2 px-2 py-0.5 text-xs rounded-full font-bold text-white`;
    const badgeStyle = {
        backgroundColor: '#FF5C00'
    };

    return (
        <button
            onClick={onClick}
            className={`flex items-center justify-center px-4 py-2 text-sm rounded-md transition-colors focus:outline-none ${isActive
                ? 'bg-gray-100 text-gray-800 font-semibold'
                : 'text-gray-500 hover:bg-gray-200/60 font-medium'
            }`}
        >
            {Icon && <Icon className="w-4 h-4" />}
            <span className="ml-2">{label}</span>
            {count > 0 && (
                <span className={badgeClassName} style={badgeStyle}>
                    {count}
                </span>
            )}
        </button>
    );
};

const MainTenantPage = ({ rechartsLoaded }) => {
  const [activeTab, setActiveTab] = useState('All Polls');
  
      const renderContent = () => {
          switch (activeTab) {
              case 'Active': return <ActiveTenants />;
              case 'Trial': return <OnTrialTenants />;
              case 'Analytics': return <TenantAnalytics />;
              case 'All Tenants':
              default:
                  return <AllTenants />;
          }
      };

  return (
    <div className="bg-white rounded-xl shadow-lg px-4 py-5 sm:px-6 sm:py-6 w-full">
      <header className="mb-6 pb-4 border-b border-gray-200">
        <h1 className="text-lg sm:text-xl font-bold text-gray-900">Tenant Management</h1>
        <p className="text-sm text-gray-600 mt-1">
          Manage multi-tenant organizations, their settings, and platform configurations.
        </p>
      </header>

      <nav className="flex items-center space-x-2 mb-6">
                <Tab label="All Tenants" icon={List} isActive={activeTab === 'All Tenants'} onClick={() => setActiveTab('All Tenants')} />
                <Tab label="Active" count={3} icon={CheckCircle2} isActive={activeTab === 'Active'} onClick={() => setActiveTab('Active')} />
                <Tab label="Trial" count={1} icon={Clock} isActive={activeTab === 'Trial'} onClick={() => setActiveTab('Trial')} />
                <Tab label="Analytics" count={1} icon={LineChart} isActive={activeTab === 'Analytics'} onClick={() => setActiveTab('Analytics')} />
            </nav>

      <main className="mt-6">
        {renderContent()}
      </main>
    </div>
  );
};

export default function App() {
  const [rechartsLoaded, setRechartsLoaded] = useState(false);

  useEffect(() => {
    const scriptId = 'recharts-script';
    if (document.getElementById(scriptId) || window.Recharts) {
      setRechartsLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = 'https://unpkg.com/recharts/umd/Recharts.min.js';
    script.async = true;

    script.onload = () => setRechartsLoaded(true);
    script.onerror = () => console.error('Failed to load Recharts script.');

    document.body.appendChild(script);

    return () => {
      const el = document.getElementById(scriptId);
      if (el) el.remove();
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <div className="w-full max-w-7xl mx-auto">
        <MainTenantPage rechartsLoaded={rechartsLoaded} />
      </div>
    </div>
  );
}
