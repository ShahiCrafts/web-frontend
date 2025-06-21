import React, { useState, useRef, useEffect } from 'react';
import { Search, Ban, Trash2, ArrowUp, ArrowDown, Download } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../auth/AuthProvider';
import { useLogoutTan } from '../../hooks/useLoginTan';
import { useFetchUsers, useDeleteUser } from '../../hooks/admin/useUserTan';
import ConfirmDialog from '../common/ConfirmDialog';
import Pagination from '../common/Pagination';

const StatusBadge = ({ status }) => {
  const baseClasses = 'px-2.5 py-0.5 text-xs font-medium rounded-full inline-block';
  return (
    <span className={`${baseClasses} ${status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
      {status}
    </span>
  );
};

const Avatar = ({ email, color }) => {
  const initial = email ? email.charAt(0).toUpperCase() : '?';
  return (
    <div className={`w-8 h-8 rounded-full ${color} flex items-center justify-center text-white font-bold text-sm mr-3`}>
      {initial}
    </div>
  );
};

export default function App() {
  const [selectedIds, setSelectedIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'descending' });
  const [currentPage, setCurrentPage] = useState(1);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const downloadRef = useRef(null);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const deleteUserMutation = useDeleteUser();
  const { mutate: logoutUser } = useLogoutTan();
  const { user: currentUser } = useAuth();

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1);
    }, 300);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  const { data, isLoading, isError, error } = useFetchUsers({
    page: currentPage,
    limit: itemsPerPage,
    search: debouncedSearchTerm,
    sortBy: sortConfig.key,
    sortOrder: sortConfig.direction === 'ascending' ? 'asc' : 'desc',
  });

  const users = data?.users || [];
  const totalCount = data?.total || 0;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (downloadRef.current && !downloadRef.current.contains(event.target)) {
        setShowDownloadMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'ascending' ? (
      <ArrowUp className="w-4 h-4 ml-1" />
    ) : (
      <ArrowDown className="w-4 h-4 ml-1" />
    );
  };

  const handleSelectAll = (e) => {
    setSelectedIds(e.target.checked ? users.map((u) => u._id) : []);
  };

  const handleSelectOne = (_id) => {
    setSelectedIds((prev) =>
      prev.includes(_id) ? prev.filter((i) => i !== _id) : [...prev, _id]
    );
  };

  const handleBan = (_id) => alert(`Ban user ${_id}`);

  const handleDelete = (_id) => {
    setUserToDelete(_id);
    setConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (userToDelete) {
      const isDeletingSelf = currentUser?.id === userToDelete;

      deleteUserMutation.mutate(userToDelete, {
        onSuccess: () => {
          if (isDeletingSelf) {
            toast.success('Your account has been deleted. Logging you out.');
            setTimeout(() => {
                logoutUser();
            }, 1500);
          } else {
            toast.success('User deleted successfully!');
            setSelectedIds(prev => prev.filter(id => id !== userToDelete));
          }
        },
        onError: (error) => {
          toast.error(`Failed to delete user: ${error.message}`);
        },
        onSettled: () => {
          setConfirmOpen(false);
          setUserToDelete(null);
        }
      });
    }
  };


  if (isError)
    return (
      <p className="p-4 text-red-600 text-center">
        Error: {error?.message}
      </p>
    );

  const SortableHeader = ({ tkey, label }) => (
    <th
      className="px-6 py-3 text-left font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
      onClick={() => requestSort(tkey)}
    >
      <div className="flex items-center">
        {label}
        {getSortIcon(tkey)}
      </div>
    </th>
  );

  return (
    <div className="bg-slate-50 flex items-center justify-center font-sans">
      <div className="w-full bg-white rounded-xl shadow-lg p-5 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div className="mb-4 md:mb-0">
            <h1 className="text-base font-semibold text-gray-800">
              Registered Users
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              View, manage, and monitor all registered users and their account
              details.
            </p>
          </div>
          <div className="flex items-center space-x-2 w-full md:w-auto">
            <div className="relative flex-grow md:flex-grow-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                className="pl-10 pr-12 py-2 w-full border border-gray-300 rounded-lg text-sm focus:outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {(isLoading && !deleteUserMutation.isLoading) && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs italic">
                  Loading...
                </div>
              )}
            </div>

            <div className="relative" ref={downloadRef}>
              <button
                onClick={() => setShowDownloadMenu(!showDownloadMenu)}
                className="p-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition"
                aria-label="Download menu"
              >
                <Download className="w-5 h-5 text-gray-500" />
              </button>
              {showDownloadMenu && (
                <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-xl z-10 animate-fade-in-up">
                  <button
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => alert('Download CSV')}
                  >
                    Download CSV
                  </button>
                  <button
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => alert('Download Excel')}
                  >
                    Download Excel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 text-xs">
              <tr>
                <th className="p-4">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    checked={selectedIds.length === users.length && users.length > 0}
                    onChange={handleSelectAll}
                    aria-label="Select all users"
                  />
                </th>
                <SortableHeader tkey="_id" label="ID" />
                <SortableHeader tkey="fullName" label="Name" />
                <SortableHeader tkey="email" label="Email Address" />
                <SortableHeader tkey="role" label="Role" />
                <SortableHeader tkey="status" label="Status" />
                <SortableHeader tkey="createdAt" label="Created At" />
                <SortableHeader tkey="lastLogin" label="Last Login" />
                <th className="px-6 py-3 text-center font-semibold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 text-sm">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="p-4">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      checked={selectedIds.includes(user._id)}
                      onChange={() => handleSelectOne(user._id)}
                      aria-label={`Select user ${user.fullName}`}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-mono text-xs text-gray-600">
                    {user._id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-800">
                    <div className="flex items-center">
                      <Avatar
                        email={user.email}
                        color={user.avatarColor || 'bg-gray-400'}
                      />
                      {user.fullName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-800">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-800">
                    {user.role}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={user.status || 'Offline'} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-800">
                    {user.createdAt}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-800">
                    {user.lastLogin || '-- --'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center flex justify-center gap-2">
                    <button
                      onClick={() => handleBan(user._id)}
                      className="text-orange-600 hover:text-orange-800 transition-colors p-1"
                      title="Ban"
                    >
                      <Ban className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="text-red-600 hover:text-red-800 transition-colors p-1"
                      title="Delete"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan="9" className="text-center py-10 text-gray-500">
                    <h3 className="text-lg font-medium">No users found</h3>
                    <p className="mt-1 text-sm">
                      Try adjusting your search or filter criteria.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={currentPage}
          totalCount={totalCount}
          itemsPerPage={itemsPerPage}
          totalPages={Math.ceil(totalCount / itemsPerPage)}
          onPageChange={(page) => {
            if (page >= 1 && page <= Math.ceil(totalCount / itemsPerPage)) {
              setCurrentPage(page);
            }
          }}
          onLimitChange={(limit) => {
            setCurrentPage(1); // reset page when limit changes
            setItemsPerPage(limit);
          }}
        />
      </div>

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={confirmDelete}
        isLoading={deleteUserMutation.isLoading}
      />
    </div>
  );
}