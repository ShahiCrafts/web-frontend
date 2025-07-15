import React, { useState } from "react";

export default function Settings() {
  const [settings, setSettings] = useState({
    appName: "Civic Engage",
    allowSignups: true,
    requireApproval: false,
    defaultRole: "participant",
    enableQR: true,
    eventReminderEmail: true,
    eventReminderSMS: false,
    theme: "system",
    accentColor: "#ff5c00",
    strongPasswords: true,
    enable2FA: false,
    sessionTimeout: 30,
  });

  const handleChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Saved settings:", settings);
    // Save to backend here
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Admin Settings</h1>

      <form onSubmit={handleSubmit} className="space-y-8">

        <section className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">General Settings</h2>
          <div className="space-y-4">
            <label className="block">
              <span className="text-sm text-gray-700 font-medium">App Name</span>
              <input
                type="text"
                value={settings.appName}
                onChange={(e) => handleChange("appName", e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
              />
            </label>
          </div>
        </section>

        <section className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">User Management</h2>
          <div className="space-y-4">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={settings.allowSignups}
                onChange={(e) => handleChange("allowSignups", e.target.checked)}
              />
              <span>Allow public sign-ups</span>
            </label>

            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={settings.requireApproval}
                onChange={(e) => handleChange("requireApproval", e.target.checked)}
              />
              <span>Require manual account approval</span>
            </label>

            <label className="block">
              <span className="text-sm text-gray-700 font-medium">Default Role</span>
              <select
                value={settings.defaultRole}
                onChange={(e) => handleChange("defaultRole", e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="participant">Participant</option>
                <option value="volunteer">Volunteer</option>
                <option value="coordinator">Coordinator</option>
              </select>
            </label>
          </div>
        </section>

        <section className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Event Settings</h2>
          <div className="space-y-4">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={settings.enableQR}
                onChange={(e) => handleChange("enableQR", e.target.checked)}
              />
              <span>Enable QR Code Check-in</span>
            </label>
          </div>
        </section>

        <section className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Notifications</h2>
          <div className="space-y-4">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={settings.eventReminderEmail}
                onChange={(e) => handleChange("eventReminderEmail", e.target.checked)}
              />
              <span>Email Reminders for Events</span>
            </label>
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={settings.eventReminderSMS}
                onChange={(e) => handleChange("eventReminderSMS", e.target.checked)}
              />
              <span>SMS Reminders for Events</span>
            </label>
          </div>
        </section>

        <section className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Appearance</h2>
          <div className="space-y-4">
            <label className="block">
              <span className="text-sm font-medium text-gray-700">Theme</span>
              <select
                value={settings.theme}
                onChange={(e) => handleChange("theme", e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System Default</option>
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-700">Accent Color</span>
              <input
                type="color"
                value={settings.accentColor}
                onChange={(e) => handleChange("accentColor", e.target.value)}
                className="mt-1 h-10 w-16 border-gray-300 rounded-md"
              />
            </label>
          </div>
        </section>

        <section className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Security</h2>
          <div className="space-y-4">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={settings.strongPasswords}
                onChange={(e) => handleChange("strongPasswords", e.target.checked)}
              />
              <span>Require Strong Passwords</span>
            </label>
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={settings.enable2FA}
                onChange={(e) => handleChange("enable2FA", e.target.checked)}
              />
              <span>Enable Two-Factor Authentication</span>
            </label>

            <label className="block">
              <span className="text-sm text-gray-700 font-medium">Session Timeout (minutes)</span>
              <input
                type="number"
                min="5"
                value={settings.sessionTimeout}
                onChange={(e) => handleChange("sessionTimeout", parseInt(e.target.value))}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
              />
            </label>
          </div>
        </section>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-orange-500 text-white font-semibold px-6 py-2 rounded-md hover:bg-orange-600 transition"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
