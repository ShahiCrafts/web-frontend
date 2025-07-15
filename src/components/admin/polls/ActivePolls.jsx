import React from 'react';
import {
  Plus, MoreHorizontal, CheckCircle2, Clock,
  Users as UserGroupIcon
} from 'lucide-react';

export default function ActivePolls() {
  const poll = {
    id: 1,
    title: 'Community Center Renovation Priority',
    question: 'Which area of the community center should be renovated first?',
    createdBy: 'Sarah Johnson',
    totalVotes: 234,
    ends: 'Ending today',
    avatar: 'https://placehold.co/24x24/c4b5fd/ffffff?text=SJ',
    options: [
      { text: 'Gymnasium and Sports Facilities', votes: 89 },
      { text: 'Meeting Rooms and Conference Areas', votes: 67 },
      { text: 'Library and Quiet Study Zones', votes: 45 },
      { text: 'Outdoor Patio and Garden Space', votes: 33 },
    ]
  };

  const EmojiMeter = ({ value, total }) => {
    const percent = total > 0 ? (value / total) * 100 : 0;
    const emojiCount = Math.max(1, Math.round((percent / 100) * 5)); // scale to 5 emojis
    return <span className="text-xl">{'🔥'.repeat(emojiCount)}</span>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h2 className="text-lg font-bold text-gray-900 flex items-center">
            <CheckCircle2 className="w-6 h-6 mr-2 text-green-500" />
            Active Polls
          </h2>
          <p className="text-gray-500 mt-1 text-sm">
            Currently running polls and surveys accepting votes
          </p>
        </div>
        <button className="flex items-center bg-[#ff5c00] text-white text-sm font-semibold px-4 py-2 rounded-lg mt-4 md:mt-0 hover:bg-[#e05100] transition-colors">
          <Plus className="w-4 h-4 mr-2" />
          Create Poll
        </button>
      </div>

      {/* Poll Card */}
      <div className="bg-white border-l-4 border-green-500 rounded-r-lg p-5 shadow-sm">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center space-x-3">
              <h3 className="text-base font-bold text-gray-900">{poll.title}</h3>
              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Active</span>
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
              <span className="flex items-center text-red-600 font-semibold">
                <Clock className="w-4 h-4 mr-1.5" /> {poll.ends}
              </span>
            </div>
          </div>
          <button className="text-gray-400 hover:text-gray-700">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>

        {/* Results */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <h4 className="text-sm font-semibold text-gray-800 mb-3">Current Results:</h4>
          <div className="space-y-3">
            {poll.options.map((opt, i) => {
              const percent = (opt.votes / poll.totalVotes) * 100;
              return (
                <div key={i} className="flex justify-between items-center text-sm px-3 py-2 border border-gray-100 rounded bg-gray-50">
                  <div className="text-gray-700 font-medium">{opt.text}</div>
                  <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <span>{opt.votes} votes ({percent.toFixed(1)}%)</span>
                    <EmojiMeter value={opt.votes} total={poll.totalVotes} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
