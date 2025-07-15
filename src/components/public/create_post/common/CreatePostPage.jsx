import React, { useState } from 'react';
import { ArrowLeft, Eye, Save, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

// Form Components
import ReportIssueForm from '../issue_posts/ReportIssueForm';
import CreateEventForm from '../event_posts/CreateEventForm';
import CreatePollForm from '../poll_posts/CreatePollForm';
import DiscussionForm from '../discussion_posts/DiscussionForm';

// Preview Components
import PreviewDiscussion from '../discussion_posts/PreviewDiscussion';
import PreviewReport from '../issue_posts/PreviewReport';
import EventPreviewCard from '../event_posts/EventPreviewCard';
import PollPreviewCard from '../poll_posts/PollPreviewCard';

// UI Components
import PostTypeSelector from './PostTypeSelector';
import PostingGuidelines from './PostingGuidelines';
import QuickStats from './QuickStats';
import IconWrapper from './IconWrapper';

// Hooks
import { useCreatePost } from '../../../../hooks/user/usePostTan';
import { useAuth } from '../../../../context/AuthProvider';

const PostHeader = ({ togglePreview, onPublish, isSubmitting, onGoBack }) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-4">
      <button className="text-gray-600 hover:text-gray-900" onClick={onGoBack}>
        <IconWrapper icon={ArrowLeft} />
      </button>
      <div>
        <h1 className="text-xl font-bold text-gray-800">Create New Post</h1>
        <p className="text-gray-500 mt-1">Share your thoughts with the community</p>
      </div>
    </div>
    <div className="flex items-center gap-2">
      <button onClick={togglePreview} className="hidden sm:flex p-2 border rounded-lg bg-white hover:bg-gray-50" aria-label="Preview">
        <IconWrapper icon={Eye} />
      </button>
      <button className="hidden sm:flex p-2 border rounded-lg bg-white hover:bg-gray-50" aria-label="Save Draft">
        <IconWrapper icon={Save} />
      </button>
      <button
        onClick={onPublish}
        disabled={isSubmitting}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#ff5c00] rounded-lg hover:bg-[#f25700] disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle className="opacity-25" cx="12" cy="12" r="10" strokeWidth="4" />
            <path className="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" fill="currentColor" />
          </svg>
        ) : (
          <>
            <IconWrapper icon={Send} /> Publish
          </>
        )}
      </button>
    </div>
  </div>
);

const Sidebar = ({ title, content, tags }) => (
  <div className="space-y-6">
    <PostingGuidelines />
    <QuickStats title={title} content={content} tags={tags} />
  </div>
);

