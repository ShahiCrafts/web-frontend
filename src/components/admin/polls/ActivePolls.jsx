// Corrected import statement
import React, { useState } from 'react';
import {
  Plus, MoreHorizontal, CheckCircle2, Clock,
  Users as UserGroupIcon, Calendar, Info
} from 'lucide-react';
import { useFetchPolls } from '../../../hooks/admin/usePollHook';
import Pagination from '../../common/Pagination';

const EmojiMeter = ({ value, total }) => {
  const percent = total > 0 ? (value / total) * 100 : 0;
  const emojiCount = Math.max(1, Math.round((percent / 100) * 5));
  return <span className="text-xl">{'🔥'.repeat(emojiCount)}</span>;
};

const PollCard = ({ poll }) => {
  const pollStatus = poll.calculatedStatus;
  const statusClasses = pollStatus === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';

  return (
    <div className="bg-white border-l-4 border-green-500 rounded-r-lg p-5 shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center space-x-3">
            <h3 className="text-base font-bold text-gray-900">{poll.title}</h3>
            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClasses}`}>
              {pollStatus}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">{poll.question}</p>
          <div className="flex items-center space-x-4 text-xs text-gray-500 mt-2">
            <span className="flex items-center">
              <img src={`https://i.pravatar.cc/24?u=${poll.author?.email}`} alt={poll.author?.fullName} className="w-5 h-5 rounded-full mr-1.5" />
              Created by {poll.author?.fullName || 'Anonymous'}
            </span>
            <span className="flex items-center">
              <UserGroupIcon className="w-4 h-4 mr-1.5" /> {poll.totalVotes} votes
            </span>
            <span className="flex items-center text-red-600 font-semibold">
              <Calendar className="w-4 h-4 mr-1.5" />
              {pollStatus === 'Active' ? `Ends ${new Date(poll.pollEndsAt).toLocaleDateString()}` : `Ended on ${new Date(poll.pollEndsAt).toLocaleDateString()}`}
            </span>
          </div>
        </div>
        <button className="text-gray-400 hover:text-gray-700">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <h4 className="text-sm font-semibold text-gray-800 mb-3">Current Results:</h4>
        <div className="space-y-3">
          {poll.options.map((opt, i) => {
            const percent = poll.totalVotes > 0 ? (opt.votes / poll.totalVotes) * 100 : 0;
            return (
              <div key={i} className="flex justify-between items-center text-sm px-3 py-2 border border-gray-100 rounded bg-gray-50">
                <div className="text-gray-700 font-medium">{opt.label}</div>
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
  );
};

export default function ActivePolls() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Fetch only polls with the 'Active' status
  const { data: pollsData, isLoading, isError, error } = useFetchPolls({
    status: 'Active',
    page,
    limit,
  });

  const polls = pollsData?.polls || [];
  const totalCount = pollsData?.totalPolls || 0;
  const totalPages = pollsData?.totalPages || 0;

  if (isError) {
    return <p className="text-center text-red-600 p-4">Error fetching active polls: {error.message}</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h2 className="text-lg font-bold text-gray-900 flex items-center">
            <CheckCircle2 className="w-6 h-6 mr-2 text-green-500" />
            Active Polls ({totalCount})
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

      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center p-8 text-gray-500">Loading active polls...</div>
        ) : polls.length === 0 ? (
          <div className="text-center p-8 text-gray-500">
            <div className="flex flex-col items-center gap-3 max-w-sm mx-auto">
              <Info size={40} className="text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-700">No Active Polls Found</h3>
              <p className="text-sm text-gray-500 text-center">
                There are no polls currently active.
              </p>
            </div>
          </div>
        ) : (
          polls.map(poll => <PollCard key={poll._id} poll={poll} />)
        )}
      </div>

      {polls.length > 0 && (
        <div className="mt-6">
          <Pagination
            currentPage={page}
            totalCount={totalCount}
            itemsPerPage={limit}
            totalPages={totalPages}
            onPageChange={setPage}
            onLimitChange={(newLimit) => {
              setPage(1);
              setLimit(newLimit);
            }}
          />
        </div>
      )}
    </div>
  );
}