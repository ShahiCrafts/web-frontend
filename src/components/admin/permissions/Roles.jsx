import { Shield, Users, CheckSquare, MoreHorizontal, Plus, Crown, UserCheck, FileClock } from 'lucide-react';

export default function Roles() {
    const roles = [
        {
            name: 'Super Admin',
            type: 'system',
            icon: Crown,
            iconColor: 'text-red-500',
            bgColor: 'bg-red-50',
            description: 'Full system access with all permissions',
            users: 2,
            permissions: 36,
            created: '2023-06-15',
        },
        {
            name: 'Admin',
            type: 'tenant',
            icon: Shield,
            iconColor: 'text-blue-500',
            bgColor: 'bg-blue-50',
            description: 'Administrative access within tenant organization',
            users: 8,
            permissions: 29,
            created: '2023-06-15',
        },
        {
            name: 'Moderator',
            type: 'tenant',
            icon: UserCheck,
            iconColor: 'text-green-500',
            bgColor: 'bg-green-50',
            description: 'Content moderation and community management',
            users: 15,
            permissions: 17,
            created: '2023-07-20',
        },
    ];

    const RoleCard = ({ role }) => (
        <div className="bg-white border border-gray-200 rounded-lg p-5 flex flex-col">
            <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${role.bgColor}`}>
                        <role.icon className={`w-5 h-5 ${role.iconColor}`} />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900">{role.name}</h3>
                        <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{role.type}</span>
                    </div>
                </div>
                <button className="text-gray-400 hover:text-gray-700">
                    <MoreHorizontal className="w-5 h-5" />
                </button>
            </div>
            <p className="text-gray-600 text-sm mt-4 flex-grow">{role.description}</p>
            <div className="mt-4 pt-4 border-t border-gray-200 space-y-2 text-sm">
                <div className="flex justify-between items-center text-gray-500">
                    <span className="flex items-center"><Users className="w-4 h-4 mr-2" /> Users</span>
                    <span className="font-semibold text-gray-800">{role.users}</span>
                </div>
                <div className="flex justify-between items-center text-gray-500">
                    <span className="flex items-center"><CheckSquare className="w-4 h-4 mr-2" /> Permissions</span>
                    <span className="font-semibold text-gray-800">{role.permissions}</span>
                </div>
                 <div className="flex justify-between items-center text-gray-500">
                    <span className="flex items-center"><FileClock className="w-4 h-4 mr-2" /> Created</span>
                    <span className="font-semibold text-gray-800">{role.created}</span>
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                    <h2 className="text-lg font-bold text-gray-900">Role Management</h2>
                    <p className="text-gray-500 mt-1 text-sm">Define and manage user roles and their permissions</p>
                </div>
                <button className="flex items-center bg-[#ff5c00] text-sm text-white font-semibold px-4 py-2 rounded-lg mt-4 md:mt-0 hover:bg-[#e05100] transition-colors">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Role
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {roles.map(role => <RoleCard key={role.name} role={role} />)}
            </div>
        </div>
    )
}