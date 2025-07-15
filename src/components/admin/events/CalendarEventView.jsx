import { Calendar, ChevronLeft, ChevronRight, MapPin, Users } from 'lucide-react';
import React, { useState, useEffect } from 'react';

const allEventsData = [
    { id: 1, title: "Town Hall Meeting - Budget Discussion", description: "Community meeting to discuss the proposed 2024 budget allocation", date: "2024-02-15T19:00:00", location: "City Hall Auditorium", attendees: 156, capacity: 200, registered: 156, organizer: "Sarah Johnson", tags: ["upcoming", "Government", "Registration Required"], status: 'upcoming', category: 'Government' },
    { id: 2, title: "Youth Council Meeting", description: "Monthly meeting for youth representatives and community leaders", date: "2024-02-12T16:00:00", location: "Youth Center", attendees: 25, capacity: 50, registered: 25, status: 'ongoing', progress: 100, attendanceRate: 83, category: 'Youth', tags: ["ongoing", "Youth"], organizer: "Admin" },
    { id: 3, title: "Community Garden Workshop", description: "Learn about sustainable gardening practices and community involvement", date: "2024-02-20T10:00:00", location: "Central Park Pavilion", attendees: 0, registered: 34, capacity: 50, organizer: "Mike Chen", category: "Environment", status: 'upcoming', tags: ["upcoming", "Environment", "Workshop"] },
    { id: 4, title: "Climate Action Planning Session", description: "Collaborative session to develop local climate action strategies", date: "2024-03-05T14:00:00", location: "Environmental Center", attendees: 0, registered: 12, capacity: 75, organizer: "Lisa Brown", category: "Environment", status: 'upcoming', tags: ["upcoming", "Planning", "Environment"] },
];

const upcomingEventsData = allEventsData.filter(e => e.status === 'upcoming');

export default function CalendarEventView() {
    const [currentDate, setCurrentDate] = useState(new Date(2024, 1, 1));
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [nepaliDateConverter, setNepaliDateConverter] = useState(null);

    useEffect(() => {
        const script = document.createElement('script');
        script.src = "https://cdn.jsdelivr.net/npm/nepali-date-converter/dist/nepali-date-converter.umd.js";
        script.onload = () => setNepaliDateConverter(() => window.nepaliDate);
        document.head.appendChild(script);

        const initialEvent = allEventsData.find(e => new Date(e.date).getMonth() === currentDate.getMonth());
        setSelectedEvent(initialEvent);

        return () => {
            if (document.head.contains(script)) document.head.removeChild(script);
        };
    }, []);

    useEffect(() => {
        const eventInNewMonth = allEventsData.find(e => new Date(e.date).getMonth() === currentDate.getMonth());
        setSelectedEvent(eventInNewMonth || null);
    }, [currentDate]);

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

    const thisMonthEvents = allEventsData.filter(e => {
        const d = new Date(e.date);
        return d.getMonth() === month && d.getFullYear() === year;
    });
    const nextMonthEventsCount = allEventsData.filter(e => {
        const d = new Date(e.date);
        return d.getMonth() === month + 1 && d.getFullYear() === year;
    }).length;
    const totalAttendeesThisMonth = thisMonthEvents.reduce((acc, e) => acc + e.attendees, 0);

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
                            {calendarDays.map(day => {
                                const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
                                const dayDate = new Date(year, month, day);
                                const nepaliDateObj = getNepaliDate(dayDate);
                                const dayEvents = allEventsData.filter(e => new Date(e.date).toDateString() === dayDate.toDateString());
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
                                                <div key={event.id} onClick={() => setSelectedEvent(event)} className={`flex items-center gap-1 p-0.5 rounded cursor-pointer group ${selectedEvent?.id === event.id ? 'bg-[#ff5c00]' : 'bg-gray-100 hover:bg-gray-200'}`}>
                                                    <span className="w-1 h-1 rounded-full" style={{ backgroundColor: categoryColors[event.category] || categoryColors.default }}></span>
                                                    <span className={`text-[10px] font-semibold truncate ${selectedEvent?.id === event.id ? 'text-white' : 'text-gray-700 group-hover:text-black'}`}>{event.title}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
                <div className="w-full lg:w-64 flex-shrink-0 ">
                    <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6 lg:mb-6">
                        <h3 className="text-base font-bold text-gray-800 mb-3">Upcoming This Week</h3>
                        <div className="space-y-3">
                            {upcomingEventsData.slice(0, 3).map(event => (
                                <div key={event.id} className="flex items-start gap-3">
                                    <span className="w-2 h-2 rounded-full mt-1.5" style={{ backgroundColor: categoryColors[event.category] || categoryColors.default }}></span>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-700">{event.title}</p>
                                        <p className="text-xs text-gray-500">{new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, {new Date(event.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
                                    </div>
                                </div>
                            ))}
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
                            <span className="px-3 py-1 text-sm font-semibold rounded-full" style={{ backgroundColor: 'rgba(255, 92, 0, 0.1)', color: '#b45309' }}>{selectedEvent.category}</span>
                            <h3 className="text-xl font-bold text-gray-800 mt-3">{selectedEvent.title}</h3>
                            <p className="text-sm text-gray-600 mt-2 max-w-2xl">{selectedEvent.description}</p>
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
                                <div className="text-sm text-gray-600">{new Date(selectedEvent.date).toLocaleString([], { dateStyle: 'full', timeStyle: 'short' })}</div>
                                {getNepaliDate(new Date(selectedEvent.date)) && <div className="text-xs text-gray-500">{getNepaliDate(new Date(selectedEvent.date)).getBS().strMonth} {getNepaliDate(new Date(selectedEvent.date)).getBS().date}, {getNepaliDate(new Date(selectedEvent.date)).getBS().year}</div>}
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <MapPin className="w-6 h-6 text-gray-400" />
                            <div>
                                <div className="text-sm font-semibold text-gray-700">Location</div>
                                <div className="text-sm text-gray-600">{selectedEvent.location}</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Users className="w-6 h-6 text-gray-400" />
                            <div>
                                <div className="text-sm font-semibold text-gray-700">Attendees</div>
                                <div className="text-sm text-gray-600">{selectedEvent.registered} / {selectedEvent.capacity} registered</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
