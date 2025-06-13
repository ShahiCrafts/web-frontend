import React from 'react';
import SyncLoader from 'react-spinners/SyncLoader';

export default function LoadingOverlay() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/30 backdrop-blur-none">
      <SyncLoader color="#ff5c00" size={11} speedMultiplier={0.6} />
    </div>
  );
}
