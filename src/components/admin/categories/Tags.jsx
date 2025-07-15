import React, { useState, useEffect } from 'react';
import {
    Plus,
    Search,
    Tag as TagIcon,
    Trash2,
    Pencil,
    X,
} from 'lucide-react';
import ConfirmDialog from '../../../components/common/ConfirmDialog';
import {
    useFetchTags,
    useCreateTag,
    useUpdateTag,
    useDeleteTag,
} from '../../../hooks/admin/useTagTan';

const StatusBadge = ({ status }) => {
    const styles = {
        active: "bg-green-100 text-green-800",
        inactive: "bg-yellow-100 text-yellow-800",
    };
    return (
        <span
            className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${styles[status] || "bg-gray-100 text-gray-800"
                }`}
        >
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    );
};

const FilterDropdown = ({ onChange, value }) => (
    <select
        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border focus:outline-none border-gray-300 rounded-lg w-full md:w-auto"
        onChange={(e) => onChange(e.target.value)}
        value={value}
    >
        <option value="all">All Status</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
    </select>
);

export default function Tags() {
    const [searchInput, setSearchInput] = useState('');
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('all');
    const [modalOpen, setModalOpen] = useState(false);
    const [form, setForm] = useState({ name: '', description: '', isEditing: false, editId: null });
    const [deleteId, setDeleteId] = useState(null);
    const [confirmOpen, setConfirmOpen] = useState(false);

    useEffect(() => {
        const handler = setTimeout(() => {
            setSearch(searchInput);
        }, 300);
        return () => clearTimeout(handler);
    }, [searchInput]);

    const isActiveFilter = status === 'active' ? true : status === 'inactive' ? false : undefined;

    const { data, isLoading } = useFetchTags({
        search,
        isActive: isActiveFilter,
    });

    const createTag = useCreateTag();
    const updateTag = useUpdateTag();
    const deleteTag = useDeleteTag();

    const openCreateModal = () => {
        setForm({ name: '', description: '', isEditing: false, editId: null });
        setModalOpen(true);
    };

    const openEditModal = (tag) => {
        setForm({ name: tag.name, description: tag.description, isEditing: true, editId: tag._id });
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setForm({ name: '', description: '', isEditing: false, editId: null });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.name) return;
        const payload = { name: form.name, description: form.description, isActive: true, };
        if (form.isEditing && form.editId) {
            updateTag.mutate({ id: form.editId, updateData: payload }, { onSuccess: closeModal });
        } else {
            createTag.mutate(payload, { onSuccess: closeModal });
        }
    };

    const handleDelete = (id) => {
        setDeleteId(id);
        setConfirmOpen(true);
    };

    const handleConfirmDelete = () => {
        if (deleteId) {
            deleteTag.mutate(deleteId);
        }
        setDeleteId(null);
        setConfirmOpen(false);
    };

    const handleCancelDelete = () => {
        setDeleteId(null);
        setConfirmOpen(false);
    };

    return (
        <div className="relative mt-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h2 className="text-xl font-semibold text-gray-800">Tags</h2>
                    <p className="text-sm text-gray-500 mt-1">Manage issue tags for specific topics</p>
                </div>
                <button
                    onClick={openCreateModal}
                    className="flex items-center gap-2 mt-4 md:mt-0 px-4 py-2 text-sm font-bold text-white bg-[#ff5c00] rounded-lg hover:bg-orange-600 transition"
                >
                    <Plus className="w-4 h-4" />
                    Create Tag
                </button>
            </div>

            <div className="flex items-center gap-3 mb-6">
                <div className="flex flex-1 items-center gap-3">
                    <div className="relative max-w-xs w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search tags..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 focus:outline-none rounded-lg"
                        />
                    </div>
                    <div className="w-32 md:w-auto">
                        <FilterDropdown onChange={setStatus} value={status} />
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="w-full text-sm text-left text-gray-600">
                    <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                        <tr>
                            <th className="px-6 py-3 font-semibold">Tag</th>
                            <th className="px-6 py-3 font-semibold">Status</th>
                            <th className="px-6 py-3 font-semibold">Issues</th>
                            <th className="px-6 py-3 font-semibold">Created</th>
                            <th className="px-6 py-3 font-semibold text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {isLoading ? (
                            <tr><td colSpan={5} className="text-center py-6 text-gray-500">Loading...</td></tr>
                        ) : data?.tags?.length > 0 ? (
                            data.tags.map((item) => (
                                <tr key={item._id} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-gray-100 rounded-md"><TagIcon className="w-4 h-4 text-gray-500" /></div>
                                            <div>
                                                <div className="font-semibold text-gray-800">{item.name}</div>
                                                <div className="text-xs text-gray-500">{item.description}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4"><StatusBadge status={item.isActive ? 'active' : 'inactive'} /></td>
                                    <td className="px-6 py-4">{item.issues || 0}</td>
                                    <td className="px-6 py-4">{new Date(item.createdAt).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 text-center space-x-2">
                                        <button onClick={() => openEditModal(item)} className="text-blue-600 hover:text-blue-800"><Pencil size={16} /></button>
                                        <button onClick={() => handleDelete(item._id)} className="text-red-600 hover:text-red-800"><Trash2 size={16} /></button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan={5} className="text-center py-6 text-gray-500">No tags found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {modalOpen && (
                <div className="fixed inset-0 bg-black/10 flex items-center justify-center z-40 p-4">
                    <div className="bg-white z-50 rounded-lg shadow-lg max-w-md w-full p-6 relative">
                        <button onClick={closeModal} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">
                            <X size={20} />
                        </button>
                        <h3 className="text-base font-semibold mb-4">{form.isEditing ? 'Edit Tag' : 'Create Tag'}</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input
                                type="text"
                                placeholder="Tag name"
                                value={form.name}
                                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-700"
                                required
                            />
                            <input
                                type="text"
                                placeholder="Description"
                                value={form.description}
                                onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-700"
                            />
                            <div className="flex justify-end gap-3">
                                <button type="button" onClick={closeModal} className="px-4 py-2 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100">
                                    Cancel
                                </button>
                                <button type="submit" className="px-4 py-2 bg-[#ff5c00] text-white rounded-md hover:bg-orange-600 font-semibold">
                                    {form.isEditing ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <ConfirmDialog
                open={confirmOpen}
                onClose={handleCancelDelete}
                onConfirm={handleConfirmDelete}
            />
        </div>
    );
}
