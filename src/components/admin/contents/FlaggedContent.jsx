import React, { useState } from 'react';
import { Flag, Eye, Trash2, ShieldAlert } from 'lucide-react';
import Pagination from '../../../components/common/Pagination';
import { useListReports } from '../../../hooks/useReportContentHook'; // Adjust path

export default function FlaggedContent() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Fetch reports with React Query hook
  const { data, isLoading, isError, error } = useListReports({
    status: 'PENDING', // Only pending reports
    page: currentPage,
    limit: itemsPerPage,
  });

  const reports = data?.results || [];
  const totalCount = data?.totalCount || 0;
  const totalPages = data?.totalPages || 1;

  const FlagTypeBadge = ({ type }) => {
    const styles = {
      Spam: 'bg-yellow-100 text-yellow-800',
      Offensive: 'bg-red-100 text-red-800',
      Misleading: 'bg-blue-100 text-blue-800',
      Harassment: 'bg-purple-100 text-purple-800',
      'Hate Speech': 'bg-pink-100 text-pink-800',
      'Illegal Content': 'bg-gray-100 text-gray-800',
      Other: 'bg-gray-100 text-gray-800',
    };
    return (
      <span
        className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${
          styles[type] || 'bg-gray-100 text-gray-800'
        }`}
      >
        {type}
      </span>
    );
  };

  if (isLoading) return <p>Loading flagged content...</p>;
  if (isError) return <p>Error loading reports: {error?.message || 'Unknown error'}</p>;

  return (
    <>
      <div>
        <header className="mb-6">
          <h2 className="text-base font-semibold text-gray-800 flex items-center gap-2">
            <Flag className="w-5 h-5" style={{ color: '#FF5C00' }} />
            Flagged Content Queue
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Review content that has been reported by the community.
          </p>
        </header>

        <div className="space-y-5">
          {reports.length === 0 && (
            <p className="text-sm text-gray-500 text-center py-8">
              The flagged content queue is empty.
            </p>
          )}

          {reports.map((report) => {
            const post = report.post || {};
            return (
              <div
                key={report._id}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden"
              >
                {/* Original Content Info with Action Icons */}
                <div className="p-4 bg-gray-50/70 flex justify-between items-start">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{post.title || 'No Title'}</p>
                    <p className="text-sm text-gray-600 mt-1 max-w-xl">{post.content || 'No preview'}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      By {post.author?.fullName || 'Unknown Author'} ·{' '}
                      {/* You can add category or other info if available */}
                      {new Date(report.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 pl-4">
                    <button
                      className="text-gray-400 hover:text-orange-500 transition-colors"
                      title="Review Content"
                      onClick={() => {
                        // TODO: Open modal or navigate to review page
                        alert(`Review report ${report._id}`);
                      }}
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      className="text-gray-400 hover:text-red-600 transition-colors"
                      title="Dismiss Flag"
                      onClick={() => {
                        // TODO: Call dismiss API or mutation
                        alert(`Dismiss report ${report._id}`);
                      }}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                {/* Flagging Details */}
                <div className="px-4 py-3 bg-orange-50 border-t border-orange-200">
                  <div className="flex items-center gap-3">
                    <ShieldAlert className="w-5 h-5 text-orange-600 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold" style={{ color: '#E05100' }}>
                        Reason for Flagging:
                      </p>
                      <p className="text-sm text-orange-800">{report.reason}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        <FlagTypeBadge type={report.type} /> · Reported by{' '}
                        {report.reportedBy?.fullName || 'Unknown'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Pagination
        currentPage={currentPage}
        totalCount={totalCount}
        itemsPerPage={itemsPerPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        onLimitChange={(limit) => {
          setCurrentPage(1);
          setItemsPerPage(limit);
        }}
      />
    </>
  );
}
