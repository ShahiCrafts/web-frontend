import React from 'react';
import clsx from 'clsx';
// No Lucide icons needed directly in LuxuryButton itself, as they are passed as children.

export function LuxuryButton({ children, onClick, variant = 'primary', size = 'md', className = '', disabled = false, loading = false }) {
    const variants = {
        primary: "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl",
        secondary: "bg-white/80 backdrop-blur-sm hover:bg-white text-gray-700 border border-gray-200/50 shadow-md hover:shadow-lg",
        ghost: "hover:bg-white/50 backdrop-blur-sm text-gray-700 hover:shadow-md",
        danger: "bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl",
        success: "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg hover:shadow-xl"
    };

    const sizes = {
        sm: "px-3 py-1.5 text-sm",
        md: "px-4 py-2 text-sm",
        lg: "px-6 py-3 text-base"
    };

    return (
        <button
            onClick={onClick}
            disabled={disabled || loading}
            className={clsx(
                "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95",
                variants[variant],
                sizes[size],
                className
            )}
        >
            {loading && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            )}
            {children}
        </button>
    );
}