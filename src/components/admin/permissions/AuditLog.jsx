import { UserCheck, GitBranch, KeySquare, Trash2 } from 'lucide-react';

export default function AuditLog() {
    const logs = [
        { type: 'Role Created', description: "Created new role 'Content Manager'", by: 'Sarah Johnson', date: '2024-01-25 14:30:00', icon: GitBranch, color: 'green' },
        { type: 'Permission Modified', description: "Added 'delete' permission to Moderator role for content", by: 'Mike Chen', date: '2024-01-24 09:15:00', icon: KeySquare, color: 'blue' },
        { type: 'User Assigned', description: "Assigned 'Moderator' role to Emma Davis", by: 'Sarah Johnson', date: '2024-01-23 11:00:00', icon: UserCheck, color: 'purple' },
        { type: 'Role Deleted', description: "Deleted role 'Intern'", by: 'Sarah Johnson', date: '2024-01-22 17:45:00', icon: Trash2, color: 'red' },
    ];
    
    const colors = {
        green: { bg: 'bg-green-100', text: 'text-green-600' },
        blue: { bg: 'bg-blue-100', text: 'text-blue-600' },
        purple: { bg: 'bg-purple-100', text: 'text-purple-600' },
        red: { bg: 'bg-red-100', text: 'text-red-600' },
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-lg font-bold text-gray-900">Role & Permission Audit Log</h2>
                <p className="text-gray-500 mt-1 text-sm">Track changes to roles and permissions</p>
            </div>
            <div className="flow-root">
                <ul className="-mb-8">
                    {logs.map((log, index) => {
                        const Icon = log.icon;
                        const color = colors[log.color];
                        return (
                            <li key={index}>
                                <div className="relative pb-8">
                                    {index !== logs.length - 1 ? (
                                        <span className="absolute left-5 top-5 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                                    ) : null}
                                    <div className="relative flex items-start space-x-4">
                                        <div className={`h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 ${color.bg}`}>
                                            <Icon className={`h-5 w-5 ${color.text}`} aria-hidden="true" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <p className="text-base font-semibold text-gray-800">{log.type}</p>
                                                    <p className="text-base text-gray-600 mt-1">{log.description}</p>
                                                </div>
                                                <p className="text-sm text-gray-500 self-start pt-1">{log.date}</p>
                                            </div>
                                            <p className="text-sm text-gray-400 mt-2">by <span className="font-medium">{log.by}</span></p>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        )
                    })}
                </ul>
            </div>
        </div>
    );
};