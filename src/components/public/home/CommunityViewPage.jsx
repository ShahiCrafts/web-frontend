// src/components/CommunityViewPage.jsx
import React, { useState } from 'react';
import {
  Home, // Not directly used in this version but often needed for overall navigation
  LayoutDashboard, // Could be used in a Moderation Dashboard summary
  Users, // Used for member requests card
  Settings, // Could be used in a settings section
  ChevronDown,
  ChevronUp,
  Plus,
  Share2,
  Edit,
  Pencil,
  Lock,
  Eye,
  Shield, // Used for Admin Assist card
  ChevronLeft, // For back button
  MessageSquareText, // Could be used for reported posts
  Flag, // Used for reported content card
  CalendarDays, // For events or activity in post creator
  Folder, // For files tab
  MessageCircle, // For poll/chat in post creator
  Award, // For badge requests card
  HelpCircle, // For membership questions card
  Heart, // For heart icon in moderation cards
} from 'lucide-react';

// Dummy avatar images for demonstration
const dummyAvatars = [
  'https://placehold.co/30x30/F0F0F0/gray?text=A',
  'https://placehold.co/30x30/E0E0E0/gray?text=B',
  'https://placehold.co/30x30/D0D0D0/gray?text=C',
  'https://placehold.co/30x30/C0C0C0/gray?text=D',
  'https://placehold.co/30x30/B0B0B0/gray?text=E',
  'https://placehold.co/30x30/A0A0A0/gray?text=F',
  'https://placehold.co/30x30/909090/gray?text=G',
  'https://placehold.co/30x30/808080/gray?text=H',
  'https://placehold.co/30x30/707070/gray?text=I',
  'https://placehold.co/30x30/606060/gray?text=J',
];

// Helper component for Main Content Tabs
function TabButton({ label, value, activeTab, setActiveTab }) {
  return (
    <button
      onClick={() => setActiveTab(value)}
      className={`px-4 py-3 text-sm font-semibold transition-colors ${
        activeTab === value
          ? 'text-blue-600 border-b-2 border-blue-600'
          : 'text-gray-600 hover:text-gray-900'
      }`}
    >
      {label}
    </button>
  );
}

// Component for the "About" Tab content
const AboutPanel = ({ community }) => (
  <div className="bg-white rounded-2xl shadow-md p-6">
    <h3 className="text-lg font-bold text-gray-900 mb-4">About This Community</h3>
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Lock size={20} className="text-gray-500" />
        <div>
          <p className="font-semibold text-gray-800">Private</p>
          <p className="text-sm text-gray-600">Only members can see who's in the group and what they post.</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Eye size={20} className="text-gray-500" />
        <div>
          <p className="font-semibold text-gray-800">Visible</p>
          <p className="text-sm text-gray-600">Anyone can find this group.</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Flag size={20} className="text-gray-500" />
        <div>
          <p className="font-semibold text-gray-800">{community.location || "Nepal"}</p>
        </div>
      </div>
      {community.description && (
        <div className="mt-4">
          <p className="font-semibold text-gray-800">Description</p>
          <p className="text-sm text-gray-600">{community.description}</p>
        </div>
      )}
      {/* Add more about details here from community prop if available */}
    </div>
  </div>
);

// Component for the "Posts" (formerly Discussion) Tab content
const PostsPanel = () => (
  <>
    {/* Post Creator */}
    <div className="bg-white rounded-2xl shadow-md p-5 mb-6">
      <div className="flex items-center gap-3 mb-4">
        <img
          src="https://placehold.co/40x40/FF5C00/FFFFFF?text=U"
          alt="User Avatar"
          className="w-10 h-10 rounded-full object-cover"
        />
        <input
          type="text"
          placeholder="Write something..."
          className="flex-1 p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500/50"
        />
      </div>
      <div className="flex justify-around border-t border-gray-200 pt-4">
        <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition">
          <Lock size={18} /> Anonymous post
        </button>
        <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition">
          <MessageCircle size={18} /> Poll
        </button>
        <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition">
          <CalendarDays size={18} /> Feeling/activity
        </button>
      </div>
    </div>
    {/* Placeholder for Community Feed/Posts */}
    <div className="bg-white rounded-2xl shadow-md p-6 h-64 flex items-center justify-center text-gray-500">
      Community Posts Feed (e.g., recent discussions, events)
    </div>
  </>
);

