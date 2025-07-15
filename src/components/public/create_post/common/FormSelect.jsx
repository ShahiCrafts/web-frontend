import React from 'react';
import { ChevronDown } from 'lucide-react';
import IconWrapper from './IconWrapper';

export default function FormSelect({
    id,
    label,
    value,
    onChange,
    helpText,
    children,
    required = false,
    className = '',
    ...props
}) {
    return (
        <div>
            <label
                htmlFor={id}
                className="block text-sm font-medium text-gray-700 mb-1"
            >
                {label} {required && <span className="text-red-500">*</span>}
            </label>

            <div className="relative">
                <select
                    id={id}
                    name={id}
                    value={value}
                    onChange={onChange}
                    required={required}
                    {...props}
                    className={`w-full px-3 py-2 bg-white border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${className}`}
                >
                    {children}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <IconWrapper icon={ChevronDown} />
                </div>
            </div>

            {helpText && (
                <p className="text-xs text-gray-500 mt-1">
                    {helpText}
                </p>
            )}
        </div>
    );
}
