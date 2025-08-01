// src/components/admin/users/UserAccounts.jsx
import React, { useState } from 'react';
import { Ban, Trash2, ArrowUp, ArrowDown, Info } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../../context/AuthProvider';
import { useLogoutTan } from '../../../hooks/useLoginTan';
import { useFetchUsers, useDeleteUser, useToggleUserBanStatus } from '../../../hooks/admin/useUserTan';
import ConfirmDialog from '../../common/ConfirmDialog';
import Pagination from '../../common/Pagination';
import BanConfirmDialog from './BanConfirmDialog';

const Avatar = ({ email, color }) => {
  const initial = email ? email.charAt(0).toUpperCase() : '?';
  return (
    <div className={`w-8 h-8 rounded-full ${color} flex items-center justify-center text-white font-bold text-sm mr-3`}>
      {initial}
    </div>
  );
};

const StatusBadge = ({ isActive, isBanned }) => {
  const baseClasses = 'px-2.5 py-0.5 text-xs font-medium rounded-full inline-block';
  let statusText = 'Unknown';
  let statusClasses = 'bg-gray-100 text-gray-800';

  if (isBanned) {
    statusText = 'Banned';
    statusClasses = 'bg-red-100 text-red-800';
  } else if (isActive) {
    statusText = 'Online';
    statusClasses = 'bg-green-100 text-green-800';
  } else {
    statusText = 'Offline';
    statusClasses = 'bg-yellow-100 text-yellow-800';
  }

  return (
    <span className={`${baseClasses} ${statusClasses}`}>
      {statusText}
    </span>
  );
};

const SortableHeader = ({ tkey, label, requestSort, sortConfig }) => (
  <th
    className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
    onClick={() => requestSort(tkey)}
  >
    <div className="flex items-center">
      {label}
      {sortConfig.key === tkey && (
        sortConfig.direction === 'ascending' ? (
          <ArrowUp className="w-4 h-4 ml-1" />
        ) : (
          <ArrowDown className="w-4 h-4 ml-1" />
        )
      )}
    </div>
  </th>
);

