import { Search, Lock, Users, MessageSquare, Clock, MoreHorizontal, Pin, Flag, Shield, ChevronDown, Plus, Eye, Trash2 } from 'lucide-react';

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

export default function AllDiscussions() {
    const discussions = [
        {
            id: 1,
            title: 'Community Garden Initiative - Location Suggestions',
            description: 'Discussion about potential locations for new community gardens in residential areas...',
            author: 'Emma Davis',
            authorImage: 'https://placehold.co/32x32/8e9cff/ffffff?text=ED',
            category: 'Environment',
            status: 'closed',
            replies: 28,
            participants: 19,
            time: '1 week ago',
            tags: ['environment', 'community-garden', 'sustainability'],
            locked: true,
        },
        {
            id: 2,
            title: 'Upcoming Park Renovation - Feedback Wanted',
            description: 'We are planning to renovate the main city park and would love to hear your ideas and suggestions.',
            author: 'John Doe',
            authorImage: 'https://placehold.co/32x32/ffc700/ffffff?text=JD',
            category: 'Civic',
            status: 'active',
            replies: 54,
            participants: 32,
            time: '2 days ago',
            tags: ['park', 'renovation', 'community-feedback'],
            locked: false,
        }
    ];

    return (
        <div className="space-y-6">
            {/* Header and Controls */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                    <h2 className="text-lg font-bold text-gray-900">Community Discussions</h2>
                    <p className="text-gray-500 mt-1 text-base">Manage discussion threads and community conversations</p>
                </div>
                <button className="flex items-center text-sm bg-[#ff5c00] text-white font-semibold px-4 py-2 rounded-lg mt-4 md:mt-0 hover:bg-[#e05100] transition-colors">
                    <Plus className="w-4 h-4 mr-2" />
                    Start Discussion
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search discussions..."
                        className="w-full bg-white border border-gray-300 rounded-lg pl-10 pr-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#ff5c00]"
                    />
                </div>
                <div className="relative">
                    <select className="appearance-none w-full md:w-auto bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#ff5c00]">
                        <option>Closed</option>
                        <option>Active</option>
                        <option>All Statuses</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
                <div className="relative">
                    <select className="appearance-none w-full md:w-auto bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#ff5c00]">
                        <option>All Categories</option>
                        <option>Environment</option>
                        <option>Civic</option>
                        <option>Budget</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
            </div>

            {/* Discussion List */}
            <div className="space-y-4">
                {discussions.map(d => (
                    <div key={d.id} className="bg-white border border-gray-200 p-5 rounded-lg">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center space-x-3">
                                {d.locked && <Lock className="w-5 h-5 text-gray-500" />}
                                <h3 className="text-lg font-bold text-gray-900">{d.title}</h3>
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
                            {d.status === 'closed' && <CategoryTag className="bg-orange-100 text-orange-800 border border-orange-200">closed</CategoryTag>}
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