import React from "react";
import { Link } from "react-router-dom";

const Card = ({ session }) => {
  // Check if session data is available
  if (!session) {
    return (
      <div className="bg-white shadow-md rounded-lg p-5">
        <p className="text-gray-600">No session data available.</p>
      </div>
    );
  }

  // Destructure session data with default values
  const {
    _id,
    sessionTitle = "No Title",
    sessionDescription = "No description available.",
    registrationStartDate,
    registrationEndDate,
  } = session;

  // console.log(session);

  // Calculate if the session is ongoing
  const currentDate = new Date();
  const isOngoing =
    new Date(registrationStartDate) <= currentDate &&
    currentDate <= new Date(registrationEndDate);

  return (
    <div
      data-aos="fade-up"
      className="shadow-sm rounded-sm p-5 hover:shadow-md transition-transform transform border dark:border-slate-800 dark:bg-gray-900"
    >
      {/* Session Title */}
      <h2 className="text-xl md:text-[22px] font-bold text-gray-700 dark:text-gray-300 mb-2">
        {sessionTitle}
      </h2>

      {/* Session Description */}
      <p className="text-gray-600 mb-4 dark:text-gray-400">
        {sessionDescription.length > 100
          ? `${sessionDescription.substring(0, 100)}...` // Truncate long descriptions
          : sessionDescription}
      </p>

      {/* Registration Status and Read More Button */}
      <div className="flex justify-between items-center">
        {/* Ongoing/Closed Button */}
        <button
          className={`py-1 px-3 text-sm font-semibold rounded ${
            isOngoing
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {isOngoing ? "Ongoing" : "Closed"}
        </button>

        {/* Read More Button */}
        <Link
          to={`/session_detail/${_id}`} // Link to session details page
          className="py-1 px-4 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 transition dark:text-gray-200"
        >
          Read More
        </Link>
      </div>
    </div>
  );
};

export default Card;
