export default function FormSection({ icon: Icon, title, children }) {
    return (
        <>
            <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <Icon className="w-6 h-6 text-gray-600" strokeWidth={1.5} />
                    <h2 className="text-base font-semibold text-gray-800">{title}</h2>
                </div>
                <div className="space-y-4">{children}</div>
            </div>
        </>
    );
}
