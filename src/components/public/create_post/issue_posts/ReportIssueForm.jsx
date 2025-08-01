import {
  AlertTriangle,
  MapPin,
  Phone,
  Tag,
  UploadCloud,
  Info,
  XCircle,
  Image as ImageIcon,
} from 'lucide-react';
import { useRef, useState } from 'react';
import FormInput from '../common/FormInput';
import FormSection from '../common/FormSection';
import FormSelect from '../common/FormSelect';
import FormTextArea from '../common/FormTextArea';
import ToggleSwitch from '../common/ToggleSwitch';

/**
 * A form for reporting a new issue.
 * @param {object} props - The component props.
 * @param {object} props.report - The state object for the report form.
 * @param {function} props.setReport - Function to update the report state.
 * @param {array} props.attachments - Array of file attachments.
 * @param {function} props.setAttachments - Function to update attachments.
 * @param {array} [props.categories=[]] - Array of category objects fetched from the API.
 * @param {boolean} [props.isLoadingCategories=false] - Loading state for categories.
 * @param {object} [props.errors={}] - Validation errors object.
 */
export default function ReportIssueForm({
  report,
  setReport,
  attachments,
  setAttachments,
  categories = [],
  isLoadingCategories = false,
  errors = {},
}) {
  const {
    visibility,
    issueTitle,
    issueDescription,
    category,
    contactInfo,
    expectedResolutionTime,
    publicVisibility,
    allowComments,
  } = report;

  const [uploading, setUploading] = useState(false);
  const inputRef = useRef();

  const updateReportField = (field, value) => {
    setReport((prev) => ({ ...prev, [field]: value }));
  };

  const handleGpsClick = () => {
    // ... (Function remains unchanged)
    if (!navigator.geolocation) {
   alert('Geolocation is not supported by your browser.');
   return;
  }
  navigator.geolocation.getCurrentPosition(
   (position) => {
    const { latitude, longitude } = position.coords;
    updateReportField('address', `Lat: ${latitude}, Lng: ${longitude}`);
   },
   (error) => {
    console.error('Geolocation error:', error);
    alert('Unable to fetch location.');
   }
  );
  };

  const handleImageUpload = (event) => {
    // ... (Function remains unchanged)
    const selectedFiles = Array.from(event.target.files);
  setUploading(true);
  setTimeout(() => {
   const newPreviews = selectedFiles.map((file) => ({
    file,
    preview: URL.createObjectURL(file),
   }));
   setAttachments((prev) => [...prev, ...newPreviews]);
   setUploading(false);
  }, 500);
  };

  const handleRemoveImage = (index) => {
    // ... (Function remains unchanged)
    setAttachments((prev) => {
   URL.revokeObjectURL(prev[index].preview);
   return prev.filter((_, i) => i !== index);
  });
  };

  return (
    <form className="space-y-6 text-gray-800">
      {/* Report Details */}
      <FormSection icon={AlertTriangle} title="Report Details">
        <FormSelect
          id="visibility"
          label="Visibility"
          value={visibility}
          onChange={(e) => updateReportField('visibility', e.target.value)}
          helpText="Report publicly for maximum visibility"
          required
        >
          <option value="">Choose where to post this report</option>
          <option value="Public">Public</option>
          <option value="AdminOnly">To Administrators Only</option>
        </FormSelect>
        {errors.visibility && <p className="mt-1 text-sm text-red-600">{errors.visibility}</p>}

        <FormInput
          id="issue-title"
          label="Issue Title"
          placeholder="Briefly describe the issue"
          value={issueTitle}
          onChange={(e) => updateReportField('issueTitle', e.target.value)}
          maxLength={100}
          required
        />
        {errors.issueTitle && <p className="mt-1 text-sm text-red-600">{errors.issueTitle}</p>}

        <FormTextArea
          id="issue-description"
          label="Detailed Description"
          placeholder="When it started, how it affects you or others..."
          value={issueDescription}
          onChange={(e) => updateReportField('issueDescription', e.target.value)}
          maxLength={2000}
          required
        />
        {errors.issueDescription && <p className="mt-1 text-sm text-red-600">{errors.issueDescription}</p>}
      </FormSection>

      {/* Classification */}
      <FormSection icon={Tag} title="Issue Classification">
        <FormSelect
          id="category"
          label="Category"
          value={category._id}
          onChange={(e) => updateReportField('category', e.target.value)}
          required
          disabled={isLoadingCategories}
        >
          <option value="">{isLoadingCategories ? 'Loading categories...' : 'Select issue category'}</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </FormSelect>
        {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
      </FormSection>

      {/* Location */}
      <FormSection icon={MapPin} title="Location">
        {/* ... (Location section remains unchanged) */}
        <div>
     <label className="block text-sm font-medium mb-1">Fetch GPS Location</label>
     <button
      type="button"
      onClick={handleGpsClick}
      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
     >
      Use Current Location
     </button>
     <p className="mt-2 text-sm text-gray-500">This sets the address field to the current coordinates</p>
    </div>
      </FormSection>

      {/* Media */}
      <FormSection icon={UploadCloud} title="Evidence & Photos">
        {/* ... (Media section remains unchanged) */}
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mt-4 rounded-md">
     <div className="flex">
      <Info className="h-5 w-5 text-blue-400 mt-[2px]" />
      <div className="ml-3 text-sm text-blue-700">
       <p>
        <span className="font-semibold">Photo Tips:</span> Take clear photos showing the issue from
        multiple angles.
       </p>
      </div>
     </div>
    </div>

    <div className="mt-4 space-y-3">
     <input
      ref={inputRef}
      type="file"
      accept="image/*"
      multiple
      hidden
      onChange={handleImageUpload}
     />
     <button
      type="button"
      onClick={() => inputRef.current.click()}
      disabled={uploading}
      className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-orange-500 rounded-md shadow hover:bg-orange-600"
     >
      <ImageIcon className="w-4 h-4 mr-2" />
      Upload Photos
     </button>

     <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {attachments.map((file, idx) => (
       <div key={idx} className="relative border rounded-xl overflow-hidden">
        <img
         src={file.preview}
         alt={`upload-${idx}`}
         className="w-full h-32 object-cover"
        />
        <button
         type="button"
         onClick={() => handleRemoveImage(idx)}
         className="absolute top-1 right-1 bg-white rounded-full p-1 shadow hover:bg-red-50"
        >
         <XCircle className="w-5 h-5 text-red-500" />
        </button>
       </div>
      ))}
     </div>
    </div>
      </FormSection>

      {/* Contact & Preferences */}
      <FormSection icon={Phone} title="Contact & Follow-up">
        {/* ... (Contact section remains unchanged) */}
        <FormInput
     id="contact-info"
     label="Contact Information (Optional)"
     placeholder="Phone number or email"
     value={contactInfo}
     onChange={(e) => updateReportField('contactInfo', e.target.value)}
     helpText="Helpful for follow-ups or clarification"
    />

    <FormSelect
     id="resolution-time"
     label="Expected Resolution Time"
     value={expectedResolutionTime}
     onChange={(e) => updateReportField('expectedResolutionTime', e.target.value)}
    >
     <option value="">When do you expect this to be resolved?</option>
     <option value="24h">Within 24 hours</option>
     <option value="week">Within a week</option>
     <option value="month">Within a month</option>
     <option value="none">No preference</option>
    </FormSelect>

    <div className="pt-4 space-y-4">
     <ToggleSwitch
      label="Public Visibility"
      description="Allow others to see and support this report"
      enabled={publicVisibility}
      setEnabled={(enabled) => updateReportField('publicVisibility', enabled)}
     />
     <ToggleSwitch
      label="Allow Comments"
      description="Let community members share input"
      enabled={allowComments}
      setEnabled={(enabled) => updateReportField('allowComments', enabled)}
     />
    </div>
      </FormSection>
    </form>
  );
}