// Content for the Moderation Tab - Updated UI
const ModerationPanel = () => (
  <div className="space-y-4"> {/* Adjusted spacing */}

    {/* Admin Assist Card - Updated UI */}
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-lg font-bold text-gray-800">Admin Assist</h3>
          <p className="text-xs text-gray-500">Auto moderation that can weed out bad languages</p>
        </div>
        <button className="text-red-500 hover:text-red-600">
          <Heart size={18} fill="currentColor" strokeWidth={0} /> {/* Heart icon as per image */}
        </button>
      </div>
      <p className="text-sm text-gray-700 mb-3">
        This is where moderators are who who is going on to moderate the inappropriate things that have been done inside the group and needs to work.
      </p>
      <div className="flex justify-between items-center text-gray-500 text-xs">
        <div className="flex items-center gap-2">
          <MessageSquareText size={14} /> <span>1</span>
          <Users size={14} /> <span>29</span>
        </div>
        <button className="bg-gray-100 text-gray-600 px-2 py-1 rounded">...</button> {/* Placeholder for action button */}
      </div>
    </div>

    {/* Rsdge Requests Card (Badge Requests) - Updated UI */}
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-lg font-bold text-gray-800">Rsdege Requests</h3> {/* Name as in image */}
          <p className="text-xs text-gray-500">They did it with their own cars</p>
        </div>
        <button className="text-red-500 hover:text-red-600">
          <Heart size={18} fill="currentColor" strokeWidth={0} />
        </button>
      </div>
      <p className="text-sm text-gray-700 mb-3">
        This part of the app is dedicated to helping people to get their travel documents, allowing it to look perfectly legitimate and official.
      </p>
      <div className="flex justify-between items-center text-gray-500 text-xs">
        <div className="flex items-center gap-2">
          <MessageSquareText size={14} /> <span>11</span>
          <Users size={14} /> <span>46</span>
        </div>
        <button className="bg-gray-100 text-gray-600 px-2 py-1 rounded">...</button>
      </div>
    </div>

    {/* Membership Questions Card - Updated UI */}
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-lg font-bold text-gray-800">Membership Questions</h3>
          <p className="text-xs text-gray-500">For their specific needs as a voice</p>
        </div>
        <button className="text-red-500 hover:text-red-600">
          <Heart size={18} fill="currentColor" strokeWidth={0} />
        </button>
      </div>
      <p className="text-sm text-gray-700 mb-3">
        This helps the members to ask for some technical know-how if any problem arises.
      </p>
      <div className="flex justify-between items-center text-gray-500 text-xs">
        <div className="flex items-center gap-2">
          <MessageSquareText size={14} /> <span>1</span>
          <Users size={14} /> <span>19</span>
        </div>
        <button className="bg-gray-100 text-gray-600 px-2 py-1 rounded">...</button>
      </div>
    </div>

    {/* Rival Private Card - New Card from Image */}
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-lg font-bold text-gray-800">Rival Private</h3>
          <p className="text-xs text-gray-500">This has been an issue for a while</p>
        </div>
        <button className="text-red-500 hover:text-red-600">
          <Heart size={18} fill="currentColor" strokeWidth={0} />
        </button>
      </div>
      <p className="text-sm text-gray-700 mb-3">
        Size limit options
      </p>
      <div className="flex justify-between items-center text-gray-500 text-xs">
        {/* No specific icons/numbers provided in image for this section, so omit for now */}
        {/* Example of a floating action button on the side of the card, like in the image */}
        <button className="ml-auto bg-blue-500 text-white p-2 rounded-full shadow-lg"> {/* Adjusted padding and ml-auto */}
          <MessageSquareText size={16} /> {/* Adjusted size */}
        </button>
      </div>
    </div>

    {/* Floating Action Button (bottom right) for Moderation Panel */}
    <button className="fixed bottom-8 right-8 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 z-30">
      <Plus size={24} /> {/* Assuming a plus icon for this floating button */}
    </button>
  </div>
);


