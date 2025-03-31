import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import useAuth from "../../../hooks/useAuth";
import toast from "react-hot-toast";
import LoadingSpinner from "../../../components/Shared/LoadingSpinner";
import { useMemo } from "react";
import { Helmet } from "react-helmet-async";

const ViewAllStudySessions = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch Tutor's Approved & Rejected Study Sessions
  const tutorEmail = user?.email;
  const apiUrl = useMemo(() => {
    if (!tutorEmail) return null;
    return `${
      import.meta.env.VITE_API_URL
    }/get-tutor-sessions?tutorEmail=${encodeURIComponent(
      tutorEmail
    )}&status=approved,rejected`; // Fetch only approved & rejected sessions
  }, [tutorEmail]);

  const {
    data: sessions = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["tutorStudySessions", tutorEmail],
    queryFn: async () => {
      if (!apiUrl) return [];
      const response = await axios.get(apiUrl);
      return response.data;
    },
    enabled: !!tutorEmail,
  });

  // Mutation to send "Re-Request Approval"
  const reRequestApproval = useMutation({
    mutationFn: async (sessionId) => {
      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/re-request-approval/${sessionId}`
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("Approval request sent!");
      queryClient.invalidateQueries(["tutorStudySessions"]); // Refresh data
    },
    onError: () => {
      toast.error("Failed to send approval request!");
    },
  });

  if (isLoading) return <LoadingSpinner />;
  if (isError)
    return <div className="text-red-500">Error: {error.message}</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <Helmet>
        <title>Session Sync | View All Sessions</title>
      </Helmet>
      <h1 className="text-3xl font-bold text-center md:text-start mb-6 mt-10 text-blue-500">
        My Study Sessions
      </h1>

      {/* Sessions Table */}
      <div className="overflow-x-auto rounded-sm shadow-sm border border-gray-100 dark:border-slate-500">
        <table className="min-w-full table-auto">
          <thead className="bg-gradient-to-r from-blue-300 via-white to-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody
            data-aos="fade-down"
            className="divide-y divide-gray-100 dark:divide-slate-600"
          >
            {sessions.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                  No study sessions found.
                </td>
              </tr>
            ) : (
              sessions.map((session) => (
                <tr
                  key={session._id}
                  className="transition-colors"
                >
                  {/* Session Title */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700 dark:text-slate-300">
                    {session.sessionTitle}
                  </td>

                  {/* Session Description */}
                  <td className="px-6 dark:text-slate-300 py-4 whitespace-nowrap text-sm text-gray-600">
                    {session.sessionDescription.substring(0, 100)}...
                  </td>

                  {/* Session Status */}
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-3 pb-1 rounded-sm text-xs font-semibold ${
                        session.status === "approved"
                          ? "bg-lime-100 text-green-700"
                          : session.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-200 text-red-800"
                      }`}
                    >
                      {session.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-sm">
                    {session.status === "rejected" && (
                      <button
                        onClick={() => reRequestApproval.mutate(session._id)}
                        disabled={reRequestApproval.isLoading}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                      >
                        {reRequestApproval.isLoading
                          ? "Sending Request..."
                          : "Re-Request Approval"}
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewAllStudySessions;
