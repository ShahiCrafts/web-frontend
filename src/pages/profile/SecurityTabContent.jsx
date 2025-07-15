import React from 'react';
import { Shield, Key, Smartphone, Monitor, Bell, Eye, Globe, Download, Trash2, ChevronRight } from 'lucide-react';
import { LuxuryButton } from './LuxuryButton'; // Assuming LuxuryButton is in a separate file

export function SecurityTabContent() {
    return (
        <section className="space-y-6">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <Shield className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                    Security & Privacy
                </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Security Settings */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-200/50">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Security Settings</h3>
                    <div className="space-y-4">
                        <LuxuryButton variant="secondary" className="w-full justify-start">
                            <Key className="w-4 h-4 mr-3" />
                            Change Password
                            <ChevronRight className="w-4 h-4 ml-auto" />
                        </LuxuryButton>
                        <LuxuryButton variant="secondary" className="w-full justify-start">
                            <Smartphone className="w-4 h-4 mr-3" />
                            Two-Factor Authentication
                            <ChevronRight className="w-4 h-4 ml-auto" />
                        </LuxuryButton>
                        <LuxuryButton variant="secondary" className="w-full justify-start">
                            <Monitor className="w-4 h-4 mr-3" />
                            Active Sessions
                            <ChevronRight className="w-4 h-4 ml-auto" />
                        </LuxuryButton>
                        <LuxuryButton variant="secondary" className="w-full justify-start">
                            <Bell className="w-4 h-4 mr-3" />
                            Login Alerts
                            <ChevronRight className="w-4 h-4 ml-auto" />
                        </LuxuryButton>
                    </div>
                </div>

                {/* Privacy Settings */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-200/50">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Privacy Settings</h3>
                    <div className="space-y-4">
                        <LuxuryButton variant="secondary" className="w-full justify-start">
                            <Eye className="w-4 h-4 mr-3" />
                            Profile Visibility
                            <ChevronRight className="w-4 h-4 ml-auto" />
                        </LuxuryButton>
                        <LuxuryButton variant="secondary" className="w-full justify-start">
                            <Globe className="w-4 h-4 mr-3" />
                            Data & Privacy
                            <ChevronRight className="w-4 h-4 ml-auto" />
                        </LuxuryButton>
                        <LuxuryButton variant="secondary" className="w-full justify-start">
                            <Download className="w-4 h-4 mr-3" />
                            Download Data
                            <ChevronRight className="w-4 h-4 ml-auto" />
                        </LuxuryButton>
                        <LuxuryButton variant="danger" className="w-full justify-start">
                            <Trash2 className="w-4 h-4 mr-3" />
                            Delete Account
                            <ChevronRight className="w-4 h-4 ml-auto" />
                        </LuxuryButton>
                    </div>
                </div>
            </div>
        </section>
    );
}