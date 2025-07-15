import FormSection from "../common/FormSection";
import React from 'react';
import FormTextArea from "../common/FormTextArea";
import { Briefcase, Clock, MapPin, Users, Settings } from "lucide-react";
import FormInput from "../common/FormInput";
import ToggleSwitch from "../common/ToggleSwitch";

// REFACTORED: The component now receives 'event' and 'setEvent' as props.
export default function CreateEventForm({ event, setEvent }) {
    // REFACTORED: All individual useState hooks are removed.

    // Helper function to update a specific field in the event state object.
    const updateEventField = (field, value) => {
        setEvent(prevState => ({ ...prevState, [field]: value }));
    };

    return (
        <form className="space-y-8">

            {/* --- Event Details Section --- */}
            <FormSection icon={Briefcase} title="Event Details">
                <FormInput id="eventTitle" label="Event Title" placeholder="What's your event called?" value={event.eventTitle} onChange={(e) => updateEventField('eventTitle', e.target.value)} required />
                <FormTextArea id="eventDescription" label="Description" placeholder="Describe your event, what to expect, and any requirements..." value={event.eventDescription} onChange={(e) => updateEventField('eventDescription', e.target.value)} maxLength={2000} required />
            </FormSection>

            {/* --- Date & Time Section --- */}
            <FormSection icon={Clock} title="Date & Time">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormInput id="startDate" label="Start Date & Time" type="datetime-local" value={event.startDate} onChange={(e) => updateEventField('startDate', e.target.value)} required />
                    <FormInput id="endDate" label="End Date & Time" type="datetime-local" value={event.endDate} onChange={(e) => updateEventField('endDate', e.target.value)} />
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-md p-4 text-center">
                    <p className="text-sm text-blue-800 font-semibold">Time Zone: Nepal Standard Time (NPT)</p>
                    <p className="text-xs text-blue-600">Times will be displayed in each user's local timezone</p>
                </div>
            </FormSection>

            {/* --- Location Section --- */}
            <FormSection icon={MapPin} title="Location">
                <FormInput id="venue" label="Venue/Address" placeholder="Where is this event taking place?" value={event.venue} onChange={(e) => updateEventField('venue', e.target.value)} required />
                <FormTextArea id="locationDetails" label="Location Details" placeholder="Additional location information, parking instructions, etc." value={event.locationDetails} onChange={(e) => updateEventField('locationDetails', e.target.value)} />
                <ToggleSwitch label="Virtual/Online Option" description="Provide online access for remote participants" enabled={event.virtual} setEnabled={(val) => updateEventField('virtual', val)} />
            </FormSection>

            {/* --- Attendance Settings Section --- */}
            <FormSection icon={Users} title="Attendance Settings">
                <ToggleSwitch label="Require RSVP" description="Attendees must confirm their attendance" enabled={event.requireRsvp} setEnabled={(val) => updateEventField('requireRsvp', val)} />
                <FormInput id="maxAttendees" label="Maximum Attendees" type="number" min="1" value={event.maxAttendees} onChange={(e) => updateEventField('maxAttendees', e.target.value)} />
                <ToggleSwitch label="Enable Waitlist" description="Allow people to join a waitlist when event is full" enabled={event.enableWaitlist} setEnabled={(val) => updateEventField('enableWaitlist', val)} />
            </FormSection>

            {/* --- Additional Settings Section --- */}
            <FormSection icon={Settings} title="Additional Settings">
                <ToggleSwitch label="Send Reminders" description="Automatically remind attendees before the event" enabled={event.sendReminders} setEnabled={(val) => updateEventField('sendReminders', val)} />
                <ToggleSwitch label="Allow Comments" description="Let people ask questions and discuss the event" enabled={event.allowComments} setEnabled={(val) => updateEventField('allowComments', val)} />
                <FormInput id="contactInfo" label="Contact Information" placeholder="Email or phone for questions" value={event.contactInfo} onChange={(e) => updateEventField('contactInfo', e.target.value)} />
            </FormSection>

        </form>
    );
};