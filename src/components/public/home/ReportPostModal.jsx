import React, { useState, useEffect, useRef } from 'react';
import { X, Shield, AlertTriangle } from 'lucide-react';
import clsx from 'clsx';
import toast from 'react-hot-toast';
import { useOnClickOutside } from '../../../hooks/user/useOnClickOutside';

const REPORT_TYPES = [
  { value: 'Spam', label: 'Spam', icon: '🚫' },
  { value: 'Offensive', label: 'Offensive', icon: '⚠️' },
  { value: 'Misleading', label: 'Misleading', icon: '❌' },
  { value: 'Harassment', label: 'Harassment', icon: '🛡️' },
  { value: 'Hate Speech', label: 'Hate Speech', icon: '💢' },
  { value: 'Other', label: 'Other', icon: '📝' },
];

export default function ReportPostModal({ isOpen, onClose, onSubmit }) {
  const [reportType, setReportType] = useState('');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const modalRef = useRef(null);

  useOnClickOutside(modalRef, () => {
    if (!isSubmitting) onClose();
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reportType) {
      toast.error('Please select a reason.');
      return;
    }
    setIsSubmitting(true);
    try {
      await onSubmit(reportType, reason);
      setReportType('');
      setReason('');
    } catch (error) {
      console.error('Report submission failed:', error);
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
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, isSubmitting, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-90 flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={!isSubmitting ? onClose : undefined} />

      <div
        ref={modalRef}
        className="relative bg-white rounded-2xl shadow-xl border w-full max-w-md mx-2 overflow-hidden animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-red-50 rounded-xl border border-red-100">
              <AlertTriangle className="w-4 h-4 text-red-600" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-gray-800">Report Content</h2>
              <p className="text-xs text-gray-500">Reports are anonymous and help keep our community safe.</p>
            </div>
          </div>
          <button
            onClick={!isSubmitting ? onClose : undefined}
            disabled={isSubmitting}
            className="p-1.5 hover:bg-gray-100 rounded-full disabled:opacity-50"
            aria-label="Close"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-4 py-5 space-y-4 text-sm">
          {/* Report Types */}
          <div>
            <label className="block font-medium text-gray-800 mb-2">What's the issue?</label>
            {/* --- MODIFIED LINE --- */}
            <div className="grid grid-cols-3 gap-3">
              {REPORT_TYPES.map((type) => (
                <label
                  key={type.value}
                  className={clsx(
                    "p-2.5 border rounded-xl text-center text-xs flex flex-col items-center justify-center gap-1 cursor-pointer transition-all",
                    reportType === type.value
                      ? 'border-red-500 bg-red-50'
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
                  <span className="text-xl">{type.icon}</span>
                  <span className="font-medium text-gray-700">{type.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Reason */}
          <div>
            <label htmlFor="reason" className="block font-medium text-gray-800 mb-1">
              Additional Details <span className="text-gray-400 text-xs">(optional)</span>
            </label>
            <textarea
              id="reason"
              rows="2"
              maxLength={500}
              value={reason}
              disabled={isSubmitting}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Add helpful context..."
              className="w-full p-2.5 border border-gray-200 rounded-xl resize-none focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 text-sm bg-gray-50"
            />
            <div className="text-right text-xs text-gray-400 mt-1">{reason.length} / 500</div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-all text-sm disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!reportType || isSubmitting}
              className={clsx(
                "flex-1 px-4 py-2 text-white font-medium rounded-xl transition-all text-sm flex items-center justify-center gap-1.5",
                "bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Submitting
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4" />
                  Submit
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}