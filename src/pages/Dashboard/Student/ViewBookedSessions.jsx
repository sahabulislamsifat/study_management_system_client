import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import useAuth from "../../../hooks/useAuth";
import LoadingSpinner from "../../../components/Shared/LoadingSpinner";
import toast from "react-hot-toast";
import { Helmet } from "react-helmet-async";

const ViewBookedSessions = () => {
  const { user } = useAuth();
  const [selectedSession, setSelectedSession] = useState(null);
  const [reviews, setReviews] = useState([]);

  // Fetch booked sessions for the logged-in student
  const {
    data: bookedSessions,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["bookedSessions", user?.email],
    queryFn: async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/get-booked-sessions?studentEmail=${
          user?.email
        }`
      );
      return response.data;
    },
  });

  // Fetch session details for the selected session
  const {
    data: sessionDetails,
    isLoading: isSessionLoading,
    isError: isSessionError,
  } = useQuery({
    queryKey: ["sessionDetails", selectedSession],
    queryFn: async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/session-details/${selectedSession}`
      );
      return response.data;
    },
    enabled: !!selectedSession, // Only fetch if a session is selected
  });

  // Handle posting a review
  const handlePostReview = async (sessionId, reviewData) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/post-review`,
        {
          sessionId,
          studentEmail: user?.email,
          ...reviewData,
        }
      );

      if (response.data.success) {
        toast.success("Your review has been submitted successfully.");
      }
    } catch (error) {
      console.error("Error posting review:", error);
      toast.error("An error occurred while posting your review.");
    }
  };

  // Fetch reviews for the session
  useEffect(() => {
    if (sessionDetails) {
      axios
        .get(
          `${import.meta.env.VITE_API_URL}/get-reviews?sessionId=${
            sessionDetails._id
          }`
        )
        .then((response) => setReviews(response.data))
        .catch((error) => console.error("Error fetching reviews:", error));
    }
  }, [sessionDetails]);

  if (isLoading) return <LoadingSpinner></LoadingSpinner>;
  if (isError) return <div>Error fetching booked sessions.</div>;
  if (isSessionLoading) return <LoadingSpinner></LoadingSpinner>;
  if (isSessionError) return <div>Error fetching booked sessions details.</div>;

  return (
    <div className="px-4 max-w-5xl mx-auto pt-16 shadow-sm rounded">
      <Helmet>
        <title>Session Sync | Booked Sessions</title>
      </Helmet>
      <h1 className="text-3xl font-bold text-center md:text-start mb-6 text-blue-500">
        Booked Sessions
      </h1>

      {/* Booked Sessions Table */}
      <div className="overflow-x-auto rounded-sm shadow-sm">
        <table className="min-w-full table-auto">
          {/* Table Header */}
          <thead className="bg-gradient-to-r from-blue-300 via-white to-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">
                Session Title
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">
                Tutor
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">
                Fee
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">
                Booked On
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody
            data-aos="fade-down"
            className="divide-y divide-gray-100 dark:divide-slate-500"
          >
            {bookedSessions?.map((session) => (
              <tr key={session?._id}>
                {/* Session Title */}
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700 dark:text-slate-300">
                  {session?.sessionTitle}
                </td>

                {/* Tutor Email */}
                <td className="px-6 dark:text-slate-300 py-4 whitespace-nowrap text-sm text-gray-600">
                  {session?.tutorEmail}
                </td>

                {/* Registration Fee */}
                <td className="px-6 py-4 whitespace-nowrap dark:text-slate-300 text-sm text-gray-600">
                  {session.registrationFee > 0 ? (
                    <span>${session?.registrationFee}</span>
                  ) : (
                    "Free"
                  )}
                </td>

                {/* Booked On */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-slate-300">
                  {new Date(session?.bookedAt).toLocaleDateString()}
                </td>

                {/* Actions */}
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button
                    onClick={() => setSelectedSession(session?.sessionId)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-sm border-none btn btn-sm hover:bg-blue-600 transition-colors outline-none dark:text-slate-100"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Session Details Modal */}
      {selectedSession && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 p-6 rounded max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold mb-4">
              {sessionDetails?.sessionTitle}
            </h3>
            <p className="text-gray-600 mb-4 dark:text-slate-300">
              <span className="font-semibold ">Tutor:</span>{" "}
              {sessionDetails?.tutorName}
            </p>
            <p className="text-gray-600 mb-4 dark:text-slate-300">
              <span className="font-semibold">Description:</span>{" "}
              {sessionDetails?.sessionDescription}
            </p>

            {/* Registration Dates */}
            <div className="mb-4 dark:text-slate-300">
              <h4 className="text-xl font-semibold mb-2">Registration Dates</h4>
              <p className="text-gray-600 dark:text-slate-300">
                <span className="font-semibold">Start:</span>{" "}
                {new Date(
                  sessionDetails?.registrationStartDate
                ).toLocaleDateString()}
              </p>
              <p className="text-gray-600 dark:text-slate-300">
                <span className="font-semibold">End:</span>{" "}
                {new Date(
                  sessionDetails?.registrationEndDate
                ).toLocaleDateString()}
              </p>
            </div>

            {/* Class Dates */}
            <div className="mb-4 dark:text-slate-300">
              <h4 className="text-xl font-semibold mb-2">Class Dates</h4>
              <p className="text-gray-600 dark:text-slate-300">
                <span className="font-semibold">Start:</span>{" "}
                {new Date(sessionDetails?.classStartDate).toLocaleDateString()}
              </p>
              <p className="text-gray-600 dark:text-slate-300">
                <span className="font-semibold">End:</span>{" "}
                {new Date(sessionDetails?.classEndDate).toLocaleDateString()}
              </p>
            </div>

            {/* Session Duration */}
            <p className="text-gray-600 dark:text-slate-300 mb-4">
              <span className="font-semibold">Duration:</span>{" "}
              {sessionDetails?.sessionDuration} Hours
            </p>
            {/* Session RegistrationFee */}
            <p className="text-gray-600 mb-4 dark:text-slate-300">
              <span className="font-semibold">Fee:</span> $
              {sessionDetails?.registrationFee > 0 ? (
                <span>{sessionDetails.registrationFee}</span>
              ) : (
                "Free"
              )}
            </p>

            {/* Post Review Form */}
            <div>
              <h4 className="text-xl font-semibold mb-2 dark:text-slate-300">
                Post a Review
              </h4>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target);
                  const reviewData = {
                    comment: formData.get("comment"),
                    rating: formData.get("rating"),
                  };
                  handlePostReview(selectedSession, reviewData);
                }}
              >
                <textarea
                  name="comment"
                  placeholder="Write your review..."
                  className="w-full dark:bg-slate-300 dark:text-black p-2 border rounded mb-2 border-slate-300"
                  required
                ></textarea>
                <input
                  type="number"
                  name="rating"
                  placeholder="Rating (1-5)"
                  min="1"
                  max="5"
                  className="w-full dark:text-black p-2 border dark:bg-slate-300 rounded mb-2 border-slate-300"
                  required
                />
                <button
                  type="submit"
                  className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  Submit Review
                </button>
              </form>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setSelectedSession(null)}
              className="w-full mt-4 py-2 px-4 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewBookedSessions;
