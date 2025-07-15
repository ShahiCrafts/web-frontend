import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useCreateCommunity } from '../hooks/useCommunitiesTan'; // Adjust path

export default function CreateCommunityModal({ onClose, onSuccess }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(''); // Category is still required by schema
  const [errors, setErrors] = useState({});

  // Initialize the useCreateCommunity hook
  const createCommunityMutation = useCreateCommunity();

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const handleValidation = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = 'Community name is required.';
    if (!description.trim()) newErrors.description = 'Description is required.';
    if (!category.trim()) newErrors.category = 'Category is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!handleValidation()) {
      toast.error('Please fill in all required fields.');
      return;
    }

    try {
      const formData = {
        name,
        description,
        category,
        // 'privacy' and 'tags' are now omitted from formData,
        // relying on backend schema defaults if applicable.
      };

      await createCommunityMutation.mutateAsync(formData);

      toast.success('Community submitted for admin approval!');
      if (onSuccess) onSuccess();
      onClose();

    } catch (error) {
      const errorMessage = error.message || 'Failed to submit community for approval.';
      console.error('Error creating community:', error);
      toast.error(errorMessage);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[1000] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 md:p-8 relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-3xl leading-none"
          aria-label="Close modal"
        >
          &times;
        </button>

        <h2 className="text-xl font-bold text-center text-gray-800 mb-6">Create New Community</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Community Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg outline-none ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="e.g., Local Gardeners"
              autoFocus
              disabled={createCommunityMutation.isPending}
            />
            {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              id="description"
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg resize-y outline-none ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Briefly describe your community..."
              disabled={createCommunityMutation.isPending}
            />
            {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description}</p>}
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg outline-none ${errors.category ? 'border-red-500' : 'border-gray-300'}`}
                disabled={createCommunityMutation.isPending}
            >
                <option value="">Select a category</option>
                <option value="Neighborhood">Neighborhood</option>
                <option value="Interest">Interest</option>
                <option value="Issue">Issue</option>
                <option value="Event">Event</option>
                <option value="Public">Public</option>
            </select>
            {errors.category && <p className="text-red-600 text-sm mt-1">{errors.category}</p>}
          </div>

          <button
            type="submit"
            className="w-full mt-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold py-2 px-4 rounded-lg hover:from-orange-600 hover:to-red-600 transition"
            disabled={createCommunityMutation.isPending}
          >
            {createCommunityMutation.isPending ? 'Submitting...' : 'Create Community'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}