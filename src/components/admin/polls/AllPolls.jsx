import React from 'react';
import {
  Plus, Search, ChevronDown, MoreHorizontal,
  User as UserGroupIcon, Calendar
} from 'lucide-react';

export default function AllPolls() {
  const polls = [
    {
      id: 1,
      title: 'Community Center Renovation Priority',
      question: 'Which area of the community center should be renovated first?',
      createdBy: 'Sarah Johnson',
      totalVotes: 234,
      ends: '2025-07-15',
      status: 'Active',
      avatar: 'https://placehold.co/24x24/c4b5fd/ffffff?text=SJ',
      options: [
        { text: 'Gymnasium and Sports Facilities', votes: 89 },
        { text: 'Meeting Rooms and Conference Areas', votes: 67 },
        { text: 'Library and Quiet Study Zones', votes: 45 },
        { text: 'Outdoor Patio and Garden Space', votes: 33 },
      ]
    },
    {
      id: 2,
      title: 'Annual Community Picnic Theme',
      question: 'What should be the theme for this year\'s community picnic?',
      createdBy: 'Mike Chen',
      totalVotes: 158,
      ends: '2025-06-10',
      status: 'Closed',
      avatar: 'https://placehold.co/24x24/93c5fd/ffffff?text=MC',
      options: [
        { text: 'Superhero Fiesta', votes: 72 },
        { text: 'Retro 80s', votes: 51 },
        { text: 'Tropical Paradise', votes: 35 },
      ]
    }
  ];

  const EmojiMeter = ({ value, total }) => {
    const percent = total > 0 ? (value / total) * 100 : 0;
    const emojiCount = Math.max(1, Math.round((percent / 100) * 5)); // Scale to 5 emojis
    return <span className="text-xl">{'🔥'.repeat(emojiCount)}</span>;
  };

  const PollCard = ({ poll }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-5">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center space-x-3">
            <h3 className="text-base font-bold text-gray-900">{poll.title}</h3>
            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${poll.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
              {poll.status}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">{poll.question}</p>
          <div className="flex items-center space-x-4 text-xs text-gray-500 mt-2">
            <span className="flex items-center">
              <img src={poll.avatar} alt={poll.createdBy} className="w-5 h-5 rounded-full mr-1.5" />
              Created by {poll.createdBy}
            </span>
            <span className="flex items-center">
              <UserGroupIcon className="w-4 h-4 mr-1.5" /> {poll.totalVotes} votes
            </span>
            <span className="flex items-center">
              <Calendar className="w-4 h-4 mr-1.5" />
              {poll.status === 'Active' ? `Ends ${poll.ends}` : `Ended on ${poll.ends}`}
            </span>
          </div>
        </div>
        <button className="text-gray-400 hover:text-gray-700">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      <div className="mt-4 space-y-3">
        {poll.options.map((opt, i) => {
          const percent = (opt.votes / poll.totalVotes) * 100;
          return (
            <div key={i} className="flex justify-between items-center text-sm py-1 px-3 border border-gray-100 rounded bg-gray-50">
              <div className="text-gray-800 font-medium">{opt.text}</div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>{opt.votes} votes ({percent.toFixed(1)}%)</span>
                <EmojiMeter value={opt.votes} total={poll.totalVotes} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Polls & Surveys</h2>
          <p className="text-gray-500 mt-1 text-sm">Create and manage community polls and surveys</p>
        </div>
        <button className="flex items-center bg-[#ff5c00] text-sm text-white font-semibold px-4 py-2 rounded-lg mt-4 md:mt-0 hover:bg-[#e05100] transition-colors">
          <Plus className="w-4 h-4 mr-2" />
          Create Poll
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search polls..."
            className="w-full bg-white border border-gray-300 rounded-lg pl-10 pr-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#ff5c00]"
          />
        </div>
        <div className="relative">
          <select className="appearance-none w-full md:w-auto bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#ff5c00]">
            <option>All Status</option>
            <option>Active</option>
            <option>Closed</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
        <div className="relative">
          <select className="appearance-none w-full md:w-auto bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#ff5c00]">
            <option>All Categories</option>
            <option>Renovation</option>
            <option>Budget</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Poll Cards */}
      <div className="space-y-4">
        {polls.map(poll => <PollCard key={poll.id} poll={poll} />)}
      </div>
    </div>
  );
}
