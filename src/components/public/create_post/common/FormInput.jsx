import React from 'react';

export default function FormInput({ id, label, placeholder, value, onChange, maxLength, required = false, helpText, type = "text", ...props }) {

    // THE FIX, PART 1: Create a "safe" version of the value.
    // If the `value` prop is undefined or null, use an empty string instead.
    const safeValue = value || '';

    return (
        <div>
            {label && <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label} {required && <span className="text-red-500">*</span>}</label>}
            <input
                type={type}
                id={id}
                value={safeValue} // Use the safeValue here
                onChange={onChange}
                maxLength={maxLength}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder={placeholder}
                {...props} // Pass down other props like 'required', 'min', etc.
            />
            <div className="flex justify-between text-sm text-gray-500 mt-1">
                {helpText && <span>{helpText}</span>}

                {/* THE FIX, PART 2: Use the safeValue for the length calculation. */}
                {maxLength && <span className="ml-auto">{safeValue.length}/{maxLength}</span>}
            </div>
        </div>
    );
};