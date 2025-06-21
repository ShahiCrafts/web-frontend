import React from 'react';
import {
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
} from 'lucide-react';

function Pagination({
  currentPage,
  totalCount,
  itemsPerPage,
  onPageChange,
  onLimitChange,
  totalPages,
}) {
  // Generate page numbers with ellipsis as needed
  const getPageNumbers = () => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);

    const pages = [1, 2];

    if (currentPage > 4) pages.push('...');

    const start = Math.max(3, currentPage - 1);
    const end = Math.min(totalPages - 2, currentPage + 1);

    for (let i = start; i <= end; i++) pages.push(i);

    if (currentPage + 2 < totalPages - 1) pages.push('...');

    if (totalPages > 3) pages.push(totalPages);

    return pages;
  };

  const pageNumbers = getPageNumbers();

  // Base button style
  const baseBtnClasses =
    'w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center select-none transition-colors duration-150';

  // Hover style with slightly darker gray background and no orange border
  const hoverClasses = 'hover:bg-gray-100';

  return (
    <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
      {/* Left: Items per page dropdown */}
      <div className="flex items-center space-x-2 w-full sm:w-auto">
        <span>Show</span>
        <select
          value={itemsPerPage}
          onChange={(e) => onLimitChange(Number(e.target.value))}
          className="border border-gray-300 rounded px-2 py-1 text-sm outline-none ring-0 shadow-none"
        >
          {[1, 3, 5, 10, 20, 50].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
        <span>of {totalPages}</span>
      </div>

      {/* Center: Pagination controls */}
      <nav
        aria-label="Pagination"
        className="flex items-center space-x-1 font-mono select-none flex-wrap justify-center flex-grow"
      >
        {/* Double left: first page */}
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className={`${baseBtnClasses} ${
            currentPage === 1
              ? 'opacity-50 cursor-not-allowed'
              : hoverClasses
          }`}
          aria-label="First page"
          tabIndex={-1}
          type="button"
        >
          <ChevronsLeft className="w-4 h-4 text-gray-600" />
        </button>

        {/* Single left: previous page */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`${baseBtnClasses} ${
            currentPage === 1
              ? 'opacity-50 cursor-not-allowed'
              : hoverClasses
          }`}
          aria-label="Previous page"
          tabIndex={-1}
          type="button"
        >
          <ChevronLeft className="w-4 h-4 text-gray-600" />
        </button>

        {/* Page numbers */}
        {pageNumbers.map((page, idx) =>
          page === '...' ? (
            <span
              key={idx}
              className="px-2 select-text text-gray-600"
              aria-hidden="true"
            >
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`${baseBtnClasses} ${
                page === currentPage
                  ? 'bg-[#ff5c00] border-[#ff5c00] text-white font-semibold'
                  : `${hoverClasses} text-gray-700`
              }`}
              aria-current={page === currentPage ? 'page' : undefined}
              tabIndex={-1}
              type="button"
            >
              {page}
            </button>
          )
        )}

        {/* Single right: next page */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`${baseBtnClasses} ${
            currentPage === totalPages
              ? 'opacity-50 cursor-not-allowed'
              : hoverClasses
          }`}
          aria-label="Next page"
          tabIndex={-1}
          type="button"
        >
          <ChevronRight className="w-4 h-4 text-gray-600" />
        </button>

        {/* Double right: last page */}
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className={`${baseBtnClasses} ${
            currentPage === totalPages
              ? 'opacity-50 cursor-not-allowed'
              : hoverClasses
          }`}
          aria-label="Last page"
          tabIndex={-1}
          type="button"
        >
          <ChevronsRight className="w-4 h-4 text-gray-600" />
        </button>
      </nav>
    </div>
  );
}

export default Pagination;
