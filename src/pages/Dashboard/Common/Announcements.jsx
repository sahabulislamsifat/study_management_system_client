import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import LoadingSpinner from "../../../components/Shared/LoadingSpinner";
import useAuth from "../../../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
import { IoCreateSharp } from "react-icons/io5";

// Admin Announcement Creation Form
export const CreateAnnouncement = () => {
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset } = useForm();
  const navigate = useNavigate();

  const createMutation = useMutation({
    mutationFn: async (newAnnouncement) => {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/create-announcement`,
        newAnnouncement
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("Announcement created successfully!");
      reset();
      queryClient.invalidateQueries(["announcements"]);
      navigate("/dashboard");
    },
    onError: (error) => {
      toast.error(`Failed to create announcement: ${error.message}`);
    },
  });

  const onSubmit = (data) => {
    createMutation.mutate(data);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-blue-600">
        Create New Announcement
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Title</label>
          <input
            {...register("title", { required: true })}
            className="mt-1 block border-none w-full rounded-sm bg-base-300 text-gray-600 p-2 dark:bg-slate-300"
            placeholder="Enter announcement title"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Description</label>
          <textarea
            {...register("description", { required: true })}
            className="mt-1 block border-none w-full rounded-sm bg-base-300 text-gray-600 h-32 dark:bg-slate-300"
            placeholder="Enter announcement details"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-sm hover:bg-blue-600"
          disabled={createMutation.isLoading}
        >
          {createMutation.isLoading ? "Publishing..." : "Publish Announcement"}
        </button>
      </form>
    </div>
  );
};

export const AnnouncementsList = () => {
  const { user } = useAuth(); // Get user info
  const isAdmin = user?.role === "Admin"; // Check if the user is an admin

  const {
    data: announcements,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["announcements"],
    queryFn: async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/public-announcements`
      );
      return response.data;
    },
  });

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <div>Error: {error.message}</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-center text-3xl mt-12 font-bold text-gray-700 dark:text-blue-500">
          Latest Announcements
        </h1>

        {/* Show button only if the user is an admin */}
        {isAdmin && (
          <Link
            to="/dashboard/create-announcement"
            className="flex justify-center items-center gap-1 bg-blue-500 text-white px-3 py-1 rounded-sm hover:bg-blue-600 transition"
          >
            <IoCreateSharp />
            Create
          </Link>
        )}
      </div>

      <div className="space-y-6">
        {announcements?.map((announcement) => (
          <div
            key={announcement._id}
            className="bg-white p-6 rounded-sm shadow-sm hover:shadow-md transition-shadow dark:bg-gray-900 dark:text-slate-200 dark:border-slate-600 dark:border"
          >
            <h3 className="text-xl dark:text-slate-300 font-semibold mb-2 text-blue-600">
              {announcement.title}
            </h3>
            <p className="text-gray-600 mb-4 dark:text-slate-400">
              {announcement.description}
            </p>
            <p className="text-sm text-gray-500 dark:text-slate-400">
              Posted on: {new Date(announcement.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
