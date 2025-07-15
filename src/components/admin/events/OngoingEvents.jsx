import { useState } from "react";
import {
  Clock, MapPin, MoreHorizontal, Users, AlertCircle, CheckCircle, Search
} from "lucide-react";

const Modal = ({ isOpen, onClose, title, children, maxWidth = 'max-w-lg' }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4">
      <div
        className={`bg-white rounded-lg shadow-xl w-full ${maxWidth} p-4 sm:p-6 animate-fade-in-up
          max-h-[90vh] overflow-y-auto
        `}
      // Added max height and scroll for very tall modals on small screens
      >
        <div className="flex justify-between items-center pb-3 border-b border-gray-200">
          <h3 className="text-base sm:text-lg font-bold text-gray-800">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <div className="mt-4">
          {children}
        </div>
      </div>
    </div>
  );
};

const Toast = ({ message, show }) => {
  if (!show) return null;
  return (
    <div className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded shadow-lg text-sm sm:text-base z-50">
      {message}
    </div>
  );
};

const allEventsData = [
  {
    id: 2,
    title: "Youth Council Meeting",
    description: "Monthly meeting for youth representatives and community leaders",
    date: "2024-02-12T16:00:00",
    location: "Youth Center",
    attendees: 25,
    capacity: 50,
    registered: 25,
    status: 'ongoing',
    progress: 100,
    attendanceRate: 83,
    category: 'Youth'
  },
];

const EventTag = ({ label }) => (
  <span className="px-3 py-1 text-xs font-semibold rounded bg-gray-100 text-gray-800 whitespace-nowrap">{label}</span>
  // Added whitespace-nowrap to prevent label wrap on small screens
);

