// src/components/common/BanConfirmDialog.jsx (or your chosen path)

import React from 'react';

const BanConfirmDialog = ({ open, onClose, onConfirm, username, isBanned, isLoading }) => {
  if (!open) return null;

  const action = isBanned ? 'unban' : 'ban'; // Determine action based on current banned status
  const confirmButtonColor = isBanned ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xs bg-white/30">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-sm">
        <h2 className="text-lg font-semibold text-gray-800">Confirm {action === 'ban' ? 'Ban' : 'Unban'}</h2>
        <p className="mt-2 text-sm text-gray-600">
          Are you sure you want to {action} user <span className="font-semibold">{username}</span>?
          This will {action === 'ban' ? 'restrict their access' : 'restore their access'} to the platform.
        </p>
        <div className="mt-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm bg-gray-100 rounded hover:bg-gray-200"
            disabled={isLoading} // Disable button while loading
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-sm text-white rounded ${confirmButtonColor}`}
            disabled={isLoading} // Disable button while loading
          >
            {isLoading ? 'Processing...' : (action === 'ban' ? 'Confirm Ban' : 'Confirm Unban')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BanConfirmDialog;