import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import useAuth from "../../../hooks/useAuth";
import toast from "react-hot-toast";
import LoadingSpinner from "../../../components/Shared/LoadingSpinner";
import ApproveModal from "../../../components/Shared/Modal/ApproveModal";
import Pagination from "../../../components/Shared/Pagination/Pagination";
import { FaEdit, FaTrash } from "react-icons/fa";
import DoneSharpIcon from "@mui/icons-material/DoneSharp";
import ClearSharpIcon from "@mui/icons-material/ClearSharp";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const AllStudySessions = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedSession, setSelectedSession] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const navigate = useNavigate();

  // Ensure only admins can access this component
  if (!user || user?.role !== "Admin") {
    return <div className="text-red-500">Access Denied! Admins only.</div>;
  }

  const adminEmail = user?.email;
  const apiUrl = useMemo(() => {
    if (!adminEmail) return null;
    return `${
      import.meta.env.VITE_API_URL
    }/manage-sessions?adminEmail=${encodeURIComponent(
      adminEmail
    )}&status=approved,rejected,pending`;
  }, [adminEmail]);

  const {
    data: sessions = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["adminStudySessions", adminEmail],
    queryFn: async () => {
      if (!apiUrl) return [];
      const response = await axios.get(apiUrl);
      return response.data;
    },
    enabled: !!adminEmail,
  });

  const approveSession = useMutation({
    mutationFn: async ({ sessionId, isPaid, amount }) => {
      const payload = {
        isPaid,
        amount: isPaid ? parseFloat(amount) : 0, // Convert amount to a number
      };

      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/session-approve/${sessionId}`,
        payload
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("Session approved successfully!");
      queryClient.invalidateQueries(["adminStudySessions"]);
    },
    onError: (err) => {
      toast.error(
        `Failed to approve session: ${
          err.response?.data?.message || err.message
        }`
      );
    },
  });

  const rejectSession = useMutation({
    mutationFn: async (sessionId) => {
      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/reject-session/${sessionId}`
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("Session rejected successfully!");
      queryClient.invalidateQueries(["adminStudySessions"]);
    },
    onError: (err) => {
      toast.error(`Failed to reject session: ${err.message}`);
    },
  });

  const deleteSession = useMutation({
    mutationFn: async (sessionId) => {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/delete-session/${sessionId}`
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("Session deleted successfully!");
      queryClient.invalidateQueries(["adminStudySessions"]);
    },
    onError: (err) => {
      toast.error(`Failed to delete session: ${err.message}`);
    },
  });

  if (isLoading) return <LoadingSpinner />;
  if (isError)
    return <div className="text-red-500">Error: {error.message}</div>;

  const filteredSessions = sessions.filter((session) =>
    session.sessionTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedSessions = filteredSessions.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleUpdate = (sessionId) => {
    navigate(`/dashboard/update-study-session/${sessionId}`);
  };

  return (
    <div
      data-aos="fade-up"
      data-aos-anchor-placement="center-center"
      className="max-w-6xl mx-auto p-4 sm:p-6"
    >
      <Helmet>
        <title>Session Sync | Manage All Sessions</title>
      </Helmet>
      <h1 className="text-3xl text-center md:text-start font-bold mt-10 mb-5 text-blue-500">
        Manage Study Sessions
      </h1>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search by title..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full md:w-1/2 mt-1 block focus:outline-none bg-base-300 dark:bg-slate-300 dark:text-black border-none rounded-sm"
      />

      {/* Responsive Table */}
      <div className="overflow-x-auto shadow-md rounded-sm mt-5">
        <table className="min-w-full table-auto">
          <thead className="bg-gradient-to-r from-blue-300 via-white to-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-blue-600">
                Title
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-blue-600">
                Description
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-blue-600">
                Status
              </th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-blue-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
            {paginatedSessions.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-4 text-gray-600">
                  No study sessions found.
                </td>
              </tr>
            ) : (
              paginatedSessions.map((session) => (
                <tr key={session._id}>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-slate-300">
                    {session.sessionTitle}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 truncate max-w-xs dark:text-slate-400">
                    {session.sessionDescription}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`px-3 pb-1 rounded-sm text-xs font-semibold ${
                        session.status === "approved"
                          ? "bg-green-100 text-green-700"
                          : session.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {session.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-center">
                    {session.status === "pending" ? (
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => setSelectedSession(session)}
                          className="flex items-center gap-1 bg-green-500 text-white px-3 py-1 rounded-sm hover:bg-green-600"
                        >
                          <DoneSharpIcon fontSize="small" />
                          Approve
                        </button>
                        <button
                          onClick={() => rejectSession.mutate(session._id)}
                          className="flex items-center gap-1 bg-yellow-500 text-white px-3 py-1 rounded-sm hover:bg-yellow-600"
                        >
                          <ClearSharpIcon fontSize="small" />
                          Reject
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => handleUpdate(session._id)}
                          className="flex items-center gap-1 bg-blue-500 text-white px-3 py-1 rounded-sm hover:bg-blue-600"
                        >
                          <FaEdit />
                          Update
                        </button>
                        <button
                          onClick={() => deleteSession.mutate(session._id)}
                          className="flex items-center gap-1 bg-red-500 text-white px-3 py-1 rounded-sm hover:bg-red-600"
                        >
                          <FaTrash />
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-6 dark:text-gray-900">
        <Pagination
          totalItems={filteredSessions.length}
          pageSize={pageSize}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Approve Modal */}
      {selectedSession && (
        <ApproveModal
          session={selectedSession}
          onClose={() => setSelectedSession(null)}
          onApprove={approveSession.mutate}
        />
      )}
    </div>
  );
};

export default AllStudySessions;
