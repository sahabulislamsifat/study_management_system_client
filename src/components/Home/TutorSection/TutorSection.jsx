import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import LoadingSpinner from "../../Shared/LoadingSpinner";

const TutorSection = () => {
  // Fetch all tutors
  const {
    data: tutors,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["tutors"],
    queryFn: async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/get-tutors`
      );
      // console.log(response.data);

      return response?.data;
    },
  });

  if (isLoading) return <LoadingSpinner />;

  if (isError)
    return (
      <div className="text-center p-6">
        <p className="text-red-500 mb-4">
          Error fetching tutors. Please try again.
        </p>
        <button
          onClick={refetch}
          className="py-2 px-12 bg-blue-500 text-white rounded-sm hover:bg-blue-600 transition-colors"
        >
          Retry
        </button>
      </div>
    );

  return (
    <div
      data-aos="fade-up"
      data-aos-anchor-placement="top-bottom"
      className="py-6"
    >
      {/* Tutors List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tutors?.map((tutor) => (
          <div
            key={tutor?._id}
            className="border dark:border-slate-800 p-4 rounded-sm hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => handleTutorClick(tutor)}
          >
            <div className="flex items-center space-x-4">
              {/* Tutor Profile Picture */}
              <img
                src={tutor?.image}
                alt={tutor?.name}
                className="w-16 h-16 rounded-full object-cover"
              />

              {/* Tutor Details */}
              <div>
                <h3 className="text-lg font-semibold">{tutor?.name}</h3>
                <p className="text-sm text-gray-600 dark:text-slate-400">
                  {tutor?.email}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TutorSection;
