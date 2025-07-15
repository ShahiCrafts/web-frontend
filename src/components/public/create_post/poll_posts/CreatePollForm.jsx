import { BarChart2, CheckSquare, Clock, Info, Lightbulb, Plus, Settings, Trash2 } from "lucide-react";
import FormInput from "../common/FormInput";
import FormSection from "../common/FormSection";
import FormSelect from "../common/FormSelect";
import FormTextArea from "../common/FormTextArea";
import React from 'react';
import IconWrapper from "../common/IconWrapper";
import ToggleSwitch from "../common/ToggleSwitch";

// REFACTORED: Component now receives 'poll' and 'setPoll' props.
export default function CreatePollForm({ poll, setPoll }) {
    // REFACTORED: All internal useState hooks are removed.

    // Helper to update a simple field in the main poll object.
    const updatePollField = (field, value) => {
        setPoll(prev => ({ ...prev, [field]: value }));
    };

    // Helper to update a nested field in the poll.settings object.
    const updateSetting = (field, value) => {
        setPoll(prev => ({
            ...prev,
            settings: { ...prev.settings, [field]: value },
        }));
    };

    const handleOptionChange = (index, value) => {
        const newOptions = poll.options.map((option, i) =>
            i === index ? { ...option, text: value } : option
        );
        updatePollField('options', newOptions);
    };

    const addOption = () => {
        if (poll.options.length < 10) {
            updatePollField('options', [...poll.options, { text: '', votes: 0 }]);
        }
    };

    const removeOption = (index) => {
        if (poll.options.length > 2) {
            const newOptions = poll.options.filter((_, i) => i !== index);
            updatePollField('options', newOptions);
        }
    };

    return (
        <div className="space-y-8">
            <FormSection icon={CheckSquare} title="Poll Details">
                <FormInput id="question" label="Poll Question" placeholder="What would you like to ask?" value={poll.question} onChange={(e) => updatePollField('question', e.target.value)} maxLength={200} required />
                <FormTextArea id="description" label="Description (Optional)" placeholder="Provide context..." value={poll.description} onChange={(e) => updatePollField('description', e.target.value)} maxLength={1000} />
            </FormSection>

            <FormSection icon={Plus} title="Poll Options">
                {poll.options.map((option, index) => (
                    <div key={index} className="flex items-center gap-2 w-full">
                        <div className="flex-1">
                            <FormInput id={`option-${index}`} placeholder={`Option ${index + 1}`} value={option.text} onChange={(e) => handleOptionChange(index, e.target.value)} />
                        </div>
                        {poll.options.length > 2 && (
                            <button type="button" onClick={() => removeOption(index)} className="p-2 text-gray-500 hover:text-red-600 rounded-full hover:bg-gray-100">
                                <Trash2 size={16} />
                            </button>
                        )}
                    </div>
                ))}
                <button onClick={addOption} disabled={poll.options.length >= 10} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50">
                    <IconWrapper icon={Plus} />
                    Add Option ({poll.options.length}/10)
                </button>
                {/* ... (Tip section) ... */}
            </FormSection>

            <FormSection icon={BarChart2} title="Poll Settings">
                <ToggleSwitch label="Allow Multiple Selections" description="Let users select more than one option" enabled={poll.settings.allowMultiple} setEnabled={(val) => updateSetting('allowMultiple', !!val)} />
                <ToggleSwitch label="Anonymous Voting" description="Hide who voted for what option" enabled={poll.settings.anonymous} setEnabled={(val) => updateSetting('anonymous', !!val)} />
            </FormSection>

            <FormSection icon={Clock} title="Poll Duration">
                <FormSelect id="poll-duration" label="How long should this poll run?" value={poll.settings.duration} onChange={(e) => updateSetting('duration', e.target.value)}>
                    <option>1 Day</option>
                    <option>3 Days</option>
                    <option>1 Week</option>
                    <option>2 Weeks</option>
                    <option>1 Month</option>
                </FormSelect>
                {/* ... (Info section) ... */}
            </FormSection>

            <FormSection icon={Settings} title="Additional Settings">
                <ToggleSwitch label="Allow Comments" description="Let people discuss the poll options" enabled={poll.settings.allowComments} setEnabled={(val) => updateSetting('allowComments', !!val)} />
            </FormSection>
        </div>
    );
};