export default function OngoingEvents() {
  const ongoingEvents = allEventsData.filter(e => e.status === 'ongoing');
  const [isAlertModalOpen, setAlertModalOpen] = useState(false);
  const [isCheckinModalOpen, setCheckinModalOpen] = useState(false);
  const [showAlertToast, setShowAlertToast] = useState(false);
  const [attendees, setAttendees] = useState([
    { id: 1, name: "Alice Johnson", checkedIn: false },
    { id: 2, name: "Bob Smith", checkedIn: false },
    { id: 3, name: "Peter Jones", checkedIn: true },
    { id: 4, name: "Mary Williams", checkedIn: false },
    { id: 5, name: "David Brown", checkedIn: true },
    { id: 6, name: "Susan Green", checkedIn: false },
  ]);

  const handleSendAlert = () => {
    setAlertModalOpen(false);
    setShowAlertToast(true);
    setTimeout(() => setShowAlertToast(false), 3000);
  };

  const handleCheckIn = (attendeeId) => {
    setAttendees(prev => prev.map(a => a.id === attendeeId ? { ...a, checkedIn: true } : a));
  };

  return (
    <>
      <div className="p-2 sm:p-2  max-w-7xl mx-auto">
        <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-1">Ongoing Events ({ongoingEvents.length})</h2>
        <p className="text-sm text-gray-500 mb-4">Events currently in progress with real-time management tools</p>

        {ongoingEvents.map(event => (
          <div
            key={event.id}
            className="relative bg-white border border-green-200 rounded-lg p-4 sm:p-6 flex flex-col gap-4 mb-4"
          >
            <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
              <MoreHorizontal className="w-5 h-5" />
            </button>

            <div
              className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-t border-gray-200 pt-2 md:border-t-0"
            >
              <div className="flex-1 md:pr-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="flex items-center gap-1 px-2 py-0.5 text-xs text-green-800 bg-green-100 rounded-full font-semibold whitespace-nowrap">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>LIVE
                  </span>
                  <EventTag label={event.category} />
                </div>

                <h3 className="text-base sm:text-lg font-bold text-gray-800 mt-2">{event.title}</h3>
                <p className="text-sm text-gray-600">{event.description}</p>

                <div className="mt-5 flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <button
                    onClick={() => setAlertModalOpen(true)}
                    className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100 w-full sm:w-auto"
                  >
                    <AlertCircle className="w-4 h-4" />Send Alert
                  </button>
                  <button
                    onClick={() => setCheckinModalOpen(true)}
                    className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100 w-full sm:w-auto"
                  >
                    <CheckCircle className="w-4 h-4" />Check-in Tool
                  </button>
                </div>
              </div>

              <div className="flex-1 flex flex-col md:flex-row md:items-center md:justify-between gap-6 md:border-l md:pl-10 md:-ml-2 md:border-gray-300">
                <div className="space-y-1 text-sm text-gray-700">
                  <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">EVENT DETAILS</div>
                  <div className="flex items-center gap-2"><Clock className="w-4 h-4" />16:00 - 18:00</div>
                  <div className="flex items-center gap-2"><MapPin className="w-4 h-4" />{event.location}</div>
                  <div className="flex items-center gap-2"><Users className="w-4 h-4" />{event.attendees} attendees present</div>
                </div>

                <div className="space-y-2 w-full max-w-xs md:max-w-[180px] lg:max-w-[180px]">
                  <div>
                    <div className="flex justify-between text-[13px] text-gray-600 mb-0.5">
                      <span>Progress</span>
                      <span className="font-semibold">{event.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: `${event.progress}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[13px] text-gray-600 mb-0.5">
                      <span>Attendance</span>
                      <span className="font-semibold">{event.attendanceRate}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="h-2 rounded-full" style={{ width: `${event.attendanceRate}%`, backgroundColor: '#ff5c00' }}></div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={isAlertModalOpen}
        onClose={() => setAlertModalOpen(false)}
        title="Send Alert to Attendees"
        maxWidth="max-w-md"
      >
        <textarea
          className="w-full h-32 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff5c00]"
          placeholder="Type your alert message..."
        />
        <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 mt-4">
          <button
            onClick={() => setAlertModalOpen(false)}
            className="px-4 py-2 text-sm font-semibold bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md w-full sm:w-auto"
          >
            Cancel
          </button>
          <button
            onClick={handleSendAlert}
            className="text-white px-4 py-2 text-sm font-semibold rounded-md hover:opacity-90 w-full sm:w-auto"
            style={{ backgroundColor: '#ff5c00' }}
          >
            Send Alert
          </button>
        </div>
      </Modal>

      <Modal
        isOpen={isCheckinModalOpen}
        onClose={() => setCheckinModalOpen(false)}
        title="Event Check-in Tool"
        maxWidth="max-w-4xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg border border-gray-200 w-full">
            <h4 className="font-bold text-gray-800">QR Code Check-in</h4>
            <p className="text-sm text-gray-500">Attendees scan to check in</p>
            <div className="my-4 p-4 bg-white border border-gray-300 rounded shadow flex items-center justify-center">
              <svg className="w-40 h-40" viewBox="0 0 256 256" aria-label="QR code placeholder">
                <path fill="#4A5568" d="M128 0h128v128h-128z M32 32h64v64h-64z M48 48h32v32h-32z M160 32h64v64h-64z M176 48h32v32h-32z M32 160h64v64h-64z M48 176h32v32h-32z M128 128h128v128h-128z M160 160h64v64h-64z" />
              </svg>
            </div>
            <div className="flex gap-2 w-full flex-wrap">
              <button className="flex-1 bg-gray-200 hover:bg-gray-300 text-sm rounded py-2 min-w-[120px]">Download</button>
              <button className="flex-1 bg-gray-200 hover:bg-gray-300 text-sm rounded py-2 min-w-[120px]">Share</button>
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">Search Attendee</label>
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search by name or email..."
                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff5c00]"
              />
            </div>
            <div className="max-h-64 overflow-y-auto space-y-2">
              {attendees.map(attendee => (
                <div
                  key={attendee.id}
                  className="flex justify-between items-center p-2 bg-gray-50 rounded border border-gray-300"
                >
                  <span>{attendee.name}</span>
                  {attendee.checkedIn ? (
                    <span className="text-green-600 text-sm flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" />Checked In
                    </span>
                  ) : (
                    <button
                      onClick={() => handleCheckIn(attendee.id)}
                      className="text-xs bg-gray-200 hover:bg-gray-300 rounded px-2 py-1"
                    >
                      Check In
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Modal>

      <Toast message="Alert sent successfully!" show={showAlertToast} />
    </>
  );
}
