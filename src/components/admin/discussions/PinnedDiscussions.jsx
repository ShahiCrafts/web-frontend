import { Users, MessageSquare, Clock, MoreHorizontal, Pin } from 'lucide-react';

const CategoryTag = ({ children, className }) => (
  <span className={`text-xs font-medium px-2 py-1 rounded-md ${className}`}>
    {children}
  </span>
);

const Tag = ({ children }) => (
  <span className="bg-gray-100 text-gray-600 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full">
    #{children}
  </span>
);

const IconWrapper = ({ icon: Icon, text, className = "text-gray-500" }) => (
    <div className={`flex items-center text-sm ${className}`}>
        <Icon className="w-4 h-4 mr-1.5" />
        <span>{text}</span>
    </div>
);

export default function PinnedDiscussions() {
    const pinnedDiscussions = [
        {
            id: 1,
            title: 'City Budget Allocation for 2024 - Community Input Needed',
            description: 'We need community feedback on the proposed budget allocation for infrastructure, education, and public services...',
            author: 'Sarah Johnson',
            authorImage: 'https://placehold.co/32x32/c4b5fd/ffffff?text=SJ',
            category: 'Budget',
            status: 'active',
            replies: 45,
            participants: 23,
            time: '2 hours ago',
            tags: ['budget', '2024', 'community-input']
        },
        {
            id: 2,
            title: 'Public Transit System Overhaul - Share Your Ideas',
            description: 'The city is considering a major overhaul of the public transit system. What changes would you like to see?',
            author: 'Michael Chen',
            authorImage: 'https://placehold.co/32x32/93c5fd/ffffff?text=MC',
            category: 'Transportation',
            status: 'active',
            replies: 78,
            participants: 41,
            time: '1 day ago',
            tags: ['transit', 'public-transport', 'city-planning']
        }
    ];

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-lg font-bold text-gray-900 flex items-center">
                    <Pin className="w-6 h-6 mr-3 text-blue-600" /> Pinned Discussions
                </h2>
                <p className="text-gray-500 mt-1 text-base">Important discussions highlighted for the community</p>
            </div>
            <div className="space-y-4">
                {pinnedDiscussions.map(d => (
                    <div key={d.id} className="bg-white border-l-4 border-blue-500 p-5 rounded-r-lg shadow-sm">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center space-x-3">
                                <h3 className="text-lg font-bold text-gray-900">{d.title}</h3>
                                {d.status === 'active' && <CategoryTag className="bg-orange-100 text-orange-800 border border-orange-200">active</CategoryTag>}
                            </div>
                            <button className="text-gray-500 hover:text-gray-800">
                                <MoreHorizontal className="w-5 h-5" />
                            </button>
                        </div>
                        <p className="text-gray-600 mt-2 text-base">{d.description}</p>
                        <div className="flex flex-wrap items-center mt-4 text-gray-600 gap-x-4 gap-y-2">
                            <div className="flex items-center">
                                <img src={d.authorImage} alt={d.author} className="w-6 h-6 rounded-full mr-2" />
                                <span>{d.author}</span>
                            </div>
                            <CategoryTag className="bg-gray-100 text-gray-700">{d.category}</CategoryTag>
                        </div>
                        <hr className="my-4 border-gray-200" />
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                            <div className="flex flex-wrap gap-2 mb-3 sm:mb-0">
                                {d.tags.map(tag => <Tag key={tag}>{tag}</Tag>)}
                            </div>
                            <div className="flex items-center space-x-4 text-gray-500">
                                <IconWrapper icon={MessageSquare} text={`${d.replies} replies`} />
                                <IconWrapper icon={Users} text={`${d.participants} participants`} />
                                <IconWrapper icon={Clock} text={d.time} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};