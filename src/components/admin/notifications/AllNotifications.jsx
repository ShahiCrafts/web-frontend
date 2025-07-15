import { Calendar, ChevronDown, MoreHorizontal, Plus, Search } from "lucide-react";

const allNotificationsData = [
  {
    id: 1,
    title: "Town Hall Meeting Reminder",
    description: "Don't forget about the Town Hall meeting tomorrow at 7 PM...",
    type: "Event",
    status: "sent",
    recipients: "1,247 All Users",
    performance: { openRate: "71.5%", clickRate: "26.2%" },
    created: "2024-01-25 14:30:00",
    author: "Sarah Johnson",
    priority: "high",
  },
  {
    id: 2,
    title: "New Budget Proposal",
    description: "A new budget proposal has been submitted for your review...",
    type: "Announcement",
    status: "sent",
    recipients: "854 Moderators",
    performance: { openRate: "85.2%", clickRate: "35.1%" },
    created: "2024-01-24 11:00:00",
    author: "Admin",
    priority: "medium",
  },
  {
    id: 3,
    title: "Community Park Cleanup",
    description: "Join us this Saturday for a community park cleanup event!",
    type: "Event",
    status: "scheduled",
    recipients: "All Users",
    performance: null,
    created: "2024-01-23 09:00:00",
    author: "Jane Doe",
    priority: "low",
  },
];

const StatusBadge = ({ status }) => {
  const styles = {
    sent: "bg-green-100 text-green-800",
    scheduled: "bg-yellow-100 text-yellow-800",
  };
  return (
    <span
      className={`inline-block px-3 py-0.5 text-xs font-semibold rounded-full ${
        styles[status] || "bg-gray-100 text-gray-800"
      }`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const PriorityBadge = ({ priority }) => {
  const styles = {
    high: "bg-red-100 text-red-800",
    medium: "bg-yellow-100 text-yellow-800",
    low: "bg-blue-100 text-blue-800",
  };
  return (
    <span
      className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${
        styles[priority] || "bg-gray-100 text-gray-800"
      }`}
    >
      {priority.charAt(0).toUpperCase() + priority.slice(1)}
    </span>
  );
};

const FilterDropdown = ({ label }) => (
  <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-300 rounded-md hover:bg-gray-200">
    {label}
    <ChevronDown className="w-4 h-4" />
  </button>
);

export default function AllNotifications() {
  return (
    <div className="bg-white rounded-lg">
      <div className="p-2">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Notification Center
            </h2>
            <p className="text-sm text-gray-500">
              Manage all platform notifications and communications
            </p>
          </div>
          <button
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-orange-600 rounded-md hover:bg-orange-700"
            style={{ backgroundColor: "#FF5C00" }}
          >
            <Plus className="w-4 h-4" />
            Create Notification
          </button>
        </div>
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search notifications..."
              className="w-full pl-10 pr-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <FilterDropdown label="All Status" />
          <FilterDropdown label="All Types" />
        </div>
      </div>
      <div className="overflow-x-auto px-2">
        <table className="min-w-full text-sm text-left text-gray-600">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-6 py-3 font-semibold">Notification</th>
              <th className="px-6 py-3 font-semibold">Type</th>
              <th className="px-6 py-3 font-semibold">Status</th>
              <th className="px-6 py-3 font-semibold">Recipients</th>
              <th className="px-6 py-3 font-semibold">Performance</th>
              <th className="px-6 py-3 font-semibold">Created</th>
              <th className="px-6 py-3 font-semibold text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {allNotificationsData.map((n) => (
              <tr key={n.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <Calendar
                      className="w-5 h-5 text-gray-400 flex-shrink-0"
                      aria-hidden="true"
                    />
                    <div>
                      <div className="font-semibold text-gray-800">{n.title}</div>
                      <div className="text-xs text-gray-500">{n.description}</div>
                      <div className="mt-1 flex items-center gap-2">
                        <PriorityBadge priority={n.priority} />
                        <span className="text-xs text-gray-500">by {n.author}</span>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 text-xs font-semibold text-gray-600 bg-gray-100 rounded">
                    {n.type}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={n.status} />
                </td>
                <td className="px-6 py-4 font-semibold text-gray-800">
                  {n.recipients}
                </td>
                <td className="px-6 py-4">
                  {n.performance ? (
                    <div>
                      <div className="font-semibold text-gray-800">
                        {n.performance.openRate} open rate
                      </div>
                      <div className="text-xs text-gray-500">
                        {n.performance.clickRate} click rate
                      </div>
                    </div>
                  ) : (
                    <span className="text-gray-500">--</span>
                  )}
                </td>
                <td className="px-6 py-4">{n.created}</td>
                <td className="px-6 py-4 text-center">
                  <button className="text-gray-500 hover:text-gray-800">
                    <MoreHorizontal className="w-5 h-5" aria-hidden="true" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
