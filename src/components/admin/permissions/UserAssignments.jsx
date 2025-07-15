import { Shield, Users, MoreHorizontal, Plus, Search, ChevronDown, Crown, UserCheck } from 'lucide-react';

export default function UserAssignments() {
    const users = [
        { name: 'Sarah Johnson', email: 'sarah@springfield.gov', role: 'Super Admin', roleType: 'system', tenant: 'City of Springfield', status: 'active', lastActive: '2 hours ago', avatar: 'https://placehold.co/32x32/c4b5fd/ffffff?text=SJ' },
        { name: 'Mike Chen', email: 'mike@springfield.gov', role: 'Admin', roleType: 'tenant', tenant: 'City of Springfield', status: 'active', lastActive: '1 day ago', avatar: 'https://placehold.co/32x32/93c5fd/ffffff?text=MC' },
        { name: 'Emma Davis', email: 'emma@springfield.gov', role: 'Moderator', roleType: 'tenant', tenant: 'City of Springfield', status: 'active', lastActive: '3 days ago', avatar: 'https://placehold.co/32x32/8e9cff/ffffff?text=ED' },
        { name: 'John Doe', email: 'john@example.com', role: 'Member', roleType: 'tenant', tenant: 'Community Org', status: 'inactive', lastActive: '2 weeks ago', avatar: 'https://placehold.co/32x32/ffc700/ffffff?text=JD' },
    ];
    
    const RoleBadge = ({ role }) => {
        const styles = {
            'Super Admin': { icon: Crown, color: 'text-red-600' },
            'Admin': { icon: Shield, color: 'text-blue-600' },
            'Moderator': { icon: UserCheck, color: 'text-green-600' },
            'Member': { icon: Users, color: 'text-gray-600' },
        }
        const style = styles[role] || styles['Member'];
        const Icon = style.icon;
        
        return (
            <span className={`flex items-center font-semibold ${style.color}`}>
                <Icon className="w-4 h-4 mr-1.5" /> {role}
            </span>
        )
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                    <h2 className="text-lg font-bold text-gray-900">User Role Assignments</h2>
                    <p className="text-gray-500 mt-1 text-sm">Manage user roles and access permissions</p>
                </div>
                <button className="flex items-center bg-[#ff5c00] text-white font-semibold px-4 py-2 rounded-lg mt-4 md:mt-0 hover:bg-[#e05100] transition-colors">
                    <Plus className="w-5 h-5 mr-2" />
                    Assign Role
                </button>
            </div>

            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search users..."
                        className="w-full bg-white border border-gray-300 rounded-lg pl-10 pr-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#ff5c00]"
                    />
                </div>
                <div className="relative">
                    <select className="appearance-none w-full md:w-auto bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#ff5c00]">
                        <option>All Roles</option>
                        <option>Super Admin</option>
                        <option>Admin</option>
                        <option>Moderator</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"/>
                </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tenant</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Active</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {users.map(user => (
                            <tr key={user.email}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <img className="h-8 w-8 rounded-full" src={user.avatar} alt={user.name} />
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                            <div className="text-sm text-gray-500">{user.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm"><RoleBadge role={user.role} /></td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{user.tenant}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                        {user.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.lastActive}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button className="text-gray-400 hover:text-gray-700"><MoreHorizontal className="w-5 h-5" /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}