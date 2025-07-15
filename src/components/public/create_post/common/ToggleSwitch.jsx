export default function ToggleSwitch({ id, label, description, enabled, setEnabled }) {
    return (
        <div className="flex items-center justify-between">
            <div>
                <label htmlFor={id} className="block text-sm font-medium text-gray-700">
                    {label}
                </label>
                <p className="text-xs text-gray-500">{description}</p>
            </div>
            <button
                type="button"
                id={id}
                role="switch"
                aria-checked={enabled}
                onClick={() => setEnabled(!enabled)}
                className={`${enabled ? 'bg-[#ff5c00]' : 'bg-gray-200'
                    } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#ff5c00] focus:ring-offset-2`}
            >
                <span
                    aria-hidden="true"
                    className={`${enabled ? 'translate-x-5' : 'translate-x-0'
                        } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                />
            </button>
        </div>
    );
}
