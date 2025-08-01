import { Calendar, ChevronLeft, ChevronRight, MapPin, Users, Info } from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';
import { useFetchEvents } from '../../../hooks/admin/useEventTan'; // Import event hook
import { useFetchCategories } from '../../../hooks/admin/useCategoryTan'; // Import category hook

// This script is for Nepali date conversion
const useNepaliDate = () => {
    const [nepaliDateConverter, setNepaliDateConverter] = useState(null);
    useEffect(() => {
        const script = document.createElement('script');
        script.src = "https://cdn.jsdelivr.net/npm/nepali-date-converter/dist/nepali-date-converter.umd.js";
        script.onload = () => setNepaliDateConverter(() => window.nepaliDate);
        document.head.appendChild(script);
        return () => {
            if (document.head.contains(script)) document.head.removeChild(script);
        };
    }, []);
    return nepaliDateConverter;
};

export default function CalendarEventView() {
    const [currentDate, setCurrentDate] = useState(new Date()); // Start with the current month
    const [selectedEvent, setSelectedEvent] = useState(null);
    const nepaliDateConverter = useNepaliDate();

    // Fetch all events without pagination/status filters to populate the calendar
    const { data: eventsData, isLoading, isError, error } = useFetchEvents({
        limit: 1000, // A large number to get all events, or use -1 if your API supports it
        sortBy: 'eventStartDate',
        sortOrder: 'asc',
    });

    const allEvents = eventsData?.events || [];

    // Filter events for the current month on the frontend
    const thisMonthEvents = allEvents.filter(e => {
        const d = new Date(e.eventStartDate);
        return d.getMonth() === currentDate.getMonth() && d.getFullYear() === currentDate.getFullYear();
    });

    useEffect(() => {
        const initialEvent = thisMonthEvents.length > 0 ? thisMonthEvents[0] : null;
        setSelectedEvent(initialEvent);
    }, [thisMonthEvents]);

    const today = new Date();
    const daysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
    const firstDayOfMonth = (y, m) => new Date(y, m, 1).getDay();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const monthName = currentDate.toLocaleString('default', { month: 'long' });
    const totalDays = daysInMonth(year, month);
    const startingDay = firstDayOfMonth(year, month);
    const calendarDays = Array.from({ length: totalDays }, (_, i) => i + 1);
    const emptySlots = Array.from({ length: startingDay });

    const changeMonth = (offset) => setCurrentDate(prev => {
        const newDate = new Date(prev);
        newDate.setMonth(prev.getMonth() + offset);
        return newDate;
    });
    const goToToday = () => setCurrentDate(new Date());
    const getNepaliDate = (date) => nepaliDateConverter ? new nepaliDateConverter(date) : null;

    const categoryColors = {
        'Government': '#3b82f6', 'Environment': '#22c55e', 'Youth': '#a855f7',
        'Arts & Culture': '#ec4899', 'Community': '#f59e0b', 'default': '#9ca3af'
    };

    if (isError) {
        return <div className="p-4 text-red-600 text-center">Error fetching events: {error.message}</div>;
    }

    // Quick stats for the sidebar
    const nextMonthEventsCount = allEvents.filter(e => {
        const d = new Date(e.eventStartDate);
        return d.getMonth() === month + 1 && d.getFullYear() === year;
    }).length;
    const totalAttendeesThisMonth = thisMonthEvents.reduce((acc, e) => acc + (e.rsvpUsers?.length || 0), 0);
    const upcomingThisWeek = thisMonthEvents.filter(e => {
        const eventStart = new Date(e.eventStartDate);
        const next7Days = new Date();
        next7Days.setDate(today.getDate() + 7);
        return eventStart >= today && eventStart <= next7Days;
    }).slice(0,3);


    return (
        <div className="p-2 sm:p-2">
            <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-grow min-w-0">
                    <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
                        <div className="flex items-baseline gap-2">
                            <span className="text-lg font-bold text-gray-800">{monthName}</span>
                            <span className="text-base font-semibold text-gray-500">{year}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <button onClick={goToToday} className="px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100">
                                Today
                            </button>
                            <div className="flex items-center">
                                <button onClick={() => changeMonth(-1)} className="p-1.5 rounded-l-md border border-r-0 border-gray-300 bg-white hover:bg-gray-100">
                                    <ChevronLeft className="w-4 h-4 text-gray-600" />
                                </button>
                                <button onClick={() => changeMonth(1)} className="p-1.5 rounded-r-md border border-gray-300 bg-white hover:bg-gray-100">
                                    <ChevronRight className="w-4 h-4 text-gray-600" />
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <div className="grid grid-cols-7 min-w-[500px] border-t border-l border-gray-200">
                            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
                                <div key={day} className="text-center text-xs font-bold py-2 text-gray-500 border-b border-r border-gray-200 bg-gray-100/70">{day}</div>
                            ))}
                            {emptySlots.map((_, i) => <div key={`empty-${i}`} className="border-b border-r border-gray-200 h-20 sm:h-24"></div>)}
                            {isLoading ? (
                                <div className="col-span-7 text-center p-8 text-gray-500">Loading calendar...</div>
                            ) : thisMonthEvents.length === 0 ? (
                                <div className="col-span-7 text-center p-8 text-gray-500">
                                    <div className="flex flex-col items-center gap-3 max-w-sm mx-auto">
                                        <Info size={40} className="text-gray-400" />
                                        <h3 className="text-lg font-semibold text-gray-700">No Events This Month</h3>
                                    </div>
                                </div>
                            ) : (
                                calendarDays.map(day => {
                                    const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
                                    const dayDate = new Date(year, month, day);
                                    const nepaliDateObj = getNepaliDate(dayDate);
                                    const dayEvents = thisMonthEvents.filter(e => new Date(e.eventStartDate).toDateString() === dayDate.toDateString());
                                    return (
                                        <div key={day} className={`relative p-1.5 border-b border-r border-gray-200 h-20 sm:h-24 flex flex-col gap-1 transition-colors ${isToday ? 'bg-orange-50' : 'bg-white hover:bg-gray-50/50'}`}>
                                            <div className="flex justify-between items-center">
                                                <span className={`font-semibold text-[11px] ${isToday ? 'bg-[#ff5c00] text-white rounded-full w-5 h-5 flex items-center justify-center' : 'text-gray-700'}`}>
                                                    {day}
                                                </span>
                                                {nepaliDateObj && <span className="text-[9px] text-gray-400 font-medium">{nepaliDateObj.getBS().date}</span>}
                                            </div>
                                            <div className="flex-grow space-y-1 overflow-hidden">
                                                {dayEvents.slice(0, 2).map(event => (
                                                    <div key={event._id} onClick={() => setSelectedEvent(event)} className={`flex items-center gap-1 p-0.5 rounded cursor-pointer group ${selectedEvent?._id === event._id ? 'bg-[#ff5c00]' : 'bg-gray-100 hover:bg-gray-200'}`}>
                                                        <span className="w-1 h-1 rounded-full" style={{ backgroundColor: categoryColors[event.category?.name] || categoryColors.default }}></span>
                                                        <span className={`text-[10px] font-semibold truncate ${selectedEvent?._id === event._id ? 'text-white' : 'text-gray-700 group-hover:text-black'}`}>{event.title}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>
                <div className="w-full lg:w-64 flex-shrink-0 ">
                    <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6 lg:mb-6">
                        <h3 className="text-base font-bold text-gray-800 mb-3">Upcoming This Week</h3>
                        <div className="space-y-3">
                            {upcomingThisWeek.length > 0 ? (
                                upcomingThisWeek.map(event => (
                                    <div key={event._id} className="flex items-start gap-3">
                                        <span className="w-2 h-2 rounded-full mt-1.5" style={{ backgroundColor: categoryColors[event.category?.name] || categoryColors.default }}></span>
                                        <div>
                                            <p className="text-sm font-semibold text-gray-700">{event.title}</p>
                                            <p className="text-xs text-gray-500">{new Date(event.eventStartDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, {new Date(event.eventStartDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-xs text-gray-500">No events this week.</div>
                            )}
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <h3 className="text-base font-bold text-gray-800 mb-3">Quick Stats</h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">This Month</span>
                                <span className="font-semibold text-gray-800">{thisMonthEvents.length} events</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Next Month</span>
                                <span className="font-semibold text-gray-800">{nextMonthEventsCount} events</span>
                            </div>
                            <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                                <span className="text-gray-600">Total Attendees</span>
                                <span className="font-semibold text-gray-800">{totalAttendeesThisMonth.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {selectedEvent && (
                <div className="mt-6 p-4 sm:p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
                        <div>
                            <span className="px-3 py-1 text-sm font-semibold rounded-full" style={{ backgroundColor: 'rgba(255, 92, 0, 0.1)', color: '#b45309' }}>{selectedEvent.category?.name || 'N/A'}</span>
                            <h3 className="text-xl font-bold text-gray-800 mt-3">{selectedEvent.title}</h3>
                            <p className="text-sm text-gray-600 mt-2 max-w-2xl">{selectedEvent.eventDescription}</p>
                        </div>
                        <div className="flex gap-2">
                            <button className="px-4 py-2 text-sm font-semibold bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md">Manage</button>
                            <button className="text-white px-4 py-2 text-sm font-semibold rounded-md hover:opacity-90" style={{ backgroundColor: '#ff5c00' }}>View Details</button>
                        </div>
                    </div>
                    <div className="mt-6 pt-6 border-t border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex items-center gap-3">
                            <Calendar className="w-6 h-6 text-gray-400" />
                            <div>
                                <div className="text-sm font-semibold text-gray-700">Date and Time</div>
                                <div className="text-sm text-gray-600">{new Date(selectedEvent.eventStartDate).toLocaleString([], { dateStyle: 'full', timeStyle: 'short' })}</div>
                                {getNepaliDate(new Date(selectedEvent.eventStartDate)) && <div className="text-xs text-gray-500">{getNepaliDate(new Date(selectedEvent.eventStartDate)).getBS().strMonth} {getNepaliDate(new Date(selectedEvent.eventStartDate)).getBS().date}, {getNepaliDate(new Date(selectedEvent.eventStartDate)).getBS().year}</div>}
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <MapPin className="w-6 h-6 text-gray-400" />
                            <div>
                                <div className="text-sm font-semibold text-gray-700">Location</div>
                                <div className="text-sm text-gray-600">{selectedEvent.locationDetails}</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Users className="w-6 h-6 text-gray-400" />
                            <div>
                                <div className="text-sm font-semibold text-gray-700">Attendees</div>
                                <div className="text-sm text-gray-600">{selectedEvent.rsvpUsers?.length || 0} / {selectedEvent.maxAttendees} registered</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}