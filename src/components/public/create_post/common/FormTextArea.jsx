export default function FormTextArea({ id, label, placeholder, value, onChange, maxLength, required = false, rows = 4 }) {
    return <>
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label} {required && <span className="text-red-500">*</span>}</label>
            <textarea
                id={id}
                rows={rows}
                value={value}
                onChange={onChange}
                maxLength={maxLength}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder={placeholder}
            ></textarea>
            <div className="text-right text-xs text-gray-500 mt-1">
                {maxLength && <span>{value.length}/{maxLength}</span>}
            </div>
        </div>
    </>
};