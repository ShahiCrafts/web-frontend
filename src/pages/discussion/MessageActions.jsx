// src/components/discussion/MessageActions.jsx
import React, { useState, useRef } from "react";
import { Smile, CornerUpLeft, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { useOnClickOutside } from "../../hooks/user/useOnClickOutside"; // Ensure this path is correct

const EMOJIS = ['👍', '❤️', '😂', '😮', '😢', '😡', '🔥', '💯']; // More emojis for reactions

export default function MessageActions({ message, isCurrentUser, onReact, onEdit, onDelete }) {
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [showMoreMenu, setShowMoreMenu] = useState(false);
    const actionsRef = useRef(null);

    useOnClickOutside(actionsRef, () => {
        setShowEmojiPicker(false);
        setShowMoreMenu(false);
    });

    return (
        <div
            className={`absolute top-1/2 -translate-y-1/2 z-10 flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${isCurrentUser ? 'right-full mr-3' : 'left-full ml-3'}`}
        >
            <div ref={actionsRef} className="relative flex items-center gap-2 bg-white/95 backdrop-blur-sm border border-gray-200/50 px-3 py-2 rounded-2xl shadow-lg">
                {/* Quick Emoji Reactions */}
                <div className="flex items-center gap-1">
                    {EMOJIS.slice(0, 3).map(emoji => ( // Show first 3 as quick reactions
                        <button
                            key={emoji}
                            onClick={() => onReact(message._id, emoji)}
                            className="p-1.5 text-lg hover:scale-125 transition-transform duration-200 rounded-full hover:bg-gray-100"
                            aria-label={`React with ${emoji}`}
                        >
                            {emoji}
                        </button>
                    ))}
                </div>

                <div className="w-px h-6 bg-gray-300"></div>

                {/* Action Buttons */}
                <button
                    onClick={() => setShowEmojiPicker(p => !p)}
                    className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
                    aria-label="Add reaction"
                >
                    <Smile size={16} />
                </button>

                <button
                    onClick={() => alert('Reply feature coming soon!')} // Placeholder for reply
                    className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
                    aria-label="Reply to message"
                >
                    <CornerUpLeft size={16} />
                </button>

                {isCurrentUser && (
                    <button
                        onClick={() => setShowMoreMenu(p => !p)}
                        className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
                        aria-label="More options"
                    >
                        <MoreVertical size={16} />
                    </button>
                )}

                {/* More Actions Menu (Edit/Delete) */}
                {showMoreMenu && (
                    <div className="absolute bottom-full mb-2 w-40 bg-white rounded-xl shadow-xl border border-gray-200/50 p-2 animate-in slide-in-from-bottom-2 duration-200">
                        <button
                            onClick={() => { onEdit(message); setShowMoreMenu(false); }}
                            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <Pencil size={16} /> Edit
                        </button>
                        <button
                            onClick={() => { onDelete(message._id); setShowMoreMenu(false); }}
                            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                            <Trash2 size={16} /> Delete
                        </button>
                    </div>
                )}

                {/* Full Emoji Picker Pop-up (separated for clarity, typically part of MessageActions if directly related to a message) */}
                {/* If you want the full emoji picker to open from the Smile icon here, you'd render it conditionally */}
                {/* and pass the messageId to it. For this component, it's simplified. */}
            </div>
        </div>
    );
}