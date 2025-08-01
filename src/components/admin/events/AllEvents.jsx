import React, { useState, useEffect, useRef } from 'react';
import { Calendar, ChevronDown, Clock, MapPin, MoreHorizontal, Plus, Search, Users, Info } from "lucide-react";
import { useFetchEvents } from '../../../hooks/admin/useEventTan';
import { useFetchCategories } from '../../../hooks/admin/useCategoryTan';
import Pagination from '../../common/Pagination';

const FilterDropdown = ({ children, value, onChange }) => (
    <div className="relative">
        <select
            value={value}
            onChange={onChange}
            className="appearance-none w-full md:w-auto bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#ff5c00]"
        >
            {children}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
    </div>
);

const EventTag = ({ label, color }) => {
    const baseColors = {
        upcoming: 'bg-green-100 text-green-800',
        ongoing: 'bg-orange-100 text-orange-800',
        closed: 'bg-red-100 text-red-800',
        default: 'bg-gray-100 text-gray-800',
    };
    const tagColors = {
        'Registration Required': 'bg-orange-100 text-orange-800',
        'Government': 'bg-gray-100 text-gray-800',
        'Youth': 'bg-blue-100 text-blue-800',
        'Environment': 'bg-green-100 text-green-800'
    };
    const statusColor = baseColors[color] || baseColors.default;
    const generalTagColor = tagColors[label] || tagColors.default;

    return <span className={`px-2.5 py-0.5 text-xs font-semibold rounded ${statusColor} ${generalTagColor}`}>{label}</span>;
};


export default function AllEvents() {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [showDownloadMenu, setShowDownloadMenu] = useState(false);
    const downloadRef = useRef(null);

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

    const { data: categoriesData, isLoading: isCategoriesLoading } = useFetchCategories({});
    const categories = categoriesData?.categories || [];

    const { data: eventsData, isLoading: isEventsLoading, isError: isEventsError, error: eventsError } = useFetchEvents({
        page,
        limit,
        search: debouncedSearchTerm,
        sortBy: 'eventStartDate',
        sortOrder: 'asc',
        status: statusFilter,
        categoryId: categoryFilter,
    });

    // --- CRITICAL DEBUGGING LOG ---
    console.log("eventsData:", eventsData);
    console.log("isEventsLoading:", isEventsLoading);
    console.log("eventsData?.events:", eventsData?.events);
    // ------------------------------

    // Use a temporary variable to be extra defensive
    const eventsToDisplay = eventsData?.events || [];
    const totalEvents = eventsData?.totalEvents || 0;
    const totalPages = eventsData?.totalPages || 0;

    if (isEventsError) {
        return <div className="p-4 text-red-600 text-center">Error: {eventsError.message}</div>;
    }

    return (
        <div className="bg-white rounded-b-lg p-2 sm:p-2 space-y-6">
            {/* ... (Header and Search/Filter sections remain the same) ... */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                <div>
                    <h2 className="text-lg sm:text-xl font-bold text-gray-800">Community Events</h2>
                    <p className="text-sm text-gray-500">Manage community events, meetings, and gatherings</p>
                </div>
                <button className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-bold text-white rounded-md hover:opacity-90" style={{ backgroundColor: '#ff5c00' }}>
                    <Plus className="w-4 h-4" /> Create Event
                </button>
            </div>

            <div className="flex flex-col md:flex-row gap-3">
                <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search events..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff5c00]"
                    />
                </div>
                <div className="flex gap-2">
                    <FilterDropdown label="All Status" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                        <option value="">All Status</option>
                        <option value="Upcoming">Upcoming</option>
                        <option value="Ongoing">Ongoing</option>
                        <option value="Closed">Closed</option>
                    </FilterDropdown>
                    <FilterDropdown label="All Categories" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                        <option value="">All Categories</option>
                        {isCategoriesLoading ? (
                            <option disabled>Loading...</option>
                        ) : (
                            categories.map(cat => (
                                <option key={cat._id} value={cat._id}>{cat.name}</option>
                            ))
                        )}
                    </FilterDropdown>
                </div>
            </div>

            {/* Events List */}
            <div className="space-y-4">
                {isEventsLoading ? (
                    <div className="text-center p-8 text-gray-500">Loading events...</div>
                ) : eventsToDisplay.length === 0 ? (
                    <div className="text-center p-8 text-gray-500">
                        <div className="flex flex-col items-center gap-3 max-w-sm mx-auto">
                            <Info size={40} className="text-gray-400" />
                            <h3 className="text-lg font-semibold text-gray-700">No Events Found</h3>
                            <p className="text-sm text-gray-500 text-center">
                                No events match your search or filters.
                            </p>
                        </div>
                    </div>
                ) : (
                    eventsToDisplay.map(event => (
                        <div key={event._id} className="bg-gray-50/50 border border-gray-200 rounded-lg p-4 sm:p-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="flex items-center gap-2 sm:gap-3 mb-2">
                                        <Clock className="w-4 h-4 text-gray-500" />
                                        <h3 className="text-base sm:text-lg font-bold text-gray-800">{event.title}</h3>
                                    </div>
                                    <p className="text-xs sm:text-sm text-gray-600 ml-6 sm:ml-8">{event.eventDescription}</p>
                                </div>
                                <button className="text-gray-500 hover:text-gray-700"><MoreHorizontal className="w-5 h-5" /></button>
                            </div>

                            <div className="mt-4 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 ml-6 sm:ml-8">
                                <div className="space-y-2 text-xs sm:text-sm">
                                    <div className="flex items-center gap-1.5 text-gray-700"><Calendar className="w-4 h-4 text-gray-500" />{new Date(event.eventStartDate).toLocaleString()}</div>
                                    <div className="flex items-center gap-1.5 text-gray-700"><MapPin className="w-4 h-4 text-gray-500" />{event.locationDetails}</div>
                                    <div className="flex flex-wrap gap-1.5 mt-2">
                                        <EventTag label={event.calculatedStatus} color={event.calculatedStatus.toLowerCase()} />
                                        {event.tags.map(tag => <EventTag key={tag} label={tag} color="gray" />)}
                                        {event.requireRSVP && <EventTag label="Registration Required" color="orange" />}
                                        {event.category?.name && <EventTag label={event.category.name} color="gray" />}
                                    </div>
                                </div>

                                <div className="w-full lg:w-auto">
                                    {event.calculatedStatus === 'Upcoming' && (
                                        <>
                                            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-700"><Users className="w-4 h-4 text-gray-500" /> {event.rsvpUsers?.length || 0} / {event.maxAttendees} registered</div>
                                            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                                <div className="h-2 rounded-full" style={{ width: `${event.registrationProgress}%`, backgroundColor: '#ff5c00' }}></div>
                                            </div>
                                        </>
                                    )}
                                    <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 mt-2">
                                        <img src={`https://i.pravatar.cc/24?u=${event.author?.email}`} alt={event.author?.fullName} className="w-5 h-5 sm:w-6 sm:h-6 rounded-full" />
                                        Organized by {event.author?.fullName || 'N/A'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {eventsToDisplay.length > 0 && (
                <div className="mt-6">
                    <Pagination
                        currentPage={page}
                        totalCount={totalEvents}
                        itemsPerPage={limit}
                        totalPages={totalPages}
                        onPageChange={setPage}
                        onLimitChange={(newLimit) => {
                            setPage(1);
                            setLimit(newLimit);
                        }}
                    />
                </div>
            )}
        </div>
    );
}