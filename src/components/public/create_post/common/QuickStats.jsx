export default function QuickStats({ title = '', content = '', tags = [] }) {
    const stats = [
        { label: 'Title length:', current: title.length, max: 100 },
        { label: 'Content length:', current: content.length, max: 5000 },
        { label: 'Images:', current: 0, max: 5 },
        { label: 'Tags:', current: tags.length, max: 10 },
    ];

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-5">
            <h3 className="font-semibold text-gray-800 mb-4">📊 Quick Stats</h3>
            <div className="space-y-3 text-sm">
                {stats.map(stat => (
                    <div key={stat.label} className="flex justify-between items-center">
                        <span className="text-gray-500">{stat.label}</span>
                        <span className="font-medium text-gray-800">{stat.current}/{stat.max}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};