import { Calendar, Eye, MapPin, MoreHorizontal, Plus, Clock } from "lucide-react";

const allEventsData = [
  { id: 1, title: "Town Hall Meeting - Budget Discussion", description: "Community meeting to discuss the proposed 2024 budget allocation", date: "2024-02-15T19:00:00", location: "City Hall Auditorium", attendees: 156, capacity: 200, registered: 156, organizer: "Sarah Johnson", tags: ["upcoming", "Government", "Registration Required"], status: 'upcoming', category: 'Government' },
  { id: 2, title: "Youth Council Meeting", description: "Monthly meeting for youth representatives and community leaders", date: "2024-02-12T16:00:00", location: "Youth Center", attendees: 25, capacity: 50, registered: 25, status: 'ongoing', progress: 100, attendanceRate: 83, category: 'Youth', tags: ["ongoing", "Youth"], organizer: "Admin" },
  { id: 3, title: "Community Garden Workshop", description: "Learn about sustainable gardening practices and community involvement", date: "2024-02-20T10:00:00", location: "Central Park Pavilion", attendees: 0, registered: 34, capacity: 50, organizer: "Mike Chen", category: "Environment", status: 'upcoming', tags: ["upcoming", "Environment", "Workshop"] },
  { id: 4, title: "Climate Action Planning Session", description: "Collaborative session to develop local climate action strategies", date: "2024-03-05T14:00:00", location: "Environmental Center", attendees: 0, registered: 12, capacity: 75, organizer: "Lisa Brown", category: "Environment", status: 'upcoming', tags: ["upcoming", "Planning", "Environment"] },
];

const upcomingEventsData = allEventsData.filter(e => e.status === 'upcoming');

const EventTag = ({ label }) => (
  <span className="px-3 py-1 text-xs font-semibold rounded bg-gray-100 text-gray-800">{label}</span>
);

export default function UpcomingEvents() {
  return (
    <div className="bg-white rounded-b-lg p-2 sm:p-2">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-800">Upcoming Events ({upcomingEventsData.length})</h2>
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
        {upcomingEventsData.map(event => (
          <div key={event.id} className="bg-gray-50/50 border border-gray-200 rounded-lg p-4 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-1.5 px-2 py-0.5 text-xs font-semibold rounded-md" style={{ color: '#b45309', backgroundColor: 'rgba(255, 92, 0, 0.1)' }}>
                  <Clock className="w-3 h-3" /> Today
                </div>
                <button className="text-gray-500 hover:text-gray-700">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-gray-800">{event.title}</h3>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">{event.description}</p>
              <div className="space-y-1 mt-3 text-xs sm:text-sm text-gray-700">
                <div className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-gray-500" />{new Date(event.date).toLocaleString([], { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}</div>
                <div className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-gray-500" />{event.location}</div>
              </div>
              <div className="mt-3">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Registration Progress</span>
                  <span className="font-semibold">{Math.round((event.registered / event.capacity) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="h-2 rounded-full" style={{ width: `${(event.registered / event.capacity) * 100}%`, backgroundColor: '#ff5c00' }}></div>
                </div>
                <div className="text-xs text-gray-500 mt-1">{event.registered} / {event.capacity} registered</div>
              </div>
            </div>

            <div className="flex justify-between items-center mt-4 border-t border-gray-200 pt-2">
              <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-600">
                <img src={`https://i.pravatar.cc/24?u=${event.organizer}`} alt={event.organizer} className="w-5 h-5 sm:w-6 sm:h-6 rounded-full" />
                {event.organizer}
              </div>
              <EventTag label={event.category} />
            </div>

            <div className="grid grid-cols-2 gap-2 mt-3">
              <button className="w-full py-1.5 sm:py-2 text-xs sm:text-sm font-semibold bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md">Manage</button>
              <button className="w-full py-1.5 sm:py-2 text-xs sm:text-sm font-semibold bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md">Preview</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
