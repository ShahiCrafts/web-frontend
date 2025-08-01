// EventPostCardV3.jsx - The component code you previously had, which calls mutate with an object

import React from 'react';
import {
  Heart, Upload, CheckCircle,
  MapPin, Clock, Users, Calendar, Star
} from 'lucide-react';
import { useToggleEventInterest, useToggleEventRSVP } from '../../../hooks/user/usePostTan';
import { useAuth } from '../../../context/AuthProvider'; // Correct path to AuthProvider

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

export default function EventPostCardV3({ post }) {
  console.log('EventPostCardV3 Render: Component is rendering.');

  const { user } = useAuth();
  const currentUserId = user?._id;
  console.log('EventPostCardV3 Render: Current User ID from Auth:', currentUserId);

  const {
    _id,
    title = 'No Title',
    locationDetails = 'Location Not Specified',
    eventDescription = 'No description available for this event.',
    eventStartDate,
    authorId,
    attachments = [],
    status = 'UPCOMING',
    requireRSVP = false,
    interestedUsers = [],
    rsvpUsers = [],
    sharesCount = 0,
  } = post || {};

  console.log('EventPostCardV3 Render: Post ID:', _id);
  console.log('EventPostCardV3 Render: Current interestedUsers array:', interestedUsers);
  console.log('EventPostCardV3 Render: Current rsvpUsers array:', rsvpUsers);

  const banner = attachments[0] || FALLBACK_IMAGE;
  const hostName = authorId?.fullName || 'Event Organizer';
  const hostAvatar = authorId?.profileImage || `${FALLBACK_AVATAR}${hostName.charAt(0)}`;

  const isUserInterested = interestedUsers.includes(currentUserId);
  const isUserRSVPd = rsvpUsers.includes(currentUserId);
  console.log('EventPostCardV3 Render: isUserInterested state:', isUserInterested);
  console.log('EventPostCardV3 Render: isUserRSVPd state:', isUserRSVPd);


  const toggleInterestMutation = useToggleEventInterest();
  const toggleRSVPMutation = useToggleEventRSVP();
  console.log('EventPostCardV3 Render: toggleInterestMutation.isPending:', toggleInterestMutation.isPending);
  console.log('EventPostCardV3 Render: toggleRSVPMutation.isPending:', toggleRSVPMutation.isPending);


  const handleToggleInterest = () => {
    console.log('EventPostCardV3 Handler: handleToggleInterest triggered.');
    if (!currentUserId) {
        alert('Please log in to express interest!');
        console.log('EventPostCardV3 Handler: Interest - User not logged in. Aborting.');
        return;
    }
    if (!_id) {
      console.warn('EventPostCardV3 Handler: Interest - Post ID is missing. Aborting.');
      return;
    }
    console.log('EventPostCardV3 Handler: Interest - All checks passed. Calling mutate() for ID:', _id, 'and User:', currentUserId);
    toggleInterestMutation.mutate({ eventId: _id, currentUserId }); // Pass object here
  };

  const handleToggleRSVP = () => {
    console.log('EventPostCardV3 Handler: handleToggleRSVP triggered.');
    if (!currentUserId) {
        alert('Please log in to RSVP!');
        console.log('EventPostCardV3 Handler: RSVP - User not logged in. Aborting.');
        return;
    }
    if (!_id) {
      console.warn('EventPostCardV3 Handler: RSVP - Post ID is missing. Aborting.');
      return;
    }
    console.log('EventPostCardV3 Handler: RSVP - All checks passed. Calling mutate() for ID:', _id, 'and User:', currentUserId);
    toggleRSVPMutation.mutate({ eventId: _id, currentUserId }); // Pass object here
  };

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
        <div className="relative rounded-2xl overflow-hidden">
          <img src={banner} alt="Event Banner" className="w-full h-44 sm:h-52 object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <span className={`absolute top-3 left-3 text-xs font-bold px-3 py-1 rounded-full border ${getStatusColor(status)}`}>
            {status}
          </span>
          <button
            onClick={handleToggleInterest}
            className="absolute top-3 right-3 bg-white/80 p-2 rounded-full hover:bg-rose-100 transition"
            disabled={!currentUserId || toggleInterestMutation.isPending}
          >
            <Heart className={`w-5 h-5 ${isUserInterested ? 'text-rose-500 fill-current' : 'text-gray-600'}`} />
          </button>
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

        <div className="space-y-1">
          <h1 className="text-lg font-bold leading-tight truncate">{title}</h1>
          <div className="flex items-center gap-1.5 text-gray-500 text-sm">
            <MapPin className="w-4 h-4" />
            <span className="truncate">{locationDetails}</span>
          </div>
        </div>

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
        </div>

        <div className="bg-gray-50 rounded-xl p-4 space-y-2 border border-gray-200">
          <h2 className="text-sm font-semibold flex items-center gap-2 text-yellow-600">
            <Star className="w-4 h-4" /> About this event
          </h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            {eventDescription}
          </p>
        </div>

        {/* Actions Row */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-3 flex-wrap">
            <button
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition ${
                isUserInterested
                  ? 'bg-rose-500 text-white shadow'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-rose-50 hover:text-rose-600'
              }`}
              onClick={handleToggleInterest}
              disabled={!currentUserId || toggleInterestMutation.isPending}
            >
              <Heart className="w-4 h-4" />
              {interestedUsers.length}
              <span className="hidden sm:inline">Interested</span>
            </button>

            <button className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition">
              <Upload className="w-4 h-4" />
              {sharesCount}
              <span className="hidden sm:inline">Share</span>
            </button>
          </div>

          {requireRSVP && (
            <button
              onClick={handleToggleRSVP}
              className={`text-white text-sm font-bold px-6 py-2.5 rounded-full shadow-md transition-all ${
                isUserRSVPd
                  ? 'bg-green-500 hover:bg-green-600'
                  : 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600'
              }`}
              disabled={!currentUserId || toggleRSVPMutation.isPending}
            >
              <CheckCircle className="w-4 h-4 inline-block mr-1" />
              {isUserRSVPd ? 'RSVPd' : 'RSVP Now'}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}