import React, { useState } from 'react';
import {
  Megaphone,
  Search,
  Plus,
  Pin,
  Pencil,
  Trash2,
  Info,
} from 'lucide-react';
import toast from 'react-hot-toast';
import AnnouncementForm from './AnnouncementForm';
import {
  useFetchAnnouncements,
  useCreateAnnouncement,
  useUpdateAnnouncement,
  useDeleteAnnouncement,
} from '../../hooks/admin/useAnnouncementTan';
import { useAuth } from '../../auth/AuthProvider';
import Pagination from '../common/Pagination';
import ConfirmDialog from '../common/ConfirmDialog';

const CategoryBadge = ({ category }) => {
  const styles = {
    'Community News': 'bg-blue-100 text-blue-800',
    'Traffic Alert': 'bg-yellow-100 text-yellow-800',
    'Public Notice': 'bg-red-100 text-red-800',
    'System Update': 'bg-purple-100 text-purple-800',
  };
  return (
    <span
      className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${
        styles[category] || 'bg-gray-100 text-gray-800'
      }`}
    >
      {category}
    </span>
  );
};

export default function AnnouncementsPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [announcementToDelete, setAnnouncementToDelete] = useState(null);

  const { user: currentUser } = useAuth();

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useFetchAnnouncements({
    page: currentPage,
    limit: itemsPerPage,
    search: searchTerm,
  });

  const createAnnouncementMutation = useCreateAnnouncement();
  const updateAnnouncementMutation = useUpdateAnnouncement();
  const deleteAnnouncementMutation = useDeleteAnnouncement();

  const announcements = data?.announcements || [];
  const totalItems = data?.total || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });

  const handleCreateNew = () => {
    setEditingAnnouncement(null);
    setIsFormOpen(true);
  };

  const handleEdit = (announcement) => {
    setEditingAnnouncement(announcement);
    setIsFormOpen(true);
  };

  const handleDelete = (id) => {
    setAnnouncementToDelete(id);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (announcementToDelete) {
      try {
        await deleteAnnouncementMutation.mutateAsync(announcementToDelete);
        toast.success('Announcement deleted successfully!');
        refetch();
      } catch (err) {
        toast.error(`Failed to delete announcement: ${err.message}`);
      } finally {
        setConfirmOpen(false);
        setAnnouncementToDelete(null);
      }
    }
  };

  const handleFormSubmit = async (values, actions) => {
    const author = currentUser?.fullName || currentUser?.name || 'Unknown Author';
    const payload = { ...values, author };

    try {
      if (editingAnnouncement) {
        await updateAnnouncementMutation.mutateAsync({
          id: editingAnnouncement._id,
          updateData: payload,
        });
        toast.success('Announcement updated successfully!');
      } else {
        await createAnnouncementMutation.mutateAsync(payload);
        toast.success('Announcement created successfully!');
      }
      setIsFormOpen(false);
      setEditingAnnouncement(null);
      actions.resetForm();
      refetch();
    } catch (err) {
      toast.error(`Failed to submit announcement: ${err.message}`);
    } finally {
      actions.setSubmitting(false);
    }
  };

  const handleFormCancel = () => {
    setIsFormOpen(false);
    setEditingAnnouncement(null);
  };

  return (
    <div className="bg-slate-50 min-h-screen font-sans">
      <div className="w-full bg-white rounded-xl shadow-lg p-5 max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div className="mb-4 md:mb-0">
            <h1 className="text-base font-semibold text-gray-800 flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-blue-600" />
              Announcements Management
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Create, view, and manage all official community announcements.
            </p>
          </div>
          <div className="flex items-center space-x-2 w-full md:w-auto">
            <div className="relative flex-grow md:flex-grow-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by title..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={handleCreateNew}
              className="flex-shrink-0 flex items-center gap-2 bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              <Plus size={18} />
              New
            </button>
          </div>
        </header>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Published</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {(isLoading || isFetching) ? (
                <tr>
                  <td colSpan="5" className="text-center py-16">Loading announcements...</td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan="5" className="text-center py-16 text-red-600">Error loading announcements: {error.message}</td>
                </tr>
              ) : announcements.length > 0 ? (
                announcements.map((ann) => (
                  <tr key={ann._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {ann.isPinned && <Pin size={16} className="text-gray-400" title="Pinned" />}
                        <span className="text-sm font-medium text-gray-900">{ann.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <CategoryBadge category={ann.category} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{ann.author}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{formatDate(ann.createdAt)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <div className="flex items-center justify-center gap-4">
                        <button
                          onClick={() => handleEdit(ann)}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                          title="Edit"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(ann._id)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-16 px-4">
                    <div className="flex flex-col items-center gap-3 max-w-sm mx-auto">
                      <Info size={40} className="text-gray-400" />
                      <h3 className="text-lg font-semibold text-gray-700">No Announcements Found</h3>
                      <p className="text-sm text-gray-500 text-center">No announcements match your search. Try a different term or create one.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 0 && (
          <Pagination
            currentPage={currentPage}
            totalCount={totalItems}
            itemsPerPage={itemsPerPage}
            totalPages={totalPages}
            onPageChange={(page) => {
              if (page >= 1 && page <= totalPages) {
                setCurrentPage(page);
              }
            }}
            onLimitChange={(limit) => {
              setCurrentPage(1);
              setItemsPerPage(limit);
            }}
          />
        )}
      </div>

      <AnnouncementForm
        isOpen={isFormOpen}
        initialData={editingAnnouncement}
        onSubmit={handleFormSubmit}
        onCancel={handleFormCancel}
        isSubmittingExternal={createAnnouncementMutation.isLoading || updateAnnouncementMutation.isLoading}
      />

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={confirmDelete}
        isLoading={deleteAnnouncementMutation.isLoading}
      />
    </div>
  );
}
