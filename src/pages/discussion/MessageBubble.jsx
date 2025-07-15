// src/components/discussion/MessageBubble.jsx
import React, { useState } from "react";
import MessageActions from "./MessageActions"; // Import MessageActions
import { generateColorFromName, getInitials } from "../../pages/discussion/avatarHelpers"; // Assuming these are moved to a utils file
import { formatTime } from "../../pages/discussion/timeHelpers"; // Assuming this is moved to a utils file

// Helper for dynamic imports (if attachments have specific renderers)
const getFileIcon = (fileName) => {
    // Basic logic, extend as needed
    if (fileName.match(/\.(jpg|jpeg|png|gif)$/i)) return <img src={fileName} alt="attachment" className="max-h-40 rounded-md" />;
    if (fileName.match(/\.pdf$/i)) return <span className="text-red-500">PDF</span>;
    if (fileName.match(/\.(doc|docx)$/i)) return <span className="text-blue-500">DOC</span>;
    return <span className="text-gray-500">FILE</span>;
};

export default function MessageBubble({ message, isCurrentUser, onReact, onEdit, onDelete, currentUser }) {
    const [showActions, setShowActions] = useState(false);
    const avatarColor = generateColorFromName(message.author.fullName);

    // This component will receive handleReact, handleEdit, handleDelete from parent (DiscussionPage)
    // to pass down to MessageActions.

    return (
        <div
            className={`group flex items-end gap-3 mb-4 animate-in slide-in-from-bottom-3 duration-300 ${isCurrentUser ? 'flex-row-reverse' : ''}`}
            onMouseEnter={() => setShowActions(true)}
            onMouseLeave={() => setShowActions(false)}
        >
            {/* Avatar */}
            <div className="relative flex-shrink-0">
                {message.author.profileImage ? (
                    <img
                        src={message.author.profileImage}
                        alt={message.author.fullName}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-white shadow-sm"
                    />
                ) : (
                    <div
                        className="w-10 h-10 rounded-full text-white flex items-center justify-center font-semibold text-sm shadow-sm ring-2 ring-white"
                        style={{ backgroundColor: avatarColor }}
                    >
                        {getInitials(message.author.fullName)}
                    </div>
                )}
                {/* Online/Offline indicator - usually managed by context, mocked here */}
                {/* <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div> */}
            </div>

            {/* Message Content */}
            <div className={`relative flex flex-col max-w-[75%] sm:max-w-[60%] ${isCurrentUser ? 'items-end' : 'items-start'}`}>
                {/* Author Name & Time */}
                {!isCurrentUser && (
                    <div className="flex items-center gap-2 mb-1 px-1">
                        <span className="text-sm font-semibold text-gray-800">{message.author.fullName}</span>
                        <span className="text-xs text-gray-500">{formatTime(message.createdAt)}</span>
                    </div>
                )}

                {/* Message Bubble */}
                <div className="relative group/bubble">
                    <div
                        className={`relative px-4 py-3 rounded-2xl shadow-sm transition-all duration-200 ${
                            isCurrentUser
                                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
                                : 'bg-white border border-gray-200 text-gray-800 hover:shadow-md'
                        }`}
                    >
                        <p className="text-sm leading-relaxed break-words whitespace-pre-wrap">
                            {message.text}
                        </p>
                        {message.attachments && message.attachments.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-2">
                                {message.attachments.map((fileUrl, idx) => (
                                    <a key={idx} href={fileUrl} target="_blank" rel="noopener noreferrer"
                                       className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-md text-sm text-blue-600 hover:underline">
                                        {getFileIcon(fileUrl)}
                                        {fileUrl.split('/').pop()} {/* Display filename */}
                                        <Download size={14} />
                                    </a>
                                ))}
                            </div>
                        )}
                        {message.isEdited && (
                            <span className={`text-xs mt-1 block ${isCurrentUser ? 'text-indigo-200' : 'text-gray-400'}`}>
                                edited
                            </span>
                        )}
                        {message.isDeleted && ( // Display deleted status if applicable
                             <span className={`text-xs mt-1 block ${isCurrentUser ? 'text-indigo-200' : 'text-gray-400'}`}>
                                 deleted
                             </span>
                        )}
                    </div>

                    {/* Message Actions */}
                    <div className={`transition-all duration-200 ${showActions ? 'opacity-100' : 'opacity-0'}`}>
                        {/* Pass down handlers */}
                        <MessageActions
                            message={message}
                            isCurrentUser={isCurrentUser}
                            onReact={onReact}
                            onEdit={onEdit}
                            onDelete={onDelete}
                        />
                    </div>
                </div>

                {/* Reactions */}
                {message.reactions && Object.keys(message.reactions).length > 0 && (
                    <div className="flex items-center gap-1 mt-2 flex-wrap">
                        {Object.entries(message.reactions).map(([emoji, count]) => (
                            <button
                                key={emoji}
                                onClick={() => onReact(message._id, emoji)} // Allow clicking on existing reactions
                                className="flex items-center gap-1 px-2 py-1 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-full text-xs transition-colors"
                            >
                                <span className="text-sm">{emoji}</span>
                                <span className="font-medium text-gray-700">{count}</span>
                            </button>
                        ))}
                    </div>
                )}

                {/* Timestamp for current user */}
                {isCurrentUser && !message.isEdited && ( // Show time if not edited
                    <span className="text-xs text-gray-500 mt-1 px-1">{formatTime(message.createdAt)}</span>
                )}
                 {isCurrentUser && message.isEdited && ( // Show time if edited (optional)
                    <span className="text-xs text-gray-500 mt-1 px-1">{formatTime(message.createdAt)} (edited)</span>
                )}
            </div>
        </div>
    );
}