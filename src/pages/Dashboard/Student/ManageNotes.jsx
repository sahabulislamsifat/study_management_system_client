import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-hot-toast";
import useAuth from "../../../hooks/useAuth";
import LoadingSpinner from "../../../components/Shared/LoadingSpinner";
import Swal from "sweetalert2";
import { Helmet } from "react-helmet-async";

const ManageNotes = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const studentEmail = user?.email;

  // Fetch notes for the logged-in student
  const {
    data: notes,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["notes", user?.email],
    queryFn: async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/get-notes?studentEmail=${studentEmail}`
      );
      return response.data;
    },
  });

  // Mutation to delete a note
  const deleteNoteMutation = useMutation({
    mutationFn: (noteId) =>
      axios.delete(`${import.meta.env.VITE_API_URL}/delete-note/${noteId}`), // Corrected URL
    onSuccess: () => {
      toast.success("Note deleted successfully!");
      queryClient.invalidateQueries(["notes", studentEmail]); // Refresh notes list
    },
    onError: () => {
      toast.error("Error deleting note. Please try again.");
    },
  });

  // Handle note deletion with confirmation modal
  const handleDelete = (noteId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteNoteMutation.mutate(noteId);
      }
    });
  };

  // State for editing a note
  const [editingNote, setEditingNote] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  // Handle edit button click
  const handleEditClick = (note) => {
    setEditingNote(note._id);
    setEditTitle(note.title);
    setEditDescription(note.description);
  };

  // Mutation to update a note
  const updateNoteMutation = useMutation({
    mutationFn: (updatedNote) =>
      axios.put(
        `${import.meta.env.VITE_API_URL}/update-note/${updatedNote._id}`,
        { title: updatedNote.title, description: updatedNote.description } // Ensure correct request body
      ),
    onSuccess: () => {
      toast.success("Note updated successfully!");
      setEditingNote(null);
      queryClient.invalidateQueries(["notes", studentEmail]); // Refresh notes
    },
    onError: () => {
      toast.error("Error updating note. Please try again.");
    },
  });

  // Handle note update
  const handleUpdate = (noteId) => {
    if (!editTitle || !editDescription) {
      toast.error("Please fill in all fields.");
      return;
    }

    const updatedNote = {
      _id: noteId,
      title: editTitle,
      description: editDescription,
    };

    updateNoteMutation.mutate(updatedNote);
  };

  if (isLoading) return <LoadingSpinner></LoadingSpinner>;
  if (isError) return <div>{error}</div>;

  return (
    <div className="container mx-auto p-6 my-10 max-w-4xl ">
      <Helmet>
        <title>Session Sync | Manage Personal Notes</title>
      </Helmet>
      <h1 className="text-3xl md:text-start text-center font-bold text-blue-500 mb-6">
        Manage Your Notes
      </h1>

      {notes?.length === 0 ? (
        <p className="text-gray-600 text-center">No notes found.</p>
      ) : (
        <div
          data-aos="fade-up"
          data-aos-anchor-placement="center-center"
          className="space-y-6"
        >
          {notes?.map((note) => (
            <div
              key={note._id}
              className="bg-gray-50 p-6 rounded dark:bg-slate-900 dark:border-slate-600 border border-gray-100 hover:shadow-md transition-shadow"
            >
              {editingNote === note._id ? (
                // Edit Mode
                <div>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    placeholder="Enter note title"
                    className="dark:bg-slate-300 focus:none w-full px-4 py-2 border border-slate-300 rounded-sm mb-4 dark:text-black"
                    required
                  />
                  <textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    placeholder="Enter note description"
                    rows="4"
                    className="dark:bg-slate-300 focus:none w-full px-4 py-2 border border-slate-300 rounded-sm mb-4 dark:text-black"
                    required
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdate(note._id)}
                      className="py-1 px-4 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition duration-300"
                      disabled={updateNoteMutation.isLoading}
                    >
                      {updateNoteMutation.isLoading ? "Saving..." : "Save"}
                    </button>
                    <button
                      onClick={() => setEditingNote(null)}
                      className="py-1 px-4 bg-gray-500 text-white font-semibold rounded hover:bg-gray-600 transition duration-300"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                // View Mode
                <div>
                  <h3 className="md:text-2xl text-xl dark:text-slate-300 font-semibold text-gray-800 mb-2">
                    {note.title}
                  </h3>
                  <p className="text-gray-700 mb-4 dark:text-slate-400">
                    {note.description}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditClick(note)}
                      className="py-1 px-4 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 transition duration-300"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(note._id)}
                      className="py-1 px-4 bg-red-500 text-white font-semibold rounded hover:bg-red-600 transition duration-300"
                      disabled={deleteNoteMutation.isLoading}
                    >
                      {deleteNoteMutation.isLoading ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageNotes;
