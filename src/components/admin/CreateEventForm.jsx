import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Calendar, MapPin, Tag, Upload, X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const validationSchema = Yup.object({
    title: Yup.string().min(5).max(100).required("Title is required"),
    dateTime: Yup.string().required("Date & Time is required"),
    location: Yup.string().required("Location is required"),
    category: Yup.string()
        .oneOf([
            "Cleanup Drive",
            "Festival",
            "Community Meeting",
            "Workshop",
            "Public Hearing",
        ])
        .required("Category is required"),
    description: Yup.string().min(20).required("Description is required"),
});

export default function CreateEventForm({
    isOpen,
    onClose,
    onSubmit,
    isSubmittingExternal,
    initialData,
}) {
    const [coverImagePreview, setCoverImagePreview] = useState(null);

    useEffect(() => {
        if (initialData?.coverImage) {
            setCoverImagePreview(initialData.coverImage);
        } else {
            setCoverImagePreview(null);
        }
    }, [initialData]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.95, y: -20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.95, y: 20, opacity: 0 }}
                        transition={{ duration: 0.2, ease: "circOut" }}
                        className="bg-white rounded-xl shadow-lg w-full max-w-4xl max-h-[90vh] flex flex-col overflow-auto border border-gray-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Formik
                            initialValues={{
                                title: initialData?.title || "",
                                dateTime: initialData?.dateTime || "",
                                location: initialData?.location || "",
                                category: initialData?.category || "",
                                description: initialData?.description || "",
                                coverImage: null,
                            }}
                            enableReinitialize={true}
                            validationSchema={validationSchema}
                            onSubmit={async (values, actions) => {
                                try {
                                    const formData = new FormData();
                                    formData.append("title", values.title);
                                    formData.append("dateTime", values.dateTime);
                                    formData.append("location", values.location);
                                    formData.append("category", values.category);
                                    formData.append("description", values.description);
                                    if (values.coverImage) {
                                        formData.append("coverImage", values.coverImage);
                                    }

                                    await onSubmit(values, actions);  // <-- Pass actions as second param here!

                                    onClose();
                                } catch (error) {
                                    actions.setSubmitting(false);
                                    console.error("Submit failed:", error);
                                }
                            }}
                        >
                            {({
                                setFieldValue,
                                isSubmitting,
                                touched,
                                errors,
                                values,
                            }) => (
                                <Form className="flex flex-col h-full">
                                    {/* Header */}
                                    <header className="p-5 border-b border-gray-200">
                                        <h1 className="text-lg font-semibold">
                                            {initialData ? "Edit Event" : "Create New Event"}
                                        </h1>
                                        <p className="text-sm text-gray-500 mt-1">
                                            Fill in the details to{" "}
                                            {initialData ? "update" : "create"} your event.
                                        </p>
                                    </header>

                                    {/* Body */}
                                    <div className="flex flex-grow overflow-hidden">
                                        {/* Left column */}
                                        <div className="w-1/2 p-6 border-r border-gray-300 overflow-y-auto flex flex-col gap-6">
                                            {/* Title */}
                                            <div>
                                                <label className="block mb-1 font-medium text-gray-700">
                                                    Event Title *
                                                </label>
                                                <Field
                                                    name="title"
                                                    placeholder="Enter event title"
                                                    className={`w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring ${touched.title && errors.title
                                                            ? "border-red-500 ring-red-500"
                                                            : "border-gray-300 ring-blue-500"
                                                        }`}
                                                />
                                                <ErrorMessage
                                                    name="title"
                                                    component="div"
                                                    className="text-xs text-red-600 mt-1"
                                                />
                                            </div>

                                            {/* Date & Time */}
                                            <div>
                                                <label className="block mb-1 font-medium text-gray-700">
                                                    <Calendar className="inline w-4 h-4 mr-1 text-gray-400" />
                                                    Date & Time *
                                                </label>
                                                <Field
                                                    name="dateTime"
                                                    type="datetime-local"
                                                    className={`w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring ${touched.dateTime && errors.dateTime
                                                            ? "border-red-500 ring-red-500"
                                                            : "border-gray-300 ring-blue-500"
                                                        }`}
                                                />
                                                <ErrorMessage
                                                    name="dateTime"
                                                    component="div"
                                                    className="text-xs text-red-600 mt-1"
                                                />
                                            </div>

                                            {/* Location */}
                                            <div>
                                                <label className="block mb-1 font-medium text-gray-700">
                                                    <MapPin className="inline w-4 h-4 mr-1 text-gray-400" />
                                                    Location *
                                                </label>
                                                <Field
                                                    name="location"
                                                    placeholder="Enter location"
                                                    className={`w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring ${touched.location && errors.location
                                                            ? "border-red-500 ring-red-500"
                                                            : "border-gray-300 ring-blue-500"
                                                        }`}
                                                />
                                                <ErrorMessage
                                                    name="location"
                                                    component="div"
                                                    className="text-xs text-red-600 mt-1"
                                                />
                                            </div>

                                            {/* Category */}
                                            <div>
                                                <label className="block mb-1 font-medium text-gray-700">
                                                    <Tag className="inline w-4 h-4 mr-1 text-gray-400" />
                                                    Category *
                                                </label>
                                                <Field
                                                    as="select"
                                                    name="category"
                                                    className={`w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring ${touched.category && errors.category
                                                            ? "border-red-500 ring-red-500"
                                                            : "border-gray-300 ring-blue-500"
                                                        }`}
                                                >
                                                    <option value="" disabled>
                                                        Select a category
                                                    </option>
                                                    <option value="Cleanup Drive">Cleanup Drive</option>
                                                    <option value="Festival">Festival</option>
                                                    <option value="Community Meeting">
                                                        Community Meeting
                                                    </option>
                                                    <option value="Workshop">Workshop</option>
                                                    <option value="Public Hearing">Public Hearing</option>
                                                </Field>
                                                <ErrorMessage
                                                    name="category"
                                                    component="div"
                                                    className="text-xs text-red-600 mt-1"
                                                />
                                            </div>
                                        </div>

                                        {/* Right column */}
                                        <div className="w-1/2 p-6 overflow-y-auto flex flex-col gap-6">
                                            {/* Description */}
                                            <div>
                                                <label className="block mb-1 font-medium text-gray-700">
                                                    Description *
                                                </label>
                                                <Field
                                                    as="textarea"
                                                    name="description"
                                                    rows="12"
                                                    placeholder="Provide a detailed description of the event..."
                                                    className={`w-full border rounded px-3 py-2 text-sm resize-y focus:outline-none focus:ring ${touched.description && errors.description
                                                            ? "border-red-500 ring-red-500"
                                                            : "border-gray-300 ring-blue-500"
                                                        }`}
                                                />
                                                <ErrorMessage
                                                    name="description"
                                                    component="div"
                                                    className="text-xs text-red-600 mt-1"
                                                />
                                            </div>

                                            {/* Cover Image */}
                                            <div>
                                                <label className="block mb-1 font-medium text-gray-700">
                                                    Cover Image (Optional)
                                                </label>
                                                <div className="flex items-center gap-2">
                                                    <Upload className="text-gray-400 w-4 h-4" />
                                                    <input
                                                        type="file"
                                                        accept="image/png, image/jpeg"
                                                        onChange={(e) => {
                                                            const file = e.target.files[0];
                                                            if (file) {
                                                                const url = URL.createObjectURL(file);
                                                                setCoverImagePreview(url);
                                                                setFieldValue("coverImage", file);
                                                            }
                                                        }}
                                                        className="w-full text-sm"
                                                    />
                                                </div>
                                                {coverImagePreview && (
                                                    <div className="mt-3">
                                                        <img
                                                            src={coverImagePreview}
                                                            alt="Cover Preview"
                                                            className="rounded border max-h-48 object-cover"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Footer */}
                                    <footer className="flex-shrink-0 flex items-center justify-end gap-4 px-5 py-4 border-t border-gray-200 bg-gray-50">
                                        <button
                                            type="button"
                                            onClick={onClose}
                                            className="flex items-center gap-2 bg-white text-gray-700 font-semibold px-4 py-2 rounded border border-gray-300 hover:bg-gray-100 transition-colors text-sm"
                                        >
                                            <X size={16} /> Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isSubmitting || isSubmittingExternal}
                                            className="flex items-center gap-2 bg-blue-600 text-white font-semibold px-4 py-2 rounded hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 text-sm"
                                        >
                                            {isSubmitting || isSubmittingExternal ? (
                                                <>
                                                    <Loader2 size={16} className="animate-spin" />
                                                    <span>Saving...</span>
                                                </>
                                            ) : (
                                                <span>{initialData ? "Update Event" : "Create Event"}</span>
                                            )}
                                        </button>
                                    </footer>
                                </Form>
                            )}
                        </Formik>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
