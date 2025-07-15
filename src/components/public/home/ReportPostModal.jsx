// src/components/common/ReportPostModal.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Flag, X, Shield } from 'lucide-react'; // Ensure these icons are imported
import clsx from 'clsx'; // For conditional class joining
import toast from 'react-hot-toast'; // For toast messages
import { useOnClickOutside } from '../../../hooks/user/useOnClickOutside'; // Assuming this hook's path

const REPORT_TYPES = [
  { value: "spam", label: "Spam", icon: "🚫", description: "Repetitive or irrelevant content" },
  { value: "offensive", label: "Offensive", icon: "⚠️", description: "Inappropriate or offensive material" },
  { value: "misleading", label: "Misleading", icon: "❌", description: "False or misleading information" },
  { value: "harassment", label: "Harassment", icon: "🛡️", description: "Bullying or harassment" },
  { value: "hate", label: "Hate Speech", icon: "💢", description: "Content promoting hate or discrimination" },
  { value: "illegal", label: "Illegal Content", icon: "🚨", description: "Content that violates laws" },
  { value: "other", label: "Other", icon: "📝", description: "Other issues not listed above" }
];

export default function ReportPostModal({ isOpen, onClose, onSubmit }) {
  const [reportType, setReportType] = useState('');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const modalRef = useRef(null);

  // Use the useOnClickOutside hook for closing the modal
  useOnClickOutside(modalRef, () => {
    // Only close if not currently submitting
    if (!isSubmitting) {
      onClose();
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reportType) {
      toast.error('Please select a report type.');
      return;
    }
    setIsSubmitting(true);
    try {
      await onSubmit(reportType, reason); // onSubmit is a prop (e.g., reportPostMutation.mutate)
      setReportType('');
      setReason('');
      // onClose handled by onSubmit's success callback usually
    } catch (error) {
      console.error('Report submission failed:', error);
      // toast.error is handled by usePostTan error callback in parent
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && !isSubmitting) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // Prevent scrolling body when modal is open
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset'; // Restore body scrolling
    };
  }, [isOpen, onClose, isSubmitting]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={!isSubmitting ? onClose : undefined} />
      <div
        ref={modalRef}
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden animate-in zoom-in-95 duration-300"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-red-500 to-orange-500 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-full">
                <Flag className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold">Report Post</h2>
            </div>
            <button
              onClick={!isSubmitting ? onClose : undefined}
              disabled={isSubmitting}
              className="p-2 hover:bg-white/20 rounded-full transition-colors disabled:opacity-50"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-white/90 text-sm mt-2">
            Help us keep the community safe by reporting inappropriate content.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Select Report Type:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {REPORT_TYPES.map((type) => (
                <label
                  key={type.value}
                  className={clsx(
                    "flex items-start gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all duration-200",
                    "focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-orange-500",
                    reportType === type.value
                      ? 'border-orange-500 bg-orange-50 shadow-sm'
                      : 'border-gray-200 hover:border-gray-300'
                  )}
                >
                  <input
                    type="radio"
                    name="reportType"
                    value={type.value}
                    checked={reportType === type.value}
                    onChange={(e) => setReportType(e.target.value)}
                    className="sr-only"
                  />
                  <div className="flex-shrink-0 mt-0.5 w-4 h-4 rounded-full border-2 border-gray-400 flex items-center justify-center">
                    {reportType === type.value && (
                      <div className="w-2 h-2 bg-orange-500 rounded-full" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">{type.icon} {type.label}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{type.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label htmlFor="reason" className="block text-sm font-semibold text-gray-900 mb-3">
              Additional Details <span className="text-gray-500 font-normal">(Optional)</span>
            </label>
            <textarea
              id="reason"
              rows="4"
              className="w-full border-2 border-gray-200 rounded-xl p-3 focus:border-orange-500 focus:ring-0 resize-none transition-colors placeholder:text-gray-400"
              placeholder="Help us understand the issue better..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              disabled={isSubmitting}
            />
          </div>
          {/* Actions */}
          <div className="flex gap-3 pt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-3 text-sm font-semibold text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!reportType || isSubmitting}
              className="flex-1 px-4 py-3 text-sm font-semibold text-white bg-gradient-to-r from-red-500 to-orange-500 rounded-xl hover:from-red-600 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4" />
                  Submit Report
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}