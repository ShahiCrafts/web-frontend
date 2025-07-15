import { CheckCircle } from "lucide-react";

const sentNotificationsData = [
  {
    id: 1,
    title: "Town Hall Meeting Reminder",
    description:
      "Don't forget about the Town Hall meeting tomorrow at 7 PM in the City Hall Auditorium.",
    recipients: "1,247",
    openRate: "71.5%",
    clickRate: "26.2%",
    sentAt: "2024-01-25 15:00:00",
    author: "Sarah Johnson",
    channels: "email, push, sms",
  },
];

export default function SentNotifications() {
  return (
    <div className="p-6 bg-gray-50 rounded-lg border border-gray-200 space-y-6">
      <div className="flex items-center gap-3">
        <CheckCircle className="w-6 h-6 text-green-500"/>
        <div>
          <h2 className="text-xl font-semibold">
            Sent Notifications
          </h2>
          <p className="text-sm text-gray-500">
            Successfully delivered notifications with performance metrics
          </p>
        </div>
      </div>
      {sentNotificationsData.map((n) => (
        <div
          key={n.id}
          className="bg-white border border-gray-200 rounded-lg p-6"
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold">
                {n.title}
              </h3>
              <p className="text-gray-600 mt-1">{n.description}</p>
            </div>
            <button
              className="text-sm font-semibold"
              style={{ color: "#FF5C00" }}
            >
              View Analytics
            </button>
          </div>
          <div className="grid grid-cols-3 gap-6 border-y border-gray-200 py-4 mb-4">
            <div>
              <div className="text-2xl font-bold">
                {n.recipients}
              </div>
              <div className="text-sm text-gray-500">Recipients</div>
            </div>
            <div>
              <div className="text-2xl font-bold">
                {n.openRate}
              </div>
              <div className="text-sm text-gray-500">Open Rate</div>
            </div>
            <div>
              <div className="text-2xl font-bold">
                {n.clickRate}
              </div>
              <div className="text-sm text-gray-500">Click Rate</div>
            </div>
          </div>
          <div className="text-xs text-gray-400">
            Sent: {n.sentAt} | By: {n.author} | Channels: {n.channels}
          </div>
        </div>
      ))}
    </div>
  );
}
