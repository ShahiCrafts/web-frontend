// src/components/discussion/AttachmentMenu.jsx
import React, { useRef } from 'react';
import { Image, FileText, Mic, VideoIcon } from 'lucide-react'; // Ensure these icons are imported
import { useOnClickOutside } from '../../hooks/user/useOnClickOutside'; // Ensure path is correct

const attachmentOptions = [
    { icon: Image, label: 'Photo', color: 'text-green-600', bg: 'bg-green-100' },
    { icon: FileText, label: 'Document', color: 'text-blue-600', bg: 'bg-blue-100' },
    { icon: Mic, label: 'Audio', color: 'text-purple-600', bg: 'bg-purple-100' },
    { icon: VideoIcon, label: 'Video', color: 'text-red-600', bg: 'bg-red-100' }
];

export default function AttachmentMenu({ isOpen, onClose, onSelectAttachmentType }) {
    const menuRef = useRef(null);
    useOnClickOutside(menuRef, onClose);

    if (!isOpen) return null;

    return (
        <div ref={menuRef} className="absolute bottom-full mb-2 w-48 bg-white rounded-xl shadow-xl border border-gray-200/50 p-2 animate-in slide-in-from-bottom-2 duration-200">
            {attachmentOptions.map((option) => (
                <button
                    key={option.label}
                    onClick={() => {
                        onSelectAttachmentType(option.label); // Pass selected type
                        onClose();
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <div className={`p-2 rounded-full ${option.bg}`}>
                        <option.icon size={16} className={option.color} />
                    </div>
                    {option.label}
                </button>
            ))}
        </div>
    );
}