import { Clock, Edit, Rocket } from "lucide-react";

const scheduledNotificationsData = [
  {
    id: 1,
    title: "New Budget Proposal Discussion",
    description:
      "A new budget proposal has been posted for community discussion. Share your thoughts!",
    recipients: "856",
    scheduledFor: "2024-01-26 09:00:00",
    createdBy: "Mike Chen",
  },
];

export default function ScheduledNotifications() {
  return (
    <div className="p-4 sm:p-6 bg-gray-50 rounded-lg border border-gray-200 space-y-6">
      <div className="flex items-center gap-3">
        <Clock className="w-6 h-6 text-yellow-500" />
        <div>
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
            Scheduled Notifications
          </h2>
          <p className="text-sm text-gray-500">
            Notifications scheduled for future delivery
          </p>
        </div>
      </div>

      {scheduledNotificationsData.map((n) => (
        <div
          key={n.id}
          className="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6"
        >
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800">
                  {n.title}
                </h3>
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-[#FF5C00]/90 text-white">
                  Scheduled
                </span>
              </div>
              <p className="text-gray-600">{n.description}</p>
              <div className="text-xs text-gray-500 mt-2">
                Recipients: {n.recipients} | Scheduled: {n.scheduledFor} | Created
                by: {n.createdBy}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-2 lg:mt-0">
              <button
                className="text-sm font-semibold border border-gray-300 text-gray-700 hover:bg-gray-100 px-4 py-2 rounded-md flex items-center gap-2 transition-colors"
              >
                <Edit className="w-4 h-4" /> Edit
              </button>

              <button
                className="text-sm font-semibold text-white px-4 py-2 rounded-md flex items-center gap-2 bg-[#FF5C00] hover:bg-[#e35300] transition-colors"
              >
                <Rocket className="w-4 h-4" /> Send Now
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
