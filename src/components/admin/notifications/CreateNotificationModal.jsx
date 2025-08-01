import React, { useState, useEffect, useCallback } from 'react';
import { X, Send, Clock } from 'lucide-react';
import { useCreateAndSendNotification, useScheduleNotification } from '../../../hooks/admin/useAdminNotificationHook';
import { useFetchUsers } from '../../../hooks/admin/useUserTan';
import toast from 'react-hot-toast';

const Modal = ({ isOpen, onClose, title, children, maxWidth = 'max-w-lg' }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4">
            <div
                className={`bg-white rounded-lg shadow-xl w-full ${maxWidth} p-4 sm:p-6 animate-fade-in-up max-h-[90vh] overflow-y-auto`}
            >
                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                    <h3 className="text-base sm:text-lg font-bold text-gray-800">{title}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                <div className="mt-4">{children}</div>
            </div>
        </div>
    );
};

export default function CreateNotificationModal({ isOpen, onClose, template = null }) {
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [link, setLink] = useState('');
    const [recipientType, setRecipientType] = useState('SingleUser');
    const [selectedRecipientIds, setSelectedRecipientIds] = useState([]);
    const [scheduledAt, setScheduledAt] = useState('');
    const [variableValues, setVariableValues] = useState({});

    const createAndSendMutation = useCreateAndSendNotification();
    const scheduleMutation = useScheduleNotification();

    const { data: usersData, isLoading: isUsersLoading, isError: isUsersError } = useFetchUsers({ limit: -1 });
    const allUsers = usersData?.users || [];

    const replaceVariables = useCallback((text, values) => {
        let result = text;
        for (const varKey in values) {
            if (Object.prototype.hasOwnProperty.call(values, varKey)) {
                const regex = new RegExp(`{{\\s*${varKey}\\s*}}`, 'g');
                result = result.replace(regex, values[varKey] || '');
            }
        }
        return result;
    }, []);

    useEffect(() => {
        if (isOpen) {
            if (template) {
                setTitle(template.subject || '');
                setMessage(template.content || '');
                setLink(template.link || '');
                setRecipientType('SingleUser');
                setSelectedRecipientIds([]);
                setScheduledAt('');

                const initialVariableValues = {};
                if (Array.isArray(template.variables)) {
                    template.variables.forEach(variable => {
                        initialVariableValues[variable] = '';
                    });
                }
                setVariableValues(initialVariableValues);
            } else {
                setTitle('');
                setMessage('');
                setLink('');
                setRecipientType('SingleUser');
                setSelectedRecipientIds([]);
                setScheduledAt('');
                setVariableValues({});
            }
        } else {
            // Reset on modal close
            setTitle('');
            setMessage('');
            setLink('');
            setRecipientType('SingleUser');
            setSelectedRecipientIds([]);
            setScheduledAt('');
            setVariableValues({});
        }
    }, [isOpen, template]);

    useEffect(() => {
        if (template && isOpen) {
            const resolvedTitle = replaceVariables(template.subject || '', variableValues);
            const resolvedMessage = replaceVariables(template.content || '', variableValues);
            setTitle(resolvedTitle);
            setMessage(resolvedMessage);
        }
    }, [variableValues, template, isOpen, replaceVariables]);

    const handleRecipientSelect = (e) => {
        const userId = e.target.value;
        setSelectedRecipientIds(prev =>
            prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
        );
    };

    const handleVariableChange = (variable, value) => {
        setVariableValues(prev => ({
            ...prev,
            [variable]: value,
        }));
    };

    const handleSubmit = async (isScheduled) => {
        if (!title || !message || !recipientType) {
            toast.error('Title, message, and recipient type are required.');
            return;
        }
        if (recipientType === 'SingleUser' && selectedRecipientIds.length === 0) {
            toast.error("Please select at least one recipient for 'Single User' type.");
            return;
        }
        if (recipientType === 'SpecificGroup') {
            toast.error('Specific Group recipient type is not yet implemented.');
            return;
        }
        if (isScheduled && !scheduledAt) {
            toast.error('Scheduled date and time are required for scheduling.');
            return;
        }

        const payload = {
            title,
            message,
            link: link || null,
            recipientType,
            recipientIds: recipientType === 'AllUsers' ? [] : selectedRecipientIds,
        };

        if (isScheduled) {
            payload.scheduledAt = new Date(scheduledAt).toISOString();
        }

        try {
            if (isScheduled) {
                await scheduleMutation.mutateAsync(payload);
                toast.success('Notification scheduled successfully!');
            } else {
                await createAndSendMutation.mutateAsync(payload);
                toast.success('Notification sent successfully!');
            }
            onClose();
        } catch (err) {
            toast.error(`Failed to send/schedule notification: ${err.message || 'Unknown error.'}`);
            console.error('Notification submission error:', err);
        }
    };

    const isSending = createAndSendMutation.isLoading || scheduleMutation.isLoading;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={template ? `Create Notification from Template: ${template.title}` : 'Create New Notification'}
            maxWidth="max-w-2xl"
        >
            <div className="space-y-4">
                {/* Title Input */}
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                        Title
                    </label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-orange-500 focus:border-orange-500"
                        required
                    />
                </div>

                {/* Message Input */}
                <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                        Message
                    </label>
                    <textarea
                        id="message"
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        rows={4}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-orange-500 focus:border-orange-500"
                        required
                    />
                </div>

                {/* Dynamic Variable Inputs */}
                {template && template.variables && template.variables.length > 0 && (
                    <div className="space-y-3 p-4 bg-blue-50 border border-blue-200 rounded-md">
                        <h4 className="text-md font-semibold text-gray-800">Template Variables</h4>
                        {template.variables.map(variable => (
                            <div key={variable}>
                                <label htmlFor={`var-${variable}`} className="block text-sm font-medium text-gray-700">
                                    {typeof variable === 'string'
                                        ? variable
                                            .split('_')
                                            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                                            .join(' ')
                                        : variable}
                                    :
                                </label>
                                <input
                                    type="text"
                                    id={`var-${variable}`}
                                    value={variableValues[variable] || ''}
                                    onChange={e => handleVariableChange(variable, e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-orange-500 focus:border-orange-500"
                                />
                            </div>
                        ))}
                        <p className="mt-2 text-xs text-gray-600 italic">
                            These values will replace placeholders like <code>{'{{variableName}}'}</code> in the notification.
                        </p>
                    </div>
                )}

                {/* Link Input */}
                <div>
                    <label htmlFor="link" className="block text-sm font-medium text-gray-700">
                        Link (Optional)
                    </label>
                    <input
                        type="url"
                        id="link"
                        value={link}
                        onChange={e => setLink(e.target.value)}
                        placeholder="e.g., https://your-app.com/post/123"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                </div>

                {/* Recipient Type Selection */}
                <div>
                    <label htmlFor="recipientType" className="block text-sm font-medium text-gray-700">
                        Recipient Type
                    </label>
                    <select
                        id="recipientType"
                        value={recipientType}
                        onChange={e => {
                            setRecipientType(e.target.value);
                            setSelectedRecipientIds([]);
                        }}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-orange-500 focus:border-orange-500"
                    >
                        <option value="SingleUser">Single User</option>
                        <option value="AllUsers">All Users</option>
                        <option value="SpecificGroup">Specific Group (Not Implemented)</option>
                    </select>
                </div>

                {/* Single User Recipient Selection */}
                {recipientType === 'SingleUser' && (
                    <div>
                        <label htmlFor="recipientIds" className="block text-sm font-medium text-gray-700">
                            Select Recipients
                        </label>
                        {isUsersLoading ? (
                            <p className="mt-1 text-sm text-gray-500">Loading users...</p>
                        ) : isUsersError ? (
                            <p className="mt-1 text-sm text-red-500">Error loading users.</p>
                        ) : (
                            <div className="mt-1 max-h-40 overflow-y-auto border border-gray-300 rounded-md p-2">
                                {allUsers.length === 0 ? (
                                    <p className="text-sm text-gray-500">No users found.</p>
                                ) : (
                                    allUsers.map(user => (
                                        <div key={user._id} className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                id={`user-${user._id}`}
                                                value={user._id}
                                                checked={selectedRecipientIds.includes(user._id)}
                                                onChange={handleRecipientSelect}
                                                className="rounded border-gray-300 text-orange-600 shadow-sm focus:ring-orange-500"
                                            />
                                            <label htmlFor={`user-${user._id}`} className="text-sm text-gray-900">
                                                {user.fullName || user.email}
                                            </label>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* Scheduled At Input */}
                <div>
                    <label htmlFor="scheduledAt" className="block text-sm font-medium text-gray-700">
                        Schedule At (Optional, for future sending)
                    </label>
                    <input
                        type="datetime-local"
                        id="scheduledAt"
                        value={scheduledAt}
                        onChange={e => setScheduledAt(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 mt-6">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                        disabled={isSending}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => handleSubmit(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-orange-600 rounded-md hover:bg-orange-700"
                        disabled={isSending}
                    >
                        {isSending && !scheduledAt ? (
                            'Sending...'
                        ) : (
                            <>
                                <Send className="w-4 h-4" /> Send Now
                            </>
                        )}
                    </button>
                    <button
                        onClick={() => handleSubmit(true)}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700"
                        disabled={isSending}
                    >
                        {isSending && scheduledAt ? (
                            'Scheduling...'
                        ) : (
                            <>
                                <Clock className="w-4 h-4" /> Schedule
                            </>
                        )}
                    </button>
                </div>
            </div>
        </Modal>
    );
}
