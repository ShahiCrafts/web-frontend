import React, { useState } from "react";
import { CalendarDays, Pencil, Trash2, Plus, Search, Info } from "lucide-react";
import toast from "react-hot-toast";
import Pagination from "../common/Pagination";
import ConfirmDialog from "../common/ConfirmDialog";
import CreateEventForm from "./CreateEventForm";
import {
    useCreateEvent,
    useDeleteEvent,
    useFetchEvents,
    useUpdateEvent,
} from "../../hooks/admin/useEventTan";

const StatusBadge = ({ status }) => {
    const styles = {
        Past: "bg-gray-100 text-gray-600",
        Canceled: "bg-red-100 text-red-600",
        Upcoming: "bg-green-100 text-green-600",
    };
    return (
        <span
            className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${styles[status] || "bg-gray-100 text-gray-800"
                }`}
        >
            {status}
        </span>
    );
};

export default function EventsTable() {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [eventToDelete, setEventToDelete] = useState(null);

    const {
        data,
        isLoading,
        isError,
        error,
        refetch,
        isFetching,
    } = useFetchEvents({
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm,
    });

    const createEventMutation = useCreateEvent();
    const updateEventMutation = useUpdateEvent();
    const deleteEventMutation = useDeleteEvent();

    const events = data?.events || [];
    const totalItems = data?.total || 0;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // Handlers

    const handleCreateNew = () => {
        setEditingEvent(null);
        setIsFormOpen(true);
    };

    const handleEdit = (event) => {
        setEditingEvent(event);
        setIsFormOpen(true);
    };

    const handleDelete = (id) => {
        setEventToDelete(id);
        setConfirmOpen(true);
    };

    const confirmDelete = async () => {
        if (!eventToDelete) return;
        try {
            await deleteEventMutation.mutateAsync(eventToDelete);
            toast.success("Event deleted successfully!");
            refetch();
        } catch (err) {
            toast.error(`Failed to delete event: ${err.message}`);
        } finally {
            setConfirmOpen(false);
            setEventToDelete(null);
        }
    };

    const handleFormSubmit = async (values, actions) => {
        try {
            


            const formData = new FormData();
            formData.append("title", values.title);
            formData.append("dateTime", values.dateTime);
            formData.append("location", values.location);
            formData.append("category", values.category);
            formData.append("description", values.description);

            if (values.coverImage && values.coverImage instanceof File) {
                formData.append("coverImage", values.coverImage);
            }

            for (const [key, value] of formData.entries()) {
            console.log(key, value);
        }

            if (editingEvent) {
                await updateEventMutation.mutateAsync({
                    id: editingEvent._id,
                    updateData: formData,
                });
                toast.success("Event updated successfully!");
            } else {
                await createEventMutation.mutateAsync(formData);
                toast.success("Event created successfully!");
            }

            setIsFormOpen(false);
            setEditingEvent(null);
            actions.resetForm();
            refetch();
        } catch (err) {
            toast.error(`Failed to submit event: ${err.message}`);
        } finally {
            actions.setSubmitting(false);
        }
    };


    const handleFormCancel = () => {
        setIsFormOpen(false);
        setEditingEvent(null);
    };

    return (
        <div className="bg-slate-50 min-h-screen font-sans">
            <div className="w-full bg-white rounded-xl shadow-lg p-5 max-w-7xl mx-auto">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                    <div className="mb-4 md:mb-0">
                        <h1 className="text-base font-semibold text-gray-800 flex items-center gap-2">
                            <CalendarDays className="w-5 h-5 text-blue-600" />
                            Events Management
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">Manage all community events</p>
                    </div>

                    <div className="flex items-center space-x-2 w-full md:w-auto">
                        <div className="relative flex-grow md:flex-grow-0">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search events by title..."
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
                                {["Event Title", "Date & Time", "Location", "Category", "Status", "Actions"].map(
                                    (header, idx) => (
                                        <th
                                            key={idx}
                                            className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${header === "Actions" ? "text-center" : "text-left"
                                                }`}
                                        >
                                            {header}
                                        </th>
                                    )
                                )}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {(isLoading || isFetching) ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-16">
                                        Loading events...
                                    </td>
                                </tr>
                            ) : isError ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-16 text-red-600">
                                        Error loading events: {error.message}
                                    </td>
                                </tr>
                            ) : events.length > 0 ? (
                                events.map((event) => (
                                    <tr key={event._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{event.title}</td>
                                        <td className="px-6 py-4 text-sm text-gray-700">{event.dateTime}</td>
                                        <td className="px-6 py-4 text-sm text-gray-700">{event.location}</td>
                                        <td className="px-6 py-4 text-sm text-gray-700">{event.category}</td>
                                        <td className="px-6 py-4 text-sm">
                                            <StatusBadge status={event.status} />
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex justify-center gap-4">
                                                <button
                                                    onClick={() => handleEdit(event)}
                                                    className="text-blue-600 hover:text-blue-800"
                                                    title="Edit"
                                                >
                                                    <Pencil size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(event._id)}
                                                    className="text-red-600 hover:text-red-800"
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
                                    <td colSpan="6" className="text-center py-16 px-4">
                                        <div className="flex flex-col items-center gap-3 max-w-sm mx-auto">
                                            <Info size={40} className="text-gray-400" />
                                            <h3 className="text-lg font-semibold text-gray-700">No Events Found</h3>
                                            <p className="text-sm text-gray-500 text-center">
                                                No events match your search. Try a different term or create one.
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {totalPages > 1 && (
                    <Pagination
                        currentPage={currentPage}
                        totalCount={totalItems}
                        itemsPerPage={itemsPerPage}
                        totalPages={totalPages}
                        onPageChange={(page) => {
                            if (page >= 1 && page <= totalPages) setCurrentPage(page);
                        }}
                        onLimitChange={(limit) => {
                            setItemsPerPage(limit);
                            setCurrentPage(1);
                        }}
                    />
                )}
            </div>

            <CreateEventForm
                isOpen={isFormOpen}
                initialData={editingEvent}
                onSubmit={handleFormSubmit}
                onClose={handleFormCancel} // <--- fixed prop name here!
                isSubmittingExternal={createEventMutation.isLoading || updateEventMutation.isLoading}
            />

            <ConfirmDialog
                open={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                onConfirm={confirmDelete}
                isLoading={deleteEventMutation.isLoading}
            />
        </div>
    );
}
