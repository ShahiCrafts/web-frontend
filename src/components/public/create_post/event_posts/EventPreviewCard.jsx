import React from 'react';
import {
  Heart,
  Upload,
  CheckCircle,
} from 'lucide-react';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80';
const FALLBACK_AVATAR = 'https://via.placeholder.com/40?text=';

// Date Display Component
function CalendarDate({ dateString }) {
  const date = dateString ? new Date(dateString) : new Date();
  const month = date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
  const day = date.getDate();

  return (
    <div className="w-16 h-16 bg-gray-100 border border-gray-200 rounded-lg flex flex-col items-center justify-center shadow-sm">
      <div className="text-xs font-bold" style={{ color: '#ff5c00' }}>{month}</div>
      <div className="text-3xl font-bold text-gray-800">{day}</div>
    </div>
  );
}

// Attendees Preview
function AttendeeAvatars({ attendees = [] }) {
  const visible = attendees.slice(0, 2);
  const remaining = attendees.length > 2 ? attendees.length - 2 : 0;

  return (
    <div className="flex items-center -space-x-3">
      {visible.map((a, i) => (
        <img
          key={i}
          src={a.avatarUrl}
          alt={a.name}
          title={a.name}
          className="w-9 h-9 rounded-full border-2 border-white object-cover bg-gray-200"
        />
      ))}
      {remaining > 0 && (
        <div className="w-9 h-9 rounded-full bg-gray-700 text-white text-xs font-bold flex items-center justify-center border-2 border-white">
          +{remaining}
        </div>
      )}
    </div>
  );
}

// Main Card
export default function EventPreviewCard({
  title,
  description,
  host,
  date,
  time,
  location,
  status = 'UPCOMING',
  banner,
  requireRsvp,
  hostAvatar,
  attendees = [
    { name: 'Alex', avatarUrl: 'https://i.pravatar.cc/80?u=1' },
    { name: 'Maria', avatarUrl: 'https://i.pravatar.cc/80?u=2' },
    { name: 'John', avatarUrl: 'https://i.pravatar.cc/80?u=3' },
  ],
}) {
  const formattedDay = date
    ? new Date(date).toLocaleDateString('en-US', { weekday: 'short' })
    : 'TBA';

  return (
    <div className="font-sans flex items-center justify-center">
      <div className="bg-white border border-gray-200 rounded-xl w-full max-w-2xl overflow-hidden">

        {/* Banner */}
        <div className="relative">
          <img
            src={banner || FALLBACK_IMAGE}
            alt="Event Banner"
            className="w-full h-52 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute top-4 right-4">
            <span className="bg-white/20 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full border border-white/30">
              {status}
            </span>
          </div>
          <div className="absolute bottom-4 left-4 flex items-center gap-3">
            <img
              src={hostAvatar || `${FALLBACK_AVATAR}${host?.charAt(0) || 'H'}`}
              alt="Host"
              className="w-10 h-10 rounded-full border-2 border-white/50"
            />
            <div>
              <p className="text-sm text-gray-200">Hosted by</p>
              <p className="font-semibold text-white">{host || 'Your Name'}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* About */}
          <div>
            <h2 className="font-semibold text-lg text-gray-800 mb-2">About this event</h2>
            <p className="text-gray-700 whitespace-pre-line leading-relaxed">
              {description?.trim() ||
                'A detailed description of your event will appear here. Let attendees know what to expect!'}
            </p>
          </div>

          {/* Info Section */}
          <div className="flex items-center justify-between gap-5 px-1">
            <CalendarDate dateString={date} />
            <div className="flex flex-col flex-grow overflow-hidden">
              <h3 className="text-base font-semibold text-gray-800 truncate">
                {title || 'Your Awesome Event'}
              </h3>
              <p className="text-sm text-gray-500 truncate">
                {formattedDay} {time || 'TBA'} &middot; {location || 'TBA'}
              </p>
            </div>
            <AttendeeAvatars attendees={attendees} />
          </div>
        </div>

        {/* Footer */}
        <footer className="p-4 bg-gray-50 border-t border-gray-200 flex flex-wrap items-center justify-between gap-4">
          {/* Left Buttons */}
          <div className="flex gap-4 text-gray-600">
            <button className="flex items-center space-x-1.5 hover:text-rose-500 transition-colors duration-200 group">
              <Heart className="w-5 h-5" />
              <span className="text-sm font-medium">Interested</span>
            </button>
            <button className="flex items-center space-x-1.5 hover:text-gray-900 transition-colors duration-200">
              <Upload className="w-5 h-5" />
              <span className="text-sm font-medium">Share</span>
            </button>
          </div>

          {/* Right RSVP */}
          {requireRsvp && (
            <div className="flex flex-col items-end">
              <button
                className="bg-[#ff5c00] hover:bg-orange-700 text-white text-sm font-semibold py-2 px-5 rounded-lg focus:outline-none flex items-center gap-2"
              >
                <CheckCircle className="w-5 h-5" />
                RSVP Now
              </button>
            </div>
          )}
        </footer>
      </div>
    </div>
  );
}
