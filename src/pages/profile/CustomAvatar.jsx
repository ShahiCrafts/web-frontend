import React from 'react';
import clsx from 'clsx';
import { Camera, User } from 'lucide-react'; // Only Camera and User are needed here

const getImageUrl = (path) => `http://localhost:8080/${path.replace(/\\/g, '/')}`;

export function CustomAvatar({ fullName, imageUrl, size = 'w-20 h-20', isEditing = false, onClick }) {
    if (imageUrl) {
        return (
            <div className={`${size} rounded-full overflow-hidden flex-shrink-0 ring-4 ring-white/20 shadow-2xl transition-all duration-500 hover:shadow-3xl hover:scale-105 relative group ${isEditing ? 'cursor-pointer' : ''}`} onClick={onClick}>
                <img src={getImageUrl(imageUrl)} alt={fullName} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                {isEditing && (
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <Camera className="w-5 h-5 text-white drop-shadow-lg" />
                    </div>
                )}
            </div>
        );
    }

    const getInitials = (name) => {
        if (!name) return '';
        const parts = name.split(' ');
        if (parts.length === 1) return parts[0][0].toUpperCase();
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    };

    const initials = getInitials(fullName);
    const hashCode = (str) => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        return hash;
    };

    const colors = [
        'from-violet-500 via-purple-500 to-blue-500',
        'from-emerald-500 via-teal-500 to-cyan-500',
        'from-pink-500 via-rose-500 to-red-500',
        'from-orange-500 via-amber-500 to-yellow-500',
        'from-indigo-500 via-purple-500 to-pink-500',
        'from-blue-500 via-cyan-500 to-teal-500',
        'from-red-500 via-pink-500 to-rose-500',
    ];

    const colorIndex = Math.abs(hashCode(fullName || '') % colors.length);
    const bgColor = colors[colorIndex];

    return (
        <div
            className={clsx(
                `${size} rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold text-lg bg-gradient-to-br ${bgColor} ring-4 ring-white/20 shadow-2xl transition-all duration-500 hover:shadow-3xl hover:scale-105 relative group`,
                isEditing ? 'cursor-pointer' : ''
            )}
            onClick={onClick}
        >
            {initials}
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />
            {isEditing && (
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-full">
                    <Camera className="w-5 h-5 text-white drop-shadow-lg" />
                </div>
            )}
        </div>
    );
};