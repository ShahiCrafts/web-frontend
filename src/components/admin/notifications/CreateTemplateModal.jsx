import React, { useState, useEffect } from 'react';
import { X, Plus } from 'lucide-react';
import { useCreateNotificationTemplate } from '../../../hooks/admin/useNotificationTemplateHook'; // Use the template-specific hook
import toast from 'react-hot-toast';

// Reusable Modal component (can be in a separate file or defined here)
const Modal = ({ isOpen, onClose, title, children, maxWidth = 'max-w-lg' }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4">
            <div
                className={`bg-white rounded-lg shadow-xl w-full ${maxWidth} p-4 sm:p-6 animate-fade-in-up
                    max-h-[90vh] overflow-y-auto
                `}
            >
                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                    <h3 className="text-base sm:text-lg font-bold text-gray-800">{title}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                <div className="mt-4">
                    {children}
                </div>
            </div>
        </div>
    );
};


export default function CreateTemplateModal({ isOpen, onClose }) {
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('General');
    const [subject, setSubject] = useState('');
    const [content, setContent] = useState('');
    const [variablesInput, setVariablesInput] = useState(''); // Comma-separated string for variables

    // Use the specific hook for creating notification templates
    const createTemplateMutation = useCreateNotificationTemplate();

    // Reset form fields when the modal opens or closes
    useEffect(() => {
        if (!isOpen) {
            setTitle('');
            setCategory('General');
            setSubject('');
            setContent('');
            setVariablesInput('');
        }
    }, [isOpen]);

    // Handle form submission for creating a new template
    const handleSubmit = async () => {
        // Basic frontend validation
        if (!title || !subject || !content) {
            toast.error("Title, Subject, and Content are required.");
            return;
        }

        // Convert the comma-separated variables string into an array
        const variablesArray = variablesInput.split(',').map(v => v.trim()).filter(v => v !== '');

        const payload = {
            title,
            category,
            subject,
            content,
            variables: variablesArray,
        };

        try {
            // Call the mutation to create the template via the API
            await createTemplateMutation.mutateAsync(payload);
            onClose(); // Close the modal on successful creation
        } catch (error) {
            // Error handling is already managed by the useCreateNotificationTemplate hook's onError,
            // but you can add specific UI feedback here if needed.
            // console.error("Error submitting template:", error);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Create New Notification Template" maxWidth="max-w-xl">
            <div className="space-y-4">
                {/* Template Title Input */}
                <div>
                    <label htmlFor="template-title" className="block text-sm font-medium text-gray-700">Template Title</label>
                    <input
                        type="text"
                        id="template-title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-orange-500 focus:border-orange-500"
                        required
                    />
                </div>

                {/* Category Selection */}
                <div>
                    <label htmlFor="template-category" className="block text-sm font-medium text-gray-700">Category</label>
                    <select
                        id="template-category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-orange-500 focus:border-orange-500"
                    >
                        <option value="General">General</option>
                        <option value="Events">Events</option>
                        <option value="Discussions">Discussions</option>
                        <option value="Polls">Polls</option>
                        <option value="Admin">Admin</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                {/* Subject Input */}
                <div>
                    <label htmlFor="template-subject" className="block text-sm font-medium text-gray-700">Subject (for notification)</label>
                    <input
                        type="text"
                        id="template-subject"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-orange-500 focus:border-orange-500"
                        required
                    />
                </div>

                {/* Content Textarea */}
                <div>
                    <label htmlFor="template-content" className="block text-sm font-medium text-gray-700">Content (for notification)</label>
                    <textarea
                        id="template-content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows="4"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-orange-500 focus:border-orange-500"
                        required
                    ></textarea>
                </div>

                {/* Variables Input */}
                <div>
                    <label htmlFor="template-variables" className="block text-sm font-medium text-gray-700">Variables (comma-separated, e.g., event_name, event_date)</label>
                    <input
                        type="text"
                        id="template-variables"
                        value={variablesInput}
                        onChange={(e) => setVariablesInput(e.target.value)}
                        placeholder="e.g., eventName, eventDate, eventTime"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 mt-6">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                        disabled={createTemplateMutation.isLoading} // Disable while loading
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-orange-600 rounded-md hover:bg-orange-700"
                        disabled={createTemplateMutation.isLoading} // Disable while loading
                    >
                        {createTemplateMutation.isLoading ? 'Creating...' : <><Plus className="w-4 h-4" /> Create Template</>}
                    </button>
                </div>
            </div>
        </Modal>
    );
}
