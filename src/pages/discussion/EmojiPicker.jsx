// src/components/discussion/EmojiPicker.jsx
import React, { useRef } from 'react';
import { useOnClickOutside } from '../../hooks/user/useOnClickOutside'; // Ensure path is correct

const EMOJI_CATEGORIES = {
    'Smileys': ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '🥲', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🥸', '🤩', '🥳'],
    'Gestures': ['👍', '👎', '👌', '🤌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👏', '🙌', '👐', '🤲', '🤝', '🙏'],
    'Hearts': ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟'],
    'Objects': ['💯', '💢', '💥', '💫', '💦', '💨', '🕳️', '💣', '💬', '🗨️', '🗯️', '💭', '💤', '🔥', '⭐', '🌟', '✨', '⚡', '☄️', '💥']
};

export default function EmojiPicker({ onSelect, onClose, isOpen }) {
    const pickerRef = useRef(null);
    useOnClickOutside(pickerRef, onClose);

    if (!isOpen) return null;

    return (
        <div ref={pickerRef} className="absolute bottom-full mb-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200/50 p-4 animate-in slide-in-from-bottom-2 duration-200">
            <div className="space-y-3 max-h-64 overflow-y-auto"> {/* Added max-height and overflow */}
                {Object.entries(EMOJI_CATEGORIES).map(([category, emojis]) => (
                    <div key={category}>
                        <h4 className="text-xs font-medium text-gray-500 mb-2">{category}</h4>
                        <div className="grid grid-cols-8 gap-1">
                            {emojis.map(emoji => (
                                <button
                                    key={emoji}
                                    onClick={() => onSelect(emoji)}
                                    className="p-2 text-xl hover:bg-gray-100 rounded-lg transition-colors"
                                    aria-label={`Select ${emoji}`}
                                >
                                    {emoji}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}