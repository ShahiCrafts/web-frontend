import { Flag } from 'lucide-react';

export default function DiscussionModeration() {
    const reportedItems = [
        {
            id: 1,
            title: 'Traffic Safety Concerns on Main Street',
            author: 'Carol Davis',
            reason: 'User used hateful language towards city officials.',
            flagType: 'Offensive',
            reportedBy: 'Amit Shrestha',
            date: '2 hours ago'
        },
        {
            id: 2,
            title: 'This is obvious spam',
            author: 'SpamBot',
            reason: 'Spam or Misleading Content.',
            flagType: 'Spam',
            reportedBy: 'Community Member',
            date: '1 day ago'
        }
    ];

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-lg font-bold text-gray-900 flex items-center mb-4">
                    Reported Discussions Queue
                </h2>
                <div className="bg-white border border-gray-200 rounded-lg">
                    <ul className="divide-y divide-gray-200">
                        {reportedItems.map(item => (
                            <li key={item.id} className="p-4 hover:bg-gray-50">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-base font-semibold text-gray-900 truncate">{item.title}</p>
                                        <div className="flex items-center text-base text-gray-500 mt-1">
                                            <Flag className="w-4 h-4 text-red-500 mr-1.5 flex-shrink-0" />
                                            <p className="truncate"><span className="font-semibold text-gray-700">Reason:</span> {item.reason}</p>
                                        </div>
                                        <div className="flex items-center text-sm text-gray-500 mt-2">
                                            <span className="mr-2">Reported by: <span className="font-medium text-gray-600">{item.reportedBy}</span></span>
                                            <span className="mr-2">•</span>
                                            <span>Posted by: <span className="font-medium text-gray-600">{item.author}</span></span>
                                        </div>
                                    </div>
                                    <div className="mt-4 sm:mt-0 sm:ml-4 flex items-center space-x-3 flex-shrink-0">
                                        <span className="text-sm text-gray-400">{item.date}</span>
                                        <button className="px-3 py-1 bg-gray-200 text-gray-700 text-sm font-semibold rounded-full hover:bg-gray-300">View</button>
                                        <button className="px-3 py-1 bg-red-500 text-white text-sm font-semibold rounded-full hover:bg-red-600">Remove</button>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};