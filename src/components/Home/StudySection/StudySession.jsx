import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import LoadingSpinner from "../../Shared/LoadingSpinner";
import Card from "./Card";

const StudySessions = () => {
  const {
    data: sessions,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["sessions"],
    queryFn: async () => {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/get-all-sessions`
      );
      return data;
    },
  });

  const [showAll, setShowAll] = useState(false);

  // Show loading spinner while data is being fetched
  if (isLoading) return <LoadingSpinner />;
  if (isError) return <div>Error fetching study sessions.</div>;

  if (!sessions || !Array.isArray(sessions) || sessions.length === 0) {
    return <div>No study sessions available.</div>;
  }

  const displayedSessions = showAll ? sessions : sessions.slice(0, 6);

  return (
    <div>
      <h1 className="text-center text-3xl my-10 font-bold text-gray-700 dark:text-blue-600">
        Study Session
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-5">
        {displayedSessions.map((session) => (
          <Card key={session._id} session={session} />
        ))}
      </div>

      {/* "See More btn */}
      {sessions.length > 6 && !showAll && (
        <div className="text-center justify-end flex mx-5 cursor-pointer mt-1">
          <p
            className="text-blue-500 font-medium hover:text-blue-600"
            onClick={() => setShowAll(true)}
          >
            See More...
          </p>
        </div>
      )}
    </div>
  );
};

export default StudySessions;
