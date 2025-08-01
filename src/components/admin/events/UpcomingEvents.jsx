import React from 'react';
import { Calendar, Eye, MapPin, MoreHorizontal, Plus, Clock, Users } from "lucide-react";
import { useFetchEvents } from '../../../hooks/admin/useEventTan'; // Import the event hook
import { Link } from 'react-router-dom'; // Assuming you might use this for "Schedule Event" or "Preview"

// Reusable UI components
const EventTag = ({ label }) => (
    <span className="px-3 py-1 text-xs font-semibold rounded bg-gray-100 text-gray-800">{label}</span>
);
const Tag = ({ children }) => (
  <span className="px-2.5 py-0.5 text-xs font-semibold rounded bg-gray-100 text-gray-800">{children}</span>
);
const StatusTag = ({ children, status }) => {
    let classes = 'px-2.5 py-0.5 text-xs font-semibold rounded';
    switch(status) {
        case 'upcoming': classes += ' bg-green-100 text-green-800'; break;
        case 'ongoing': classes += ' bg-orange-100 text-orange-800'; break;
        case 'closed': classes += ' bg-red-100 text-red-800'; break;
        default: classes += ' bg-gray-100 text-gray-800';
    }
    return <span className={classes}>{children}</span>;
};

// Helper to check if an event starts today
const isToday = (eventDate) => {
    const today = new Date();
    const date = new Date(eventDate);
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
};

export default function UpcomingEvents() {
    // Fetch only events with the 'Upcoming' status
    const { data: eventsData, isLoading, isError, error } = useFetchEvents({
        status: 'Upcoming',
        limit: 100, // Fetch more data for the card view, or adjust based on performance needs
    });

    const events = eventsData?.events || [];
    const totalCount = eventsData?.totalEvents || 0;

    if (isError) {
        return <div className="text-center p-4 text-red-600">Error fetching upcoming events: {error.message}</div>;
    }

    return (
        <div className="bg-white rounded-b-lg p-2 sm:p-2">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                <div>
                    <h2 className="text-lg sm:text-xl font-bold text-gray-800">Upcoming Events ({totalCount})</h2>
                    <p className="text-sm text-gray-500">Events scheduled for the future with registration and preparation tools</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                    <button className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100">
                        <Eye className="w-4 h-4" /> Preview Mode
                    </button>
                    <button className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-bold text-white rounded-md hover:opacity-90" style={{ backgroundColor: '#ff5c00' }}>
                        <Plus className="w-4 h-4" /> Schedule Event
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {isLoading ? (
                    <div className="text-center p-8 text-gray-500 col-span-full">Loading upcoming events...</div>
                ) : events.length === 0 ? (
                    <div className="text-center p-8 text-gray-500 col-span-full">No upcoming events found.</div>
                ) : (
                    events.map(event => (
                        <div key={event._id} className="bg-gray-50/50 border border-gray-200 rounded-lg p-4 flex flex-col justify-between">
                            <div>
                                <div className="flex justify-between items-start mb-2">
                                    {isToday(event.eventStartDate) && (
                                        <div className="flex items-center gap-1.5 px-2 py-0.5 text-xs font-semibold rounded-md" style={{ color: '#b45309', backgroundColor: 'rgba(255, 92, 0, 0.1)' }}>
                                            <Clock className="w-3 h-3" /> Today
                                        </div>
                                    )}
                                    <button className="text-gray-500 hover:text-gray-700">
                                        <MoreHorizontal className="w-5 h-5" />
                                    </button>
                                </div>
                                <h3 className="text-base sm:text-lg font-bold text-gray-800">{event.title}</h3>
                                <p className="text-xs sm:text-sm text-gray-600 mt-1">{event.eventDescription}</p>
                                <div className="space-y-1 mt-3 text-xs sm:text-sm text-gray-700">
                                    <div className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-gray-500" />{new Date(event.eventStartDate).toLocaleString()}</div>
                                    <div className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-gray-500" />{event.locationDetails}</div>
                                </div>
                                <div className="mt-3">
                                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                                        <span>Registration Progress</span>
                                        <span className="font-semibold">{Math.round(event.registrationProgress)}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div className="h-2 rounded-full" style={{ width: `${event.registrationProgress}%`, backgroundColor: '#ff5c00' }}></div>
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">{event.rsvpUsers?.length || 0} / {event.maxAttendees} registered</div>
                                </div>
                            </div>

                            <div className="flex justify-between items-center mt-4 border-t border-gray-200 pt-2">
                                <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-600">
                                    <img src={`https://i.pravatar.cc/24?u=${event.author?.email}`} alt={event.author?.fullName} className="w-5 h-5 sm:w-6 sm:h-6 rounded-full" />
                                    {event.author?.fullName || 'N/A'}
                                </div>
                                <div className="flex flex-wrap gap-1">
                                    {event.tags.map(tag => <Tag key={tag}>{tag}</Tag>)}
                                    {event.requireRSVP && <Tag>Registration Required</Tag>}
                                    {event.category?.name && <Tag>{event.category.name}</Tag>}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}