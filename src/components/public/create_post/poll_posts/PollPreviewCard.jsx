import React, { useState, useEffect } from 'react';
import {
  Heart,
  MessageSquare,
  Share2,
  BarChart2,
  Clock,
  Shield,
  Check,
} from 'lucide-react';

const ActionIcon = ({ icon: Icon, text, onClick, disabled = false }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#ff5c00] hover:bg-[#fff3eb] rounded-md px-3 py-2 transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
  >
    <Icon size={18} />
    <span className="font-medium">{text}</span>
  </button>
);

export default function PollPreviewCard({
  author,
  question,
  description,
  options: initialOptions = [],
  settings = {},
}) {
  const [options, setOptions] = useState(initialOptions);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);

  useEffect(() => {
    setOptions(initialOptions);
    setSelectedOptionId(null);
    setHasVoted(false);
  }, [question, initialOptions]);

  const totalVotes = options.reduce((sum, o) => sum + (o.votes || 0), 0);

  const handleVote = () => {
    if (!selectedOptionId) return;
    setOptions(prev =>
      prev.map(opt =>
        opt.text === selectedOptionId ? { ...opt, votes: (opt.votes || 0) + 1 } : opt
      )
    );
    setHasVoted(true);
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center mb-5">
        <img
          src={author?.avatar}
          alt={author?.fullName}
          className="w-10 h-10 rounded-full object-cover bg-gray-200"
        />
        <div className="ml-3">
          <p className="font-semibold text-gray-800 text-sm">{author?.fullName || 'Your Name'}</p>
          <p className="text-xs text-gray-500">Just now</p>
        </div>
      </div>

      {/* Question & Description */}
      <div className="mb-5">
        <div className="flex items-start justify-between">
          <h2 className="text-lg font-semibold text-gray-900 leading-snug flex-1">
            {question || 'Your poll question will appear here.'}
          </h2>
          {settings.anonymous && (
            <span className="flex items-center gap-1 bg-gray-100 text-gray-600 text-xs font-medium px-2 py-1 rounded-full ml-3">
              <Shield size={14} />
              Anonymous
            </span>
          )}
        </div>
        {description && <p className="text-sm text-gray-600 mt-2">{description}</p>}
      </div>

      {/* Options or Results */}
      <div className="space-y-3 mb-6">
        {options.map((option, idx) => {
          const percentage = totalVotes === 0 ? 0 : Math.round((option.votes || 0) / totalVotes * 100);

          if (hasVoted) {
            return (
              <div
                key={idx}
                className="relative w-full bg-gray-100 border border-gray-200 rounded-lg overflow-hidden"
              >
                <div
                  className={`absolute top-0 left-0 h-full transition-all duration-500 ${
                    selectedOptionId === option.text ? 'bg-[#ffdabf]' : 'bg-gray-200'
                  }`}
                  style={{ width: `${percentage}%` }}
                />
                <div className="relative z-10 flex justify-between items-center px-4 py-3 text-sm font-medium text-gray-800">
                  <span className="flex items-center gap-2">
                    {option.text}
                    {selectedOptionId === option.text && (
                      <Check className="text-[#ff5c00]" size={16} />
                    )}
                  </span>
                  <span className="text-gray-700 font-semibold">{percentage}%</span>
                </div>
              </div>
            );
          }

          return (
            <label
              key={idx}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer border-2 transition duration-150 ${
                selectedOptionId === option.text
                  ? 'bg-[#fff3eb] border-[#ff5c00]'
                  : 'bg-white border-gray-200 hover:border-gray-400'
              }`}
            >
              <input
                type="radio"
                name="poll-preview"
                value={option.text}
                checked={selectedOptionId === option.text}
                onChange={() => setSelectedOptionId(option.text)}
                className="w-4 h-4 accent-[#ff5c00]"
              />
              <span className="text-gray-800 font-medium">{option.text}</span>
            </label>
          );
        })}
      </div>

      {/* Footer: Time & Votes */}
      <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
        <div className="flex items-center gap-2">
          <Clock size={16} />
          <span>Closes in {settings.duration || 'N/A'}</span>
        </div>
        <span>{totalVotes} votes</span>
      </div>

      {/* Actions */}
      <div className="flex justify-around items-center pt-4 border-t border-gray-100">
        <ActionIcon icon={Heart} text="Like" />
        {settings.allowComments && <ActionIcon icon={MessageSquare} text="Comment" />}
        <ActionIcon icon={Share2} text="Share" />
        <ActionIcon
          icon={BarChart2}
          text="Cast Vote"
          onClick={handleVote}
          disabled={!selectedOptionId || hasVoted}
        />
      </div>
    </div>
  );
}
