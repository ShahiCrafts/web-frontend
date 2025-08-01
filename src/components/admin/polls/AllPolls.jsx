import React, { useState, useEffect } from 'react';
import {
  Plus, Search, ChevronDown, MoreHorizontal,
  User as UserGroupIcon, Calendar, Info // Added Info for empty state
} from 'lucide-react';
import { useFetchPolls } from '../../../hooks/admin/usePollHook'; // Import the poll hook
import Pagination from '../../common/Pagination'; // Assuming you have a pagination component

const EmojiMeter = ({ value, total }) => {
  const percent = total > 0 ? (value / total) * 100 : 0;
  // Scale to 5 emojis, ensuring at least one emoji if percent > 0
  const emojiCount = Math.max(1, Math.round((percent / 100) * 5));
  return <span className="text-xl">{'🔥'.repeat(emojiCount)}</span>;
};

const PollCard = ({ poll }) => {
  const pollStatus = poll.calculatedStatus; // Use calculatedStatus from backend
  const statusClasses = pollStatus === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5">
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
              {/* Assuming author is populated with fullName */}
              <img src={`https://i.pravatar.cc/24?u=${poll.author?.email}`} alt={poll.author?.fullName} className="w-5 h-5 rounded-full mr-1.5" />
              Created by {poll.author?.fullName || 'Anonymous'}
            </span>
            <span className="flex items-center">
              <UserGroupIcon className="w-4 h-4 mr-1.5" /> {poll.totalVotes} votes
            </span>
            <span className="flex items-center">
              <Calendar className="w-4 h-4 mr-1.5" />
              {pollStatus === 'Active' ? `Ends ${new Date(poll.pollEndsAt).toLocaleDateString()}` : `Ended on ${new Date(poll.pollEndsAt).toLocaleDateString()}`}
            </span>
          </div>
        </div>
        <button className="text-gray-400 hover:text-gray-700">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      <div className="mt-4 space-y-3">
        {poll.options.map((opt, i) => {
          const percent = poll.totalVotes > 0 ? (opt.votes / poll.totalVotes) * 100 : 0;
          return (
            <div key={i} className="flex justify-between items-center text-sm py-1 px-3 border border-gray-100 rounded bg-gray-50">
              <div className="text-gray-800 font-medium">{opt.label}</div> {/* Use opt.label */}
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
};

export default function AllPolls() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // Debounce the search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Fetch polls based on current filters
  const { data: pollsData, isLoading, isError, error } = useFetchPolls({
    page,
    limit,
    search: debouncedSearchTerm,
    status: statusFilter, // Filter by calculated status
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const polls = pollsData?.polls || [];
  const totalCount = pollsData?.totalPolls || 0;
  const totalPages = pollsData?.totalPages || 0;

  if (isError) {
    return <p className="text-center text-red-600 p-4">Error fetching polls: {error.message}</p>;
  }

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
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-gray-300 rounded-lg pl-10 pr-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#ff5c00]"
          />
        </div>
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="appearance-none w-full md:w-auto bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#ff5c00]"
          >
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="Closed">Closed</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Poll Cards */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center p-8 text-gray-500">Loading polls...</div>
        ) : polls.length === 0 ? (
          <div className="text-center p-8 text-gray-500">
            <div className="flex flex-col items-center gap-3 max-w-sm mx-auto">
                <Info size={40} className="text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-700">No Polls Found</h3>
                <p className="text-sm text-gray-500 text-center">
                    No poll accounts match your search or filters.
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