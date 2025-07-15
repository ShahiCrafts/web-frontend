import React, { useState } from 'react';

import AllEvents from "./AllEvents";
import OngoingEvents from "./OngoingEvents";
import UpcomingEvents from "./UpcomingEvents";
import CalendarEventView from './CalendarEventView';

const allEventsData = [
    { id: 1, title: "Town Hall Meeting - Budget Discussion", description: "Community meeting to discuss the proposed 2024 budget allocation", date: "2024-02-15T19:00:00", location: "City Hall Auditorium", attendees: 156, capacity: 200, registered: 156, organizer: "Sarah Johnson", tags: ["upcoming", "Government", "Registration Required"], status: 'upcoming', category: 'Government' },
    { id: 2, title: "Youth Council Meeting", description: "Monthly meeting for youth representatives and community leaders", date: "2024-02-12T16:00:00", location: "Youth Center", attendees: 25, capacity: 50, registered: 25, status: 'ongoing', progress: 100, attendanceRate: 83, category: 'Youth', tags: ["ongoing", "Youth"], organizer: "Admin" },
    { id: 3, title: "Community Garden Workshop", description: "Learn about sustainable gardening practices and community involvement", date: "2024-02-20T10:00:00", location: "Central Park Pavilion", attendees: 0, registered: 34, capacity: 50, organizer: "Mike Chen", category: "Environment", status: 'upcoming', tags: ["upcoming", "Environment", "Workshop"] },
    { id: 4, title: "Climate Action Planning Session", description: "Collaborative session to develop local climate action strategies", date: "2024-03-05T14:00:00", location: "Environmental Center", attendees: 0, registered: 12, capacity: 75, organizer: "Lisa Brown", category: "Environment", status: 'upcoming', tags: ["upcoming", "Planning", "Environment"] },
];

const upcomingEventsData = allEventsData.filter(e => e.status === 'upcoming');
const ongoingEventData = allEventsData.find(e => e.status === 'ongoing');

const Tab = ({ label, count, isActive, onClick }) => {
    const badgeClassName = "ml-2 px-2 py-0.5 text-xs rounded-full font-bold text-white";
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
            {label}
            {count > 0 && (
                <span className={badgeClassName} style={badgeStyle}>
                    {count}
                </span>
            )}
        </button>
    );
};

export default function MainEventPage() {
    const [activeTab, setActiveTab] = useState('All Events');

    const renderContent = () => {
        switch (activeTab) {
            case 'Upcoming': return <UpcomingEvents />;
            case 'Ongoing': return <OngoingEvents />;
            case 'Calendar View': return <CalendarEventView />;
            case 'All Events':
            default: return <AllEvents />;
        }
    };

    return (
        <div className="bg-slate-50 font-sans">
            <div className="w-full max-w-7xl mx-auto">
                <div className="bg-white rounded-xl shadow-lg p-5 sm:p-6">
                    <header className="mb-6 pb-4 border-b border-gray-200">
                        <h1 className="text-xl font-bold text-gray-900">Event Management</h1>
                        <p className="text-sm text-gray-600 mt-1">
                            Organize and manage community events, meetings, and gatherings.
                        </p>
                    </header>
                    <nav className="flex items-center space-x-2 mb-4">
                        <Tab label="All Events" isActive={activeTab === 'All Events'} onClick={() => setActiveTab('All Events')} />
                        <Tab label="Upcoming" count={upcomingEventsData.length} isActive={activeTab === 'Upcoming'} onClick={() => setActiveTab('Upcoming')} />
                        <Tab label="Ongoing" count={ongoingEventData ? 1 : 0} isActive={activeTab === 'Ongoing'} onClick={() => setActiveTab('Ongoing')} />
                        <Tab label="Calendar View" isActive={activeTab === 'Calendar View'} onClick={() => setActiveTab('Calendar View')} />
                    </nav>
                    <main>
                       {renderContent()}
                    </main>
                </div>
            </div>
        </div>
    );
};