// CommunityViewPage Component
export default function CommunityViewPage({ community, onBackToList }) {
  // Set default tab to 'posts' (formerly 'discussion')
  const [activeTab, setActiveTab] = useState('posts');

  // Use props for dynamic community data
  const communityName = community.name || "Unknown Community";
  const communityType = community.type || "Public group"; // Assuming type can be passed or default
  const memberCount = community.stats?.membersCount || 0;
  const communityAvatar = community.avatarUrl || "https://placehold.co/60x60/8A2BE2/FFFFFF?text=WR"; // Use actual avatar if available

  // Back button for navigation
  const BackButton = () => (
    <button
      onClick={onBackToList}
      className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300 transition-all duration-300" // Removed mb-4, will be part of top bar layout
    >
      <ChevronLeft size={18} /> Back to Communities
    </button>
  );

  return (
    <div className="h-screen bg-white font-inter"> {/* Changed background to white */}
      <main className="overflow-auto p-6 md:p-8">

        {/* TOP HEADER BAR: Back Button + Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 border-b border-gray-200 pb-4">
            <BackButton />
            <div className="flex mt-4 sm:mt-0 space-x-2"> {/* Added space-x-2 for spacing between tabs */}
                <TabButton label="About" value="about" activeTab={activeTab} setActiveTab={setActiveTab} />
                <TabButton label="Posts" value="posts" activeTab={activeTab} setActiveTab={setActiveTab} />
                <TabButton label="Events" value="events" activeTab={activeTab} setActiveTab={setActiveTab} />
                <TabButton label="Moderation" value="moderation" activeTab={activeTab} setActiveTab={setActiveTab} />
            </div>
        </div>

        {/* COVER IMAGE SECTION (Same as before) */}
        <div className="relative bg-white rounded-2xl shadow-md overflow-hidden mb-6">
          {/* Banner Image */}
          <div className="h-40 bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-3xl font-bold">
            <img
              src="https://placehold.co/1200x160/FFD700/000000?text=Community+Banner"
              alt="Community Banner"
              className="w-full h-full object-cover"
            />
          </div>
          {/* Edit Button on Banner */}
          <button className="absolute top-4 right-4 bg-white/80 text-gray-800 p-2 rounded-full shadow-lg hover:bg-white transition">
            <Edit size={20} />
          </button>

          <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-1">{communityName}</h1>
            <p className="text-md text-gray-500 mb-4">
              {communityType} &bull; {memberCount} members
            </p>

            {/* Member Avatars */}
            <div className="flex items-center space-x-[-8px] mb-6">
              {dummyAvatars.map((src, index) => (
                <img
                  key={index}
                  src={src}
                  alt={`Member ${index + 1}`}
                  className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                />
              ))}
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-semibold text-gray-600 border-2 border-white shadow-sm">
                +{memberCount - dummyAvatars.length}
              </div>
            </div>

            {/* Invite & Share Buttons */}
            <div className="flex gap-3 mb-6">
              <button className="flex items-center justify-center px-5 py-2 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition shadow-md">
                <Plus size={18} className="mr-2" /> Invite
              </button>
              <button className="flex items-center justify-center px-5 py-2 bg-gray-200 text-gray-800 rounded-xl font-semibold hover:bg-gray-300 transition shadow-md">
                <Share2 size={18} className="mr-2" /> Share
              </button>
            </div>
          </div>
        </div>

        {/* DYNAMIC CONTENT BASED ON ACTIVE TAB */}
        {/* The content area itself is now simplified as it's not part of a two-column grid */}
        <div className="content-area">
            {activeTab === 'about' && <AboutPanel community={community} />}
            {activeTab === 'posts' && <PostsPanel />}
            {activeTab === 'events' && (
                <div className="bg-white rounded-2xl shadow-md p-6 h-64 flex items-center justify-center text-gray-500">
                    Community Events Calendar & Management
                </div>
            )}
            {activeTab === 'moderation' && <ModerationPanel />}
        </div>

        {/* Floating Pencil Icon (Only for Posts tab) */}
        {activeTab === 'posts' && (
          <button className="fixed bottom-8 right-8 bg-orange-500 text-white p-4 rounded-full shadow-lg hover:bg-orange-600 transition-all duration-300 z-30">
            <Pencil size={24} />
          </button>
        )}
      </main>
    </div>
  );
}