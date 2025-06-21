import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import { motion, AnimatePresence } from 'framer-motion';

import { Megaphone, Tag, Loader2, X, Bold, Italic, Strikethrough, Paperclip } from 'lucide-react';

const MenuBar = ({ editor }) => {
  if (!editor) return null;

  const menuItems = [
    { name: 'bold', icon: Bold, action: () => editor.chain().focus().toggleBold().run(), tooltip: 'Bold' },
    { name: 'italic', icon: Italic, action: () => editor.chain().focus().toggleItalic().run(), tooltip: 'Italic' },
    { name: 'strike', icon: Strikethrough, action: () => editor.chain().focus().toggleStrike().run(), tooltip: 'Strikethrough' },
  ];

  return (
    <div className="flex flex-wrap items-center gap-1 border border-b-0 border-gray-300 rounded-t-lg p-2 bg-gray-50">
      {menuItems.map((item) => (
        <button
          key={item.name}
          type="button"
          onClick={item.action}
          className={`p-2 rounded hover:bg-gray-200 ${editor.isActive(item.name) ? 'bg-gray-300' : ''}`}
          title={item.tooltip}
        >
          <item.icon className="w-4 h-4" />
        </button>
      ))}
    </div>
  );
};

const AnnouncementSchema = Yup.object().shape({
  title: Yup.string().min(5).max(100).required('Title is required'),
  category: Yup.string()
    .oneOf(['Community News', 'Traffic Alert', 'Public Notice', 'System Update'])
    .required('Category is required'),
  content: Yup.string().min(20).required('Content is required'),
  isPinned: Yup.boolean(),
});

export default function AnnouncementForm({ initialData, onCancel, isOpen, onSubmit, isSubmittingExternal }) {
  const isEditing = !!initialData;
  const defaultInitialValues = { title: '', category: '', content: '', isPinned: false };
  const initialValues = initialData || defaultInitialValues;

  const FormFields = ({ values, setFieldValue, isSubmitting, errors, touched }) => {
    const editor = useEditor({
      extensions: [
        StarterKit,
        Link.configure({
          openOnClick: false,
          autolink: true,
          linkOnPaste: true,
        }),
      ],
      content: values.content,
      editorProps: {
        attributes: {
          class:
            'prose prose-sm sm:prose-base max-w-none w-full p-3 min-h-[80px] border border-gray-300 rounded-b-lg focus:outline-none focus:ring-1 focus:ring-blue-500',
        },
      },
      onUpdate: ({ editor }) => setFieldValue('content', editor.getHTML()),
    });

    return (
      <Form noValidate className="flex flex-col h-full bg-white p-2">
        <header className="flex-shrink-0 p-5 border-b border-gray-200">
          <h1 className="text-base font-semibold text-gray-800 flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-blue-600" />
            {isEditing ? 'Edit Announcement' : 'Create New Announcement'}
          </h1>
          <p className="text-sm text-gray-500 mt-1">Fill in the details to create or update an announcement.</p>
        </header>
        <div className="p-5 flex-grow overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Announcement Title *
              </label>
              <Field
                type="text"
                name="title"
                id="title"
                className={`w-full px-3 py-2 border rounded-lg text-sm transition-shadow ${
                  touched.title && errors.title ? 'border-red-500' : 'border-gray-300'
                } focus:ring-1 focus:ring-blue-500`}
              />
              <div className="flex justify-between mt-1">
                <ErrorMessage name="title" component="p" className="text-xs text-red-600" />
                <p className={`text-xs ${values.title.length > 100 ? 'text-red-600' : 'text-gray-500'}`}>
                  {values.title.length}/100
                </p>
              </div>
            </div>
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                <Tag size={14} className="inline mr-1" />
                Category *
              </label>
              <Field
                as="select"
                name="category"
                id="category"
                className={`w-full px-3 py-2 border rounded-lg text-sm bg-white transition-shadow ${
                  touched.category && errors.category ? 'border-red-500' : 'border-gray-300'
                } focus:ring-1 focus:ring-blue-500`}
              >
                <option value="" disabled>
                  Select a category
                </option>
                <option value="Community News">Community News</option>
                <option value="Traffic Alert">Traffic Alert</option>
                <option value="Public Notice">Public Notice</option>
                <option value="System Update">System Update</option>
              </Field>
              <ErrorMessage name="category" component="p" className="text-xs text-red-600 mt-1" />
            </div>
          </div>
          <div className="mb-6">
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <Field
                type="checkbox"
                name="isPinned"
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              Pin this announcement to the top
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Content *</label>
            <MenuBar editor={editor} />
            <EditorContent editor={editor} />
            <ErrorMessage name="content" component="p" className="text-xs text-red-600 mt-1" />
          </div>
        </div>
        <footer className="flex-shrink-0 flex items-center justify-end gap-4 px-5 py-4 border-t border-gray-200 bg-gray-50">
          <button
            type="button"
            onClick={onCancel}
            className="flex items-center gap-2 bg-white text-gray-700 font-semibold px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors text-sm"
          >
            <X size={16} /> Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmittingExternal}
            className="flex items-center gap-2 bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 text-sm"
          >
            {isSubmittingExternal ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
                <>
                <Paperclip size={18}/>
                <span>{isEditing ? 'Update Now' : 'Publish Now'}</span>
                </>
            )}
          </button>
        </footer>
      </Form>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={onCancel}
        >
          <motion.div
            initial={{ scale: 0.95, y: -20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'circOut' }}
            className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden border border-gray-200"
            onClick={(e) => e.stopPropagation()}
          >
            <Formik
              initialValues={initialValues}
              validationSchema={AnnouncementSchema}
              onSubmit={onSubmit}
              enableReinitialize
            >
              {(props) => <FormFields {...props} />}
            </Formik>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
