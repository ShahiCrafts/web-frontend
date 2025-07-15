import React, { useState } from 'react';
import {
  Heart, Upload, CheckCircle,
  MapPin, Clock, Users, Calendar, Star
} from 'lucide-react';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80';
const FALLBACK_AVATAR = 'https://i.pravatar.cc/80?u=';

const CalendarDate = ({ dateString }) => {
  const date = dateString ? new Date(dateString) : new Date();
  const month = date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
  const day = date.getDate();
  return (
    <div className="w-14 h-14 bg-gradient-to-br from-orange-100 to-red-100 border-2 border-orange-300 rounded-2xl flex flex-col items-center justify-center text-orange-700 shadow text-xs font-semibold">
      <div>{month}</div>
      <div className="text-xl text-gray-800 font-bold">{day}</div>
    </div>
  );
};

const AttendeeAvatars = ({ attendees = [] }) => {
  const visible = attendees.slice(0, 3);
  const remaining = attendees.length > 3 ? attendees.length - 3 : 0;
  return (
    <div className="flex items-center -space-x-2">
      {visible.map((a, i) => (
        <img
          key={i}
          src={a.avatarUrl}
          alt={a.name}
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-white object-cover bg-gray-300"
        />
      ))}
      {remaining > 0 && (
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gray-700 text-white text-xs font-bold flex items-center justify-center border-2 border-white">
          +{remaining}
        </div>
      )}
    </div>
  );
};

export default function EventPostCardV3({ post }) {
  const [isLiked, setIsLiked] = useState(false);

  const {
    title = 'Tracking your health through numbers',
    locationDetails = 'Semarang, East Java',
    eventDescription,
    eventStartDate,
    authorId,
    attachments = [],
    status = 'UPCOMING',
    requireRSVP = true,
    interestedCount = 87,
    shareCount = 14,
  } = post || {};

  const banner = attachments[0] || FALLBACK_IMAGE;
  const hostName = authorId?.fullName || 'Event Organizer';
  const hostAvatar = authorId?.avatar || `${FALLBACK_AVATAR}${hostName.charAt(0)}`;

  const attendees = [
    { name: 'Alex Johnson', avatarUrl: `${FALLBACK_AVATAR}1` },
    { name: 'Maria Garcia', avatarUrl: `${FALLBACK_AVATAR}2` },
    { name: 'John Smith', avatarUrl: `${FALLBACK_AVATAR}3` },
    { name: 'Sarah Wilson', avatarUrl: `${FALLBACK_AVATAR}4` },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'UPCOMING': return 'bg-green-100 text-green-700 border-green-300';
      case 'LIVE': return 'bg-red-100 text-red-700 border-red-300';
      case 'ENDED': return 'bg-gray-200 text-gray-600 border-gray-300';
      default: return 'bg-blue-100 text-blue-700 border-blue-300';
    }
  };

  const formattedDay = eventStartDate
    ? new Date(eventStartDate).toLocaleDateString('en-US', { weekday: 'long' })
    : 'TBA';

  const formattedTime = eventStartDate
    ? new Date(eventStartDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    : 'TBA';

  return (
    <article className="font-sans bg-white flex justify-center">
      <div className="bg-white border border-gray-200 rounded-3xl w-full text-gray-900 p-4 sm:p-6 space-y-5">
        
        {/* Banner */}
        <div className="relative rounded-2xl overflow-hidden">
          <img src={banner} alt="Event Banner" className="w-full h-44 sm:h-52 object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

          {/* Status Badge */}
          <span className={`absolute top-3 left-3 text-xs font-bold px-3 py-1 rounded-full border ${getStatusColor(status)}`}>
            {status}
          </span>

          {/* Like Button */}
          <button
            onClick={() => setIsLiked(!isLiked)}
            className="absolute top-3 right-3 bg-white/80 p-2 rounded-full hover:bg-rose-100 transition"
          >
            <Heart className={`w-5 h-5 ${isLiked ? 'text-rose-500 fill-current' : 'text-gray-600'}`} />
          </button>

          {/* Host Info */}
          <div className="absolute bottom-3 left-3 flex items-center gap-3">
            <img
              src={hostAvatar}
              className="w-9 h-9 rounded-full border-2 border-white object-cover"
              alt="host avatar"
            />
            <div className="text-sm leading-tight text-white drop-shadow">
              <p className="text-xs">Hosted by</p>
              <p className="font-bold truncate">{hostName}</p>
            </div>
          </div>
        </div>

        {/* Title + Location */}
        <div className="space-y-1">
          <h1 className="text-lg font-bold leading-tight truncate">{title}</h1>
          <div className="flex items-center gap-1.5 text-gray-500 text-sm">
            <MapPin className="w-4 h-4" />
            <span className="truncate">{locationDetails}</span>
          </div>
        </div>

        {/* Date, Time, Attendees */}
        <div className="flex flex-wrap gap-4 justify-between items-center">
          <div className="flex items-center gap-4">
            <CalendarDate dateString={eventStartDate} />
            <div className="space-y-1 text-sm">
              <div className="flex items-center gap-1 text-gray-700">
                <Calendar className="w-4 h-4 text-orange-500" />
                <span>{formattedDay}</span>
              </div>
              <div className="flex items-center gap-1 text-gray-700">
                <Clock className="w-4 h-4 text-blue-500" />
                <span>{formattedTime}</span>
              </div>
            </div>
          </div>
          <AttendeeAvatars attendees={attendees} />
        </div>

        {/* About this event */}
        <div className="bg-gray-50 rounded-xl p-4 space-y-2 border border-gray-200">
          <h2 className="text-sm font-semibold flex items-center gap-2 text-yellow-600">
            <Star className="w-4 h-4" /> About this event
          </h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            {eventDescription || 'Join us for an insightful discussion and networking opportunity.'}
          </p>
        </div>

        {/* Actions Row */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-3 flex-wrap">
            <button
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition ${
                isLiked
                  ? 'bg-rose-500 text-white shadow'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-rose-50 hover:text-rose-600'
              }`}
              onClick={() => setIsLiked(!isLiked)}
            >
              <Heart className="w-4 h-4" />
              {interestedCount + (isLiked ? 1 : 0)}
              <span className="hidden sm:inline">Interested</span>
            </button>

            <button className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition">
              <Upload className="w-4 h-4" />
              {shareCount}
              <span className="hidden sm:inline">Share</span>
            </button>
          </div>

          {requireRSVP && (
            <button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white text-sm font-bold px-6 py-2.5 rounded-full shadow-md transition-all">
              <CheckCircle className="w-4 h-4 inline-block mr-1" />
              RSVP Now
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
