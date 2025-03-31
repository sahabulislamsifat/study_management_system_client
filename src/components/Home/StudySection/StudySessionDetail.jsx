import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import LoadingSpinner from "../../Shared/LoadingSpinner";
import useAuth from "../../../hooks/useAuth";
import Swal from "sweetalert2";
import { IoStar } from "react-icons/io5";
import { Helmet } from "react-helmet-async";

const StudySessionDetails = () => {
  const { user } = useAuth();
  const { id } = useParams(); // Correct usage of useParams
  const navigate = useNavigate(); // For programmatic navigation
  const [userRole, setUserRole] = useState(user?.role);
  const [reviews, setReviews] = useState([]);

  // Fetch session details using TanStack Query
  const {
    data: session,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["session", id],
    queryFn: async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/session-details/${id}`
      );
      return response.data;
    },
  });

  // Fetch reviews for the session
  useEffect(() => {
    if (session) {
      axios
        .get(
          `${import.meta.env.VITE_API_URL}/get-reviews?sessionId=${session._id}`
        )
        .then((response) => setReviews(response.data))
        .catch((error) => console.error("Error fetching reviews:", error));
    }
  }, [session]);

  // Handle Book Now button click
  const handleBookNow = async (session) => {
    if (session.registrationFee > 0) {
      // Redirect to payment page for paid sessions
      navigate("/payment", {
        state: {
          sessionId: session._id,
          tutorEmail: session.tutorEmail,
          registrationFee: session.registrationFee,
        },
      });
    } else {
      // Book session immediately for free sessions
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/book-session`,
          {
            sessionId: session._id,
            sessionTitle: session.sessionTitle,
            studentEmail: user?.email,
            registrationFee: session.registrationFee,
            tutorEmail: session?.tutorEmail,
          }
        );

        if (response.data.success) {
          Swal.fire({
            icon: "success",
            title: "Session Booked!",
            text: "Your session has been booked successfully.",
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Booking Failed",
            text: response.data.message || "Failed to book the session.",
          });
        }
      } catch (error) {
        console.error("Error booking session:", error);
        Swal.fire({
          icon: "error",
          title: "Booking Failed",
          text:
            error.response?.data?.message ||
            "An error occurred while booking the session.",
        });
      }
    }
  };

  // Show loading spinner while data is being fetched
  if (isLoading) return <LoadingSpinner></LoadingSpinner>;
  if (isError) return <LoadingSpinner></LoadingSpinner>;
  if (!session) return <LoadingSpinner></LoadingSpinner>;

  // Check if registration is ongoing
  const currentDate = new Date();
  const isRegistrationOngoing =
    new Date(session.registrationStartDate) <= currentDate &&
    currentDate <= new Date(session.registrationEndDate);

  return (
    <div
      data-aos="zoom-out"
      className="container  mx-auto dark:border dark:border-slate-800 p-16  dark:text-gray-100 max-w-3xl my-16 shadow-sm"
    >
      <Helmet>
        <title>Session Sync | Session Details</title>
      </Helmet>
      {/* Session Title */}
      <h1 className="text-3xl font-bold text-gray-600 dark:text-gray-300 mb-6">
        {session.sessionTitle}
      </h1>

      {/* Tutor Name and Rating */}
      <div className="gap-5 flex items-center mb-6">
        <p className="text-gray-500 dark:text-gray-300 font-medium mr-2">
          <span className="text-gray-700 font-semibold dark:text-gray-300 text-xl">
            Tutor:
          </span>{" "}
          {session.tutorName}
        </p>
        <div className="flex">
          <IoStar className="dark:text-gray-300 text-gray-400 " />
          <p className="text-sm text-gray-400">
            {session.averageRating || "No ratings yet"}
          </p>
        </div>
      </div>

      {/* Session Description */}
      <p className="text-gray-600 mb-8 text-xl leading-relaxed dark:text-gray-300">
        {session.sessionDescription}
      </p>

      {/* Registration and Class Dates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 ">
        <div>
          <h3 className="dark:text-gray-300 text-xl font-semibold text-gray-700 mb-4">
            Registration Dates
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            <span className="font-semibold ">Start:</span>{" "}
            {new Date(session.registrationStartDate).toLocaleDateString()}
          </p>
          <p className="text-gray-600 dark:text-gray-300">
            <span className="font-semibold">End:</span>{" "}
            {new Date(session.registrationEndDate).toLocaleDateString()}
          </p>
        </div>
        <div className="p-4">
          <h3 className="text-xl dark:text-gray-300 font-semibold text-gray-700 mb-4">
            Class Dates
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            <span className="font-semibold">Start:</span>{" "}
            {new Date(session.classStartDate).toLocaleDateString()}
          </p>
          <p className="text-gray-600 dark:text-gray-300">
            <span className="font-semibold">End:</span>{" "}
            {new Date(session.classEndDate).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Session Duration and Fee */}
      <div className="mb-8 ">
        <h3 className="text-xl dark:text-gray-300 font-semibold text-gray-700 mb-4">
          Session Details
        </h3>
        <p className="text-gray-600 dark:text-gray-300">
          <span className="font-semibold">Duration:</span>{" "}
          {session.sessionDuration} Hours
        </p>
        <p className="text-gray-600 flex gap-1 dark:text-gray-300">
          <span className="font-semibold">Fee:</span>{" "}
          {session.registrationFee > 0 ? (
            `$${session.registrationFee}`
          ) : (
            <p className="text-green-700">Free</p>
          )}
        </p>
      </div>

      {/* Book Now Button */}
      <div className="text-center mb-8">
        {isRegistrationOngoing ? (
          <button
            disabled={userRole !== "Student"}
            className={`py-2 px-6 w-full ${
              userRole === "Student"
                ? "bg-blue-500 hover:bg-blue-600"
                : "bg-gray-400 cursor-not-allowed"
            } text-white font-semibold rounded transition duration-300`}
            onClick={() => handleBookNow(session)}
          >
            {userRole === "Student" ? "Book Now" : "Booking Not Allowed"}
          </button>
        ) : (
          <button
            disabled
            className="py-2 px-6 bg-red-500 text-white font-semibold rounded cursor-not-allowed w-full"
          >
            Registration Closed
          </button>
        )}
      </div>

      {/* Reviews Section */}
      <div className="my-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 dark:text-gray-300">
          Reviews
        </h2>
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div
              key={review._id}
              className="bg-base-100 shadow-sm rounded p-4 mb-4 border border-gray-100"
            >
              <p className="text-gray-700 mb-2">{review.comment}</p>
              <div className="flex gap-2">
                <IoStar className="text-gray-400" />
                <p className="text-sm text-gray-400 font-semibold">
                  {review.rating || "No ratings yet"}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-600 text-center dark:text-gray-300">
            No reviews yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default StudySessionDetails;