export default function UserAccounts({ search, role = null }) { // <--- Accept a role prop with a default of null
  const [selectedIds, setSelectedIds] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'descending' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [confirmBanOpen, setConfirmBanOpen] = useState(false);
  const [userToToggleBan, setUserToToggleBan] = useState(null);

  const { user: currentUser } = useAuth();
  const deleteUserMutation = useDeleteUser();
  const toggleBanMutation = useToggleUserBanStatus();
  const { mutate: logoutUser } = useLogoutTan();

  const { data, isLoading, isError, error } = useFetchUsers({
    page: currentPage,
    limit: itemsPerPage,
    search,
    sortBy: sortConfig.key,
    sortOrder: sortConfig.direction === 'ascending' ? 'asc' : 'desc',
    role: role, // <--- Pass the role prop to the hook
  });

  const users = data?.users || [];
  const totalCount = data?.total || 0;

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const handleSelectAll = (e) => {
    setSelectedIds(e.target.checked ? users.map(u => u._id) : []);
  };

  const handleSelectOne = (_id) => {
    setSelectedIds(prev => prev.includes(_id) ? prev.filter(id => id !== _id) : [...prev, _id]);
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user._id);
    setConfirmDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (!userToDelete) return;
    const isDeletingSelf = currentUser?.id === userToDelete;

    deleteUserMutation.mutate(userToDelete, {
      onSuccess: () => {
        if (isDeletingSelf) {
          toast.success('Your account has been deleted. Logging you out.');
          setTimeout(() => logoutUser(), 1500);
        } else {
          toast.success('User deleted successfully!');
          setSelectedIds(prev => prev.filter(id => id !== userToDelete));
        }
      },
      onError: (err) => {
        toast.error(`Failed to delete user: ${err.message || 'Server error'}`);
      },
      onSettled: () => {
        setConfirmDeleteOpen(false);
        setUserToDelete(null);
      }
    });
  };

  const handleToggleBanClick = (user) => {
    setUserToToggleBan(user);
    setConfirmBanOpen(true);
  };

  const confirmToggleBan = () => {
    if (!userToToggleBan) return;
    const isBanningSelf = currentUser?.id === userToToggleBan._id;

    if (isBanningSelf) {
      toast.error("You cannot ban or unban your own account.");
      setConfirmBanOpen(false);
      setUserToToggleBan(null);
      return;
    }

    toggleBanMutation.mutate(userToToggleBan._id, {
      onSuccess: () => {
        toast.success(`User ${userToToggleBan.username} has been ${userToToggleBan.isBanned ? 'unbanned' : 'banned'}!`);
        setSelectedIds(prev => prev.filter(id => id !== userToToggleBan._id));
      },
      onError: (err) => {
        toast.error(`Failed to ${userToToggleBan.isBanned ? 'unban' : 'ban'} user: ${err.message || 'Server error'}`);
      },
      onSettled: () => {
        setConfirmBanOpen(false);
        setUserToToggleBan(null);
      }
    });
  };


  if (isError) {
    return <p className="p-4 text-red-600 text-center">Error: {error?.message}</p>;
  }

  return (
    <>
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                  checked={users.length > 0 && selectedIds.length === users.length}
                  onChange={handleSelectAll}
                />
              </th>
              <SortableHeader tkey="fullName" label="Name" requestSort={requestSort} sortConfig={sortConfig} />
              <SortableHeader tkey="role" label="Role" requestSort={requestSort} sortConfig={sortConfig} />
              <SortableHeader tkey="isBanned" label="Status" requestSort={requestSort} sortConfig={sortConfig} />
              <SortableHeader tkey="createdAt" label="Join Date" requestSort={requestSort} sortConfig={sortConfig} />
              <SortableHeader tkey="lastLogin" label="Last Active" requestSort={requestSort} sortConfig={sortConfig} />
              <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {isLoading ? (
              <tr>
                <td colSpan="7" className="py-10 text-center text-gray-500">Loading users...</td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-8 px-4">
                  <div className="flex flex-col items-center gap-3 max-w-sm mx-auto">
                    <Info size={40} className="text-gray-400" />
                    <h3 className="text-lg font-semibold text-gray-700">No Users Found</h3>
                    <p className="text-sm text-gray-500 text-center">
                      No user accounts match your search. Try a different term or create one.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              users.map(user => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="p-4">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                      checked={selectedIds.includes(user._id)}
                      onChange={() => handleSelectOne(user._id)}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <Avatar email={user.email} color={user.avatarColor || 'bg-gray-400'} />
                      <div>
                        <div className="font-medium text-gray-900">{user.fullName}</div>
                        <div className="text-xs text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">{user.role}</td>
                  <td className="px-6 py-4">
                    <StatusBadge isActive={user.isActive === true} isBanned={user.isBanned === true} />
                  </td>
                  <td className="px-6 py-4">{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4">{user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : '-- --'}</td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => handleToggleBanClick(user)}
                        className={`text-${user.isBanned ? 'green' : 'orange'}-600 hover:text-${user.isBanned ? 'green' : 'orange'}-800`}
                        title={user.isBanned ? "Unban User" : "Ban User"}
                      >
                        <Ban className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(user)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalCount={totalCount}
        itemsPerPage={itemsPerPage}
        totalPages={Math.ceil(totalCount / itemsPerPage)}
        onPageChange={setCurrentPage}
        onLimitChange={(limit) => {
          setCurrentPage(1);
          setItemsPerPage(limit);
        }}
      />

      <ConfirmDialog
        open={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
        onConfirm={confirmDelete}
        isLoading={deleteUserMutation.isLoading}
      />
      <BanConfirmDialog
        open={confirmBanOpen}
        onClose={() => setConfirmBanOpen(false)}
        onConfirm={confirmToggleBan}
        username={userToToggleBan?.username}
        isBanned={userToToggleBan?.isBanned}
        isLoading={toggleBanMutation.isLoading}
      />
    </>
  );
}