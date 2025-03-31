import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import LoadingSpinner from "../../../components/Shared/LoadingSpinner";

const UpdateStudySession = () => {
  const { sessionId } = useParams(); // Get session ID from URL
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch session details by ID
  const {
    data: session,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["studySession", sessionId],
    queryFn: async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/sessions/${sessionId}`
      );
      return response.data;
    },
    enabled: !!sessionId, // Only fetch if sessionId is defined
  });

  // State for form fields
  const [formData, setFormData] = useState({
    sessionTitle: "",
    sessionDescription: "",
    registrationStartDate: "",
    registrationEndDate: "",
    classStartDate: "",
    classEndDate: "",
    sessionDuration: "",
    registrationFee: 0,
  });

  // Update form data when session is fetched
  useEffect(() => {
    if (session) {
      setFormData({
        sessionTitle: session.sessionTitle,
        sessionDescription: session.sessionDescription,
        registrationStartDate: session.registrationStartDate,
        registrationEndDate: session.registrationEndDate,
        classStartDate: session.classStartDate,
        classEndDate: session.classEndDate,
        sessionDuration: session.sessionDuration,
        registrationFee: session.registrationFee,
      });
    }
  }, [session]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Mutation to update session
  const updateSession = useMutation({
    mutationFn: async (updatedData) => {
      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/update-study-session/${sessionId}`,
        updatedData
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("Session updated successfully!");
      queryClient.invalidateQueries(["studySession", sessionId]);
      navigate("/dashboard/manage_study_sessions"); // Redirect to study sessions list
    },
    onError: (error) => {
      toast.error(
        `Update failed: ${error.response?.data?.message || error.message}`
      );
    },
  });

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    updateSession.mutate(formData);
  };

  if (isLoading) return <LoadingSpinner />;
  if (isError)
    return <div className="text-red-500">Error: {error.message}</div>;

  return (
    <div
      data-aos="zoom-in"
      className="max-w-3xl mx-auto p-6 rounded-sm shadow-sm mt-5"
    >
      <h2 className="text-3xl text-center md:text-start font-bold mt-10 mb-5 text-blue-500">
        Update Study Session
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block dark:text-slate-300 font-medium mb-2">
            Session Title
          </label>
          <input
            type="text"
            name="sessionTitle"
            value={formData.sessionTitle}
            onChange={handleInputChange}
            className="mt-1 block w-full focus:outline-none bg-base-300 dark:bg-slate-300 dark:text-black border-none rounded-sm"
            required
          />
        </div>

        <div>
          <label className="block dark:text-slate-300 font-medium mb-2">
            Description
          </label>
          <textarea
            name="sessionDescription"
            value={formData.sessionDescription}
            onChange={handleInputChange}
            className="mt-1 block w-full focus:outline-none bg-base-300 dark:bg-slate-300 dark:text-black border-none rounded-sm"
            rows="4"
            required
          />
        </div>

        <div>
          <label className="block dark:text-slate-300 font-medium mb-21">
            Registration Start Date
          </label>
          <input
            type="date"
            name="registrationStartDate"
            value={formData.registrationStartDate}
            onChange={handleInputChange}
            className="mt-1 block w-full focus:outline-none bg-base-300 dark:bg-slate-300 dark:text-black border-none rounded-sm"
            required
          />
        </div>

        <div>
          <label className="block dark:text-slate-300 font-medium mb-2">
            Registration End Date
          </label>
          <input
            type="date"
            name="registrationEndDate"
            value={formData.registrationEndDate}
            onChange={handleInputChange}
            className="mt-1 block w-full focus:outline-none bg-base-300 dark:bg-slate-300 dark:text-black border-none rounded-sm"
            required
          />
        </div>

        <div>
          <label className="block dark:text-slate-300 font-medium mb-2">
            Class Start Date
          </label>
          <input
            type="date"
            name="classStartDate"
            value={formData.classStartDate}
            onChange={handleInputChange}
            className="mt-1 block w-full focus:outline-none bg-base-300 dark:bg-slate-300 dark:text-black border-none rounded-sm"
            required
          />
        </div>

        <div>
          <label className="block dark:text-slate-300 font-medium mb-2">
            Class End Date
          </label>
          <input
            type="date"
            name="classEndDate"
            value={formData.classEndDate}
            onChange={handleInputChange}
            className="mt-1 block w-full focus:outline-none bg-base-300 dark:bg-slate-300 dark:text-black border-none rounded-sm"
            required
          />
        </div>

        <div>
          <label className="block dark:text-slate-300 font-medium mb-2">
            Session Duration (in hours)
          </label>
          <input
            type="text"
            name="sessionDuration"
            value={formData.sessionDuration}
            onChange={handleInputChange}
            className="mt-1 block w-full focus:outline-none bg-base-300 dark:bg-slate-300 dark:text-black border-none rounded-sm"
            min="1"
            required
          />
        </div>

        <div>
          <label className="block dark:text-slate-300 font-medium mb-2">
            Registration Fee
          </label>
          <input
            type="number"
            name="registrationFee"
            value={formData.registrationFee}
            onChange={handleInputChange}
            className="mt-1 block w-full focus:outline-none bg-base-300 dark:bg-slate-300 dark:text-black border-none rounded-sm"
            min="0"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-sm hover:bg-blue-600"
          disabled={updateSession.isLoading}
        >
          {updateSession.isLoading ? "Updating..." : "Update Session"}
        </button>
      </form>
    </div>
  );
};

export default UpdateStudySession;
