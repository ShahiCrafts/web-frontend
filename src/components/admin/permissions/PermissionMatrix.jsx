import { Crown, Shield, UserCheck } from "lucide-react";

export default function PermissionMatrix() {
    const permissions = {
        'Users': ['create', 'read', 'update', 'delete', 'manage_roles'],
        'Content': ['create', 'read', 'update', 'delete', 'moderate', 'update_own'],
        'Discussions': ['create', 'read', 'update', 'delete', 'moderate'],
        'Settings': ['read', 'update'],
    };

    const roles = [
        { name: 'Super Admin', icon: Crown, color: 'bg-red-500', perms: { Users: ['create', 'read', 'update', 'delete', 'manage_roles'], Content: ['create', 'read', 'update', 'delete', 'moderate'], Discussions: ['create', 'read', 'update', 'delete', 'moderate'], Settings: ['read', 'update'] } },
        { name: 'Admin', icon: Shield, color: 'bg-blue-500', perms: { Users: ['create', 'read', 'update', 'delete'], Content: ['create', 'read', 'update', 'delete', 'moderate'], Discussions: ['create', 'read', 'update', 'delete', 'moderate'], Settings: ['read'] } },
        { name: 'Moderator', icon: UserCheck, color: 'bg-green-500', perms: { Users: ['read', 'update'], Content: ['read', 'update', 'moderate'], Discussions: ['read', 'update', 'moderate'] } },
    ];
    
    const PermissionTag = ({ permission }) => <span className="inline-block bg-gray-100 text-gray-700 text-xs font-medium mr-2 mb-2 px-2.5 py-1 rounded-md">{permission}</span>

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-lg font-bold text-gray-900">Permission Matrix</h2>
                <p className="text-gray-500 mt-1 text-sm">Overview of permissions across all roles</p>
            </div>
             <div className="bg-white border border-gray-200 rounded-lg overflow-x-auto">
                <table className="min-w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">Resource / Action</th>
                            {roles.map((role) => (
                                <th key={role.name} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    <div className="flex items-center">
                                       <span className={`h-6 w-6 rounded-full ${role.color} flex items-center justify-center mr-2`}>
                                           <role.icon className="w-4 h-4 text-white" />
                                       </span> 
                                       {role.name}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {Object.keys(permissions).map((resource) => (
                            <tr key={resource}>
                                <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-800">{resource}</td>
                                {roles.map((role, i) => {
                                    const rolePerms = role.perms[resource] || [];
                                    return (
                                        <td key={`${role.name}-${i}`} className="px-6 py-4 align-top">
                                            <div className="flex flex-wrap">
                                                {rolePerms.length > 0 ? rolePerms.map(p => <PermissionTag key={p} permission={p} />) : <span className="text-gray-400">None</span>}
                                            </div>
                                        </td>
                                    )
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}