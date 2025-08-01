import React, { useState } from "react";
import { Plus, Info, Search, ChevronDown } from "lucide-react"; // Added Search and ChevronDown for filters
import { useFetchNotificationTemplates } from '../../../hooks/admin/useNotificationTemplateHook'; // Correct hook for templates
import Pagination from '../../common/Pagination'; // Assuming your Pagination component
import CreateTemplateModal from './CreateTemplateModal'; // Import the new modal for creating templates
import CreateNotificationModal from './CreateNotificationModal'; // Assuming this is your existing modal for creating notifications

export default function Templates() {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [isCreateTemplateModalOpen, setIsCreateTemplateModalOpen] = useState(false);
    const [isCreateNotificationModalOpen, setIsCreateNotificationModalOpen] = useState(false); // State for CreateNotificationModal
    const [selectedTemplateForUse, setSelectedTemplateForUse] = useState(null); // State to hold template data when "Use Template" is clicked

    // Use the new hook to fetch templates
    const { data, isLoading, isError, error } = useFetchNotificationTemplates({
        page,
        limit,
        search: searchTerm, // Pass search term to the backend
        category: categoryFilter, // Pass category filter to the backend
    });

    const templates = data?.templates || [];
    const totalTemplates = data?.pagination?.totalTemplates || 0;
    const totalPages = data?.pagination?.totalPages || 0;

    // Function to handle "Use Template" button click
    const handleUseTemplate = (template) => {
        setSelectedTemplateForUse(template);
        setIsCreateNotificationModalOpen(true); // Open the existing notification creation modal
    };

    if (isError) {
        return (
            <div className="p-6 bg-gray-50 rounded-lg border border-gray-200 text-red-600 text-center">
                Error fetching templates: {error.message}
            </div>
        );
    }

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
                    onClick={() => setIsCreateTemplateModalOpen(true)} // Open the new modal
                >
                    <Plus className="w-4 h-4" />
                    Create Template
                </button>
            </div>

            {/* Search and Filter Bar */}
            <div className="flex items-center gap-4 mb-6">
                <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search templates..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                </div>
                <div className="relative">
                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="appearance-none w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                        <option value="">All Categories</option>
                        <option value="General">General</option>
                        <option value="Events">Events</option>
                        <option value="Discussions">Discussions</option>
                        <option value="Polls">Polls</option>
                        <option value="Admin">Admin</option>
                        <option value="Other">Other</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
            </div>

            {isLoading ? (
                <div className="py-10 text-center text-gray-500">Loading templates...</div>
            ) : templates.length === 0 ? (
                <div className="py-8 text-center text-gray-500">
                    <Info size={40} className="mx-auto text-gray-400 mb-3" />
                    <h3 className="font-semibold text-gray-700">No Templates Found</h3>
                    <p className="text-sm text-gray-500">No notification templates have been created yet.</p>
                    <button
                        className="mt-4 px-4 py-2 text-sm font-bold text-white rounded-md bg-orange-600 hover:bg-orange-700"
                        onClick={() => setIsCreateTemplateModalOpen(true)}
                    >
                        Create First Template
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {templates.map(t => (
                        <div key={t._id} className="bg-white border border-gray-200 rounded-lg p-5 flex flex-col justify-between">
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
                                            {t.variables.length > 0 ? (
                                                t.variables.map(v => (
                                                    <span key={v} className="px-2 py-0.5 text-xs bg-gray-200 text-gray-700 rounded-full">{v}</span>
                                                ))
                                            ) : (
                                                <span className="text-gray-500 italic">No variables</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
                                <span className="text-xs text-gray-500">Used {t.timesUsed} times</span>
                                <button
                                    className="text-sm font-semibold"
                                    style={{ color: "#FF5C00" }}
                                    onMouseEnter={e => e.currentTarget.style.color = "#e65300"}
                                    onMouseLeave={e => e.currentTarget.style.color = "#FF5C00"}
                                    onClick={() => handleUseTemplate(t)} // Pass template data to handler
                                >
                                    Use Template
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {totalTemplates > 0 && (
                <div className="mt-6">
                    <Pagination
                        currentPage={page}
                        totalCount={totalTemplates}
                        itemsPerPage={limit}
                        totalPages={totalPages}
                        onPageChange={setPage}
                        onLimitChange={(newLimit) => {
                            setPage(1);
                            setLimit(newLimit);
                        }}
                    />
                </div>
            )}

            {/* Create Template Modal */}
            <CreateTemplateModal
                isOpen={isCreateTemplateModalOpen}
                onClose={() => setIsCreateTemplateModalOpen(false)}
            />

            {/* Create Notification Modal (for using templates) */}
            <CreateNotificationModal
                isOpen={isCreateNotificationModalOpen}
                onClose={() => {
                    setIsCreateNotificationModalOpen(false);
                    setSelectedTemplateForUse(null); // Clear selected template on close
                }}
                template={selectedTemplateForUse} // Pass the selected template data
            />
        </div>
    );
}
