import React from 'react';
import clsx from 'clsx';
import { Calendar, Flag, MapPin, Building, Phone } from 'lucide-react';

export function ReportCard({ report }) {
    // --- DEBUG START ---
    console.log('ReportCard: Received report prop:', report);
    if (report) {
        console.log('ReportCard: Report title:', report.title);
        console.log('ReportCard: Report status:', report.status);
    }
    // --- DEBUG END ---

    const {
        _id,
        title,
        content: description,
        address,
        priorityLevel: priority,
        responsibleDepartment,
        contactInfo,
        status,
        createdAt,
    } = report || {};

    const displayDate = createdAt ? new Date(createdAt).toLocaleDateString() : 'N/A';

    const statusDotClass = clsx(
        "w-3 h-3 rounded-full",
        {
            'ACTIVE': 'bg-blue-500',
            'UNDER_REVIEW': 'bg-yellow-500',
            'ACTION_TAKEN': 'bg-green-500',
            'CLOSED': 'bg-green-500',
            'REPORTED': 'bg-red-500',
            'REPORT_REJECTED': 'bg-gray-500',
            'DELETED': 'bg-red-800',
        }[status] || 'bg-gray-500'
    );

    const statusBadgeClass = clsx(
        "px-3 py-1 rounded-full text-xs font-medium",
        {
            'ACTIVE': 'bg-blue-100 text-blue-700',
            'UNDER_REVIEW': 'bg-yellow-100 text-yellow-700',
            'ACTION_TAKEN': 'bg-green-100 text-green-700',
            'CLOSED': 'bg-green-100 text-green-700',
            'REPORTED': 'bg-red-100 text-red-700',
            'REPORT_REJECTED': 'bg-gray-100 text-gray-700',
            'DELETED': 'bg-red-200 text-red-800',
        }[status] || 'bg-gray-100 text-gray-700'
    );

    return (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200/50 hover:border-gray-300/50 transform hover:-translate-y-1">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className={statusDotClass}></div>
                    <div>
                        <h3 className="font-semibold text-gray-900">{title || 'Untitled Report'}</h3>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {address || 'No address provided'}
                        </p>
                    </div>
                </div>
                <div className={statusBadgeClass}>
                    {status || 'Unknown'}
                </div>
            </div>
            <p className="text-gray-600 mb-4">{description || 'No description available.'}</p>
            <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Reported: {displayDate}
                </div>
                <div className="flex items-center gap-1">
                    <Flag className="w-4 h-4" />
                    Priority: {priority || 'N/A'}
                </div>
            </div>
            {(responsibleDepartment || contactInfo) && (
                <div className="mt-4 pt-4 border-t border-gray-200 text-sm text-gray-600 space-y-2">
                    {responsibleDepartment && (
                        <div className="flex items-center gap-2">
                            <Building className="w-4 h-4" />
                            Department: {responsibleDepartment}
                        </div>
                    )}
                    {contactInfo && (
                        <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            Contact: {contactInfo}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}