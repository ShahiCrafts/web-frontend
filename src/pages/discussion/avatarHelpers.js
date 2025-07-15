// src/utils/avatarHelpers.js
export const getInitials = (name) => {
    if (!name) return "??";
    const parts = name.split(" ");
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

export const generateColorFromName = (name) => {
    const colors = [
        '#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4',
        '#ef4444', '#f97316', '#84cc16', '#14b8a6', '#3b82f6', '#d946ef'
    ];
    if (!name) return colors[0];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
        hash = hash & hash;
    }
    const index = Math.abs(hash) % colors.length;
    return colors[index];
};