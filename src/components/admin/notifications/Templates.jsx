import { Plus } from "lucide-react";

const templatesData = [
    { id: 1, title: "Event Reminder", category: "Events", subject: "Reminder: {{event_name}} - {{event_date}}", content: "Don't forget about {{event_name}} on {{event_date}} at {{event_time}} in {{event_location}}.", variables: ["event_name", "event_date", "event_time", "event_location"], used: 23 },
    { id: 2, title: "New Discussion", category: "Discussions", subject: "New Discussion: {{discussion_title}}", content: "A new discussion '{{discussion_title}}' has been started by {{author_name}}. Join the conversation!", variables: ["discussion_title", "author_name"], used: 15 },
    { id: 3, title: "Poll Announcement", category: "Polls", subject: "New Poll: {{poll_title}}", content: "A new poll '{{poll_title}}' is now available. Your opinion matters - vote now!", variables: ["poll_title"], used: 12 },
];

export default function Templates() {
    return (
        <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-xl font-semibold text-gray-800">Notification Templates</h2>
                    <p className="text-sm text-gray-500">Pre-built templates for common notification types</p>
                </div>
                <button
                    className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white rounded-md"
                    style={{ backgroundColor: "#FF5C00" }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = "#e65300"}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = "#FF5C00"}
                >
                    <Plus className="w-4 h-4" />
                    Create Template
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {templatesData.map(t => (
                    <div key={t.id} className="bg-white border border-gray-200 rounded-lg p-5 flex flex-col justify-between">
                        <div>
                            <div className="flex justify-between items-start mb-3">
                                <h3 className="text-base font-semibold text-gray-800">{t.title}</h3>
                                <span className="px-2 py-1 text-xs font-semibold text-gray-600 bg-gray-100 rounded">{t.category}</span>
                            </div>
                            <div className="space-y-3 text-sm">
                                <div><span className="font-semibold text-gray-500">Subject: </span><span className="text-gray-700">{t.subject}</span></div>
                                <div><span className="font-semibold text-gray-500">Content: </span><span className="text-gray-700">{t.content}</span></div>
                                <div>
                                    <span className="font-semibold text-gray-500">Variables: </span>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                        {t.variables.map(v => (
                                            <span key={v} className="px-2 py-0.5 text-xs bg-gray-200 text-gray-700 rounded-full">{v}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
                            <span className="text-xs text-gray-500">Used {t.used} times</span>
                            <button
                                className="text-sm font-semibold"
                                style={{ color: "#FF5C00" }}
                                onMouseEnter={e => e.currentTarget.style.color = "#e65300"}
                                onMouseLeave={e => e.currentTarget.style.color = "#FF5C00"}
                            >
                                Use Template
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
