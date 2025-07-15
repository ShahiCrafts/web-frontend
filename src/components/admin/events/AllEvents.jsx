import { Calendar, ChevronDown, Clock, MapPin, MoreHorizontal, Plus, Search, Users } from "lucide-react";

const allEventsData = [
  { id: 1, title: "Town Hall Meeting - Budget Discussion", description: "Community meeting to discuss the proposed 2024 budget allocation", date: "2024-02-15T19:00:00", location: "City Hall Auditorium", attendees: 156, capacity: 200, registered: 156, organizer: "Sarah Johnson", tags: ["upcoming", "Government", "Registration Required"], status: 'upcoming', category: 'Government' },
  { id: 2, title: "Youth Council Meeting", description: "Monthly meeting for youth representatives and community leaders", date: "2024-02-12T16:00:00", location: "Youth Center", attendees: 25, capacity: 50, registered: 25, status: 'ongoing', progress: 100, attendanceRate: 83, category: 'Youth', tags: ["ongoing", "Youth"], organizer: "Admin" },
  { id: 3, title: "Community Garden Workshop", description: "Learn about sustainable gardening practices and community involvement", date: "2024-02-20T10:00:00", location: "Central Park Pavilion", attendees: 0, registered: 34, capacity: 50, organizer: "Mike Chen", category: "Environment", status: 'upcoming', tags: ["upcoming", "Environment", "Workshop"] },
  { id: 4, title: "Climate Action Planning Session", description: "Collaborative session to develop local climate action strategies", date: "2024-03-05T14:00:00", location: "Environmental Center", attendees: 0, registered: 12, capacity: 75, organizer: "Lisa Brown", category: "Environment", status: 'upcoming', tags: ["upcoming", "Planning", "Environment"] },
];

const FilterDropdown = ({ label }) => (
  <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
    {label}
    <ChevronDown className="w-4 h-4 text-gray-500" />
  </button>
);

const EventTag = ({ label, color }) => {
  const colors = {
    orange: 'bg-orange-100 text-orange-800',
    gray: 'bg-gray-100 text-gray-800',
  };
  if (color === 'orange') {
    return <span className="px-2.5 py-0.5 text-xs font-semibold rounded" style={{ backgroundColor: 'rgba(255, 92, 0, 0.1)', color: '#b45309' }}>{label}</span>
  }
  return <span className={`px-2.5 py-0.5 text-xs font-semibold rounded ${colors.gray}`}>{label}</span>
};

export default function AllEvents() {
  return (
    <div className="bg-white rounded-b-lg p-2 sm:p-2 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-800">Community Events</h2>
          <p className="text-sm text-gray-500">Manage community events, meetings, and gatherings</p>
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-bold text-white rounded-md hover:opacity-90" style={{ backgroundColor: '#ff5c00' }}>
          <Plus className="w-4 h-4" /> Create Event
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search events..."
            className="w-full pl-10 pr-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff5c00]"
          />
        </div>
        <div className="flex gap-2">
          <FilterDropdown label="All Status" />
          <FilterDropdown label="All Categories" />
        </div>
      </div>

      {/* Events List */}
      <div className="space-y-4">
        {allEventsData.filter(e => e.status !== 'ongoing').map(event => (
          <div key={event.id} className="bg-gray-50/50 border border-gray-200 rounded-lg p-4 sm:p-6">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 sm:gap-3 mb-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <h3 className="text-base sm:text-lg font-bold text-gray-800">{event.title}</h3>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 ml-6 sm:ml-8">{event.description}</p>
              </div>
              <button className="text-gray-500 hover:text-gray-700"><MoreHorizontal className="w-5 h-5" /></button>
            </div>

            <div className="mt-4 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 ml-6 sm:ml-8">
              <div className="space-y-2 text-xs sm:text-sm">
                <div className="flex items-center gap-1.5 text-gray-700"><Calendar className="w-4 h-4 text-gray-500" />{new Date(event.date).toLocaleString([], { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}</div>
                <div className="flex items-center gap-1.5 text-gray-700"><MapPin className="w-4 h-4 text-gray-500" />{event.location}</div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {(event.tags || []).map(tag => <EventTag key={tag} label={tag} color="orange" />)}
                </div>
              </div>

              <div className="w-full lg:w-auto">
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-700"><Users className="w-4 h-4 text-gray-500" /> {event.attendees} / {event.capacity} attendees</div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                  <div className="h-2 rounded-full" style={{ width: `${(event.attendees / event.capacity) * 100}%`, backgroundColor: '#ff5c00' }}></div>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 mt-2">
                  <img src={`https://i.pravatar.cc/24?u=${event.organizer}`} alt={event.organizer} className="w-5 h-5 sm:w-6 sm:h-6 rounded-full" />
                  Organized by {event.organizer}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
