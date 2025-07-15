import React from 'react';
import clsx from 'clsx';
// No Lucide icons needed directly here, as they are passed as props.

export function LuxuryInput({ label, name, value, onChange, readOnly, type = 'text', rows, placeholder, icon: Icon }) {
    const InputComponent = rows ? 'textarea' : 'input';

    return (
        <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                {Icon && <Icon className="w-4 h-4 text-gray-500" />}
                {label}
            </label>
            <InputComponent
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                readOnly={readOnly}
                rows={rows}
                placeholder={placeholder}
                className={clsx(
                    "w-full px-4 py-3 border rounded-xl text-gray-900 transition-all duration-300 resize-none backdrop-blur-sm",
                    readOnly
                        ? "bg-gray-50/50 border-gray-200/50 cursor-not-allowed"
                        : "bg-white/80 border-gray-300/50 hover:border-gray-400/50 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 hover:shadow-md focus:shadow-lg"
                )}
            />
        </div>
    );
};