export default function CreatePostPage({ onClose }) {
  const { user: currentUser } = useAuth();
  const createPostMutation = useCreatePost();

  const [selectedPostType, setSelectedPostType] = useState('Discussion');
  const [showPreview, setShowPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attachments, setAttachments] = useState([]); // Centralized attachments state

  const [discussion, setDiscussion] = useState({ title: '', content: '', tags: [], community: null });

  const [report, setReport] = useState({
    visibility: 'Public', issueTitle: '', issueDescription: '', category: '', priorityLevel: 'Medium',
    responsibleDepartment: '', address: '', nearbyLandmark: '', contactInfo: '',
    expectedResolutionTime: '', publicVisibility: true, allowComments: true,
  });

  const [event, setEvent] = useState({
    eventTitle: '', eventDescription: '', startDate: '', endDate: '', venue: '', locationDetails: '',
    virtual: false, requireRsvp: false, maxAttendees: 10, enableWaitlist: false, sendReminders: true,
    allowComments: true, contactInfo: '',
  });

  const [poll, setPoll] = useState({
    question: '', description: '', options: [{ text: '', votes: 0 }, { text: '', votes: 0 }],
    settings: { allowMultiple: false, anonymous: true, allowComments: true, duration: '1 Week' } // Default duration
  });

  const handleClose = () => {
    onClose?.();
  };

  const togglePreview = () => setShowPreview(prev => !prev);

  const resetForm = () => {
    setDiscussion({ title: '', content: '', tags: [], community: null });
    setReport({
      visibility: 'Public', issueTitle: '', issueDescription: '', category: '', priorityLevel: 'Medium',
      responsibleDepartment: '', address: '', nearbyLandmark: '', contactInfo: '',
      expectedResolutionTime: '', publicVisibility: true, allowComments: true,
    });
    setEvent({
      eventTitle: '', eventDescription: '', startDate: '', endDate: '', venue: '', locationDetails: '',
      virtual: false, requireRsvp: false, maxAttendees: 10, enableWaitlist: false, sendReminders: true,
      allowComments: true, contactInfo: '',
    });
    setPoll({
      question: '', description: '', options: [{ text: '', votes: 0 }, { text: '', votes: 0 }],
      settings: { allowMultiple: false, anonymous: true, allowComments: true, duration: '1 Week' }
    });
    setAttachments([]); // Crucial: Clear attachments on form reset
    setShowPreview(false);
  };

  // Helper function to calculate poll end date based on duration string
  const calculatePollEndDate = (duration) => {
    const now = new Date();
    switch (duration) {
      case '24h':
        now.setHours(now.getHours() + 24);
        break;
      case 'week':
        now.setDate(now.getDate() + 7);
        break;
      case 'month':
        now.setMonth(now.getMonth() + 1);
        break;
      case 'none': // For "No preference" or indefinite poll, send a very distant future date
        now.setFullYear(now.getFullYear() + 100); // Poll ends 100 years from now
        break;
      default: // Fallback if duration is not recognized, default to 1 week
        now.setDate(now.getDate() + 7);
    }
    return now.toISOString(); // Return as ISO string
  };


  const handlePublish = () => {
    const formData = new FormData();
    formData.append('type', selectedPostType);
    formData.append('authorId', currentUser?.id);

    attachments.forEach(fileData => {
      formData.append('attachments', fileData.file);
    });

    switch (selectedPostType) {
      case 'Report Issue':
        formData.append('title', report.issueTitle);
        formData.append('content', report.issueDescription);
        formData.append('priorityLevel', report.priorityLevel);
        formData.append('responsibleDepartment', report.responsibleDepartment);
        formData.append('address', report.address);
        formData.append('nearbyLandmark', report.nearbyLandmark); // Make sure this is present in your report state
        formData.append('contactInfo', report.contactInfo);
        formData.append('expectedResolutionTime', report.expectedResolutionTime);
        formData.append('visibility', report.visibility === 'AdminOnly' ? 'Admin' : 'Public');
        formData.append('allowComments', report.allowComments);
        formData.append('category', report.category); // Map to categoryId if needed by backend schema
        break;

      case 'Event':
        formData.append('title', event.eventTitle);
        formData.append('eventDescription', event.eventDescription);
        formData.append('eventStartDate', event.startDate);
        formData.append('eventEndDate', event.endDate);
        formData.append('locationDetails', `${event.venue}\n${event.locationDetails}`.trim()); // Ensure 'venue' is part of event state
        formData.append('locationType', event.virtual ? 'Online' : 'Physical'); // Changed 'Online' to 'Physical' based on schema enum
        formData.append('requireRSVP', event.requireRsvp);
        formData.append('maxAttendees', event.maxAttendees);
        formData.append('enableWaitlist', event.enableWaitlist);
        formData.append('sendReminders', event.sendReminders);
        formData.append('allowComments', event.allowComments);
        formData.append('contactInfo', event.contactInfo); // Make sure contactInfo is present in event state
        break;

      case 'Poll':
        // Frontend validation for required poll fields
        if (!poll.question || !poll.settings.duration) {
            toast.error("Polls require a question and a duration.");
            setIsSubmitting(false);
            NProgress.done();
            return;
        }
        const filteredOptions = poll.options.filter(opt => opt.text.trim() !== '');
        if (filteredOptions.length < 2) {
            toast.error('Poll must have at least two non-empty options.');
            setIsSubmitting(false);
            NProgress.done();
            return;
        }

        formData.append('question', poll.question);
        formData.append('content', poll.description); // Optional description for the poll
        formData.append('allowMultipleSelections', poll.settings.allowMultiple);
        formData.append('notifyOnClose', poll.settings.anonymous); // Use poll.settings.anonymous
        formData.append('allowComments', poll.settings.allowComments); // Use poll.settings.allowComments

        // Append calculated pollEndsAt
        const pollEndsAtDate = calculatePollEndDate(poll.settings.duration);
        formData.append('pollEndsAt', pollEndsAtDate);

        // Append options individually as expected by Multer/Express for arrays of objects
        filteredOptions.forEach((option, index) => {
          formData.append(`options[${index}][label]`, option.text);
          // votes will be initialized to 0 on backend
        });
        break;

      case 'Discussion':
      default:
        formData.append('title', discussion.title);
        formData.append('content', discussion.content);
        discussion.tags.forEach(tag => formData.append('tags[]', tag));

        if (discussion.community && discussion.community._id) {
          formData.append('communityId', discussion.community._id);
        }
        break;
    }

    setIsSubmitting(true);
    NProgress.start();

    createPostMutation.mutate(formData, {
      onSuccess: () => {
        toast.success('Post created successfully!');
        resetForm();
      },
      onError: (err) => {
        console.error("Failed to create post error details:", err.response?.data); // Log full error
        const errorMsg = err.response?.data?.message || 'Please check form fields and try again.';
        toast.error(`Failed to create post: ${errorMsg}`);
      },
      onSettled: () => {
        setIsSubmitting(false);
        NProgress.done();
      }
    });
  };

  const renderForm = () => {
    switch (selectedPostType) {
      case 'Report Issue':
        return <ReportIssueForm report={report} setReport={setReport} attachments={attachments} setAttachments={setAttachments} />;
      case 'Event':
        return <CreateEventForm event={event} setEvent={setEvent} />;
      case 'Poll':
        return <CreatePollForm poll={poll} setPoll={setPoll} />;
      case 'Discussion':
      default:
        return (
          <DiscussionForm
            title={discussion.title}
            content={discussion.content}
            tags={discussion.tags}
            community={discussion.community}
            attachments={attachments}
            setTitle={(newTitle) => setDiscussion(prev => ({ ...prev, title: newTitle }))}
            setContent={(newContent) => setDiscussion(prev => ({ ...prev, content: newContent }))}
            setTags={(newTags) => setDiscussion(prev => ({ ...prev, tags: newTags }))}
            setCommunity={(newCommunity) => setDiscussion(prev => ({ ...prev, community: newCommunity }))}
            setAttachments={setAttachments}
          />
        );
    }
  };

  const renderPreview = () => {
    switch (selectedPostType) {
      case 'Report Issue':
        return <PreviewReport {...report} author={currentUser?.fullName} time="Just now" attachments={attachments} />;
      case 'Event': {
        let eventDate = 'TBA';
        let eventTime = 'TBA';
        if (event.startDate) {
          try {
            const dateObj = new Date(event.startDate);
            eventDate = dateObj.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
            eventTime = dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
          } catch (e) { /* Fail silently */ }
        }
        const previewProps = {
          title: event.eventTitle, description: event.eventDescription, host: currentUser?.fullName,
          date: eventDate, time: eventTime, location: event.venue, status: 'UPCOMING', banner: null,
          requireRsvp: event.requireRsvp, hostAvatar: currentUser?.avatar, attendees: [],
        };
        return <EventPreviewCard {...previewProps} />;
      }
      case 'Poll':
        return <PollPreviewCard author={currentUser} {...poll} />;
      case 'Discussion':
      default:
        return <PreviewDiscussion discussion={discussion} author={currentUser} attachments={attachments} />;
    }
  };

  const sidebarProps = {
    title: selectedPostType === 'Discussion' ? discussion.title :
      selectedPostType === 'Report Issue' ?
      report.issueTitle :
      selectedPostType === 'Event' ? event.eventTitle :
        selectedPostType === 'Poll' ?
        poll.question : '',
    content: selectedPostType === 'Discussion' ? discussion.content :
      selectedPostType === 'Report Issue' ?
      report.issueDescription :
      selectedPostType === 'Event' ? event.eventDescription :
        selectedPostType === 'Poll' ?
        poll.description : '',
    tags: selectedPostType === 'Discussion' ? discussion.tags : [],
  };

  return (
    <div className="font-sans">
      <div className="container mx-auto p-4">
        <div className="flex flex-col lg:flex-row gap-8">
          <main className="flex-1">
            <PostHeader togglePreview={togglePreview} onPublish={handlePublish} isSubmitting={isSubmitting} onGoBack={handleClose} />
            <div className="mt-6">
              {showPreview ? (
                <div className="bg-white border border-gray-200 rounded-lg">
                  {renderPreview()}
                </div>
              ) : (
                <div className="bg-white border
border-gray-200 rounded-lg p-6 space-y-8">
                  <PostTypeSelector selectedType={selectedPostType} setSelectedType={setSelectedPostType} />
                  {renderForm()}
                </div>
              )}
            </div>
          </main>
          <aside className="w-full lg:w-80 xl:w-96 flex-shrink-0">
            <Sidebar {...sidebarProps} />
          </aside>
        </div>
      </div>
    </div>
  );
}