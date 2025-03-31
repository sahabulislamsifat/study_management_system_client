import { useState, useRef } from "react";
import { FaUpload } from "react-icons/fa";
import Swal from "sweetalert2";
import useImageUpload from "../../../hooks/useImageUpload";
import axios from "axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";
import { GrPowerCycle } from "react-icons/gr";
import LoadingSpinner from "../../../components/Shared/LoadingSpinner";
import { Helmet } from "react-helmet-async";

const UploadMaterial = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedSession, setSelectedSession] = useState("");
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const fileInputRef = useRef(null);

  // Use the custom hook for image upload
  const { isUploading, error: imageError, uploadImage } = useImageUpload();

  // Fetch approved sessions for the logged-in tutor
  const {
    data: sessions = [],
    isPending,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["approvedSessions"],
    queryFn: async () => {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/select-study-sessions?tutorEmail=${
          user?.email
        }&status=approved`
      );
      return res.json();
    },
  });

  if (isPending || isLoading) return <LoadingSpinner />;
  if (isError)
    return (
      <div className="text-red-500">
        Error fetching sessions. Please try again.
      </div>
    );

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if selected session is approved
    const session = sessions.find((s) => s._id === selectedSession);
    if (!session || session.status !== "approved") {
      Swal.fire({
        icon: "error",
        title: "Unauthorized",
        text: "You can only upload materials for approved sessions.",
      });
      return;
    }

    if (!title || (!imageFile && !link.trim())) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Please upload an image or provide a Google Drive link.",
      });
      return;
    }

    try {
      let imageUrl = imageFile ? await uploadImage(imageFile) : "";

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/upload-material`,
        {
          title,
          image: imageUrl,
          link,
          sessionId: selectedSession,
          tutorEmail: user?.email,
        }
      );

      if (res.status === 201) {
        Swal.fire({
          icon: "success",
          title: "Material Uploaded!",
          text: "Your study material has been successfully uploaded.",
        });

        // Reset form
        setTitle("");
        setImageFile(null);
        setLink("");
        setSelectedSession("");
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }

        // Refresh uploaded materials
        queryClient.invalidateQueries(["uploadedMaterials"]);
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Upload Failed",
        text: imageError || "An error occurred while uploading the material.",
      });
    }
  };

  return (
    <div
      data-aos="zoom-in"
      className="lg:mt-3 mt-16 max-w-3xl mx-auto p-6 rounded-sm shadow-sm"
    >
      <Helmet>
        <title>Session Sync | Upload Material</title>
      </Helmet>
      <h1 className="text-3xl text-center md:text-start font-bold mt-10 mb-5 text-blue-500">
        Upload Study Material
      </h1>

      {sessions.length === 0 && (
        <p className="text-red-500">You have no approved sessions yet.</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Session Selection */}
        <div>
          <label className="block dark:text-slate-300 font-medium mb-2">
            Select Study Session
          </label>
          <select
            value={selectedSession}
            onChange={(e) => setSelectedSession(e.target.value)}
            className="mt-1 block w-full focus:outline-none bg-base-300 dark:bg-slate-300 dark:text-black border-none rounded-sm"
            required
          >
            <option value="">Choose a session</option>
            {sessions.map((session) => (
              <option key={session._id} value={session?._id}>
                {session?.sessionTitle}
              </option>
            ))}
          </select>
        </div>

        {/* Title */}
        <div>
          <label className="block dark:text-slate-300 font-medium mb-22">
            Material Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full focus:outline-none bg-base-300 dark:bg-slate-300 dark:text-black border-none rounded-sm"
            placeholder="Enter material title"
            required
          />
        </div>

        {/* Tutor Email */}
        <div>
          <label className="block dark:text-slate-300 font-medium mb-22">
            Tutor Email
          </label>
          <input
            type="email"
            value={user?.email}
            readOnly
            className="mt-1 block w-full focus:outline-none bg-base-300 dark:bg-slate-300 dark:text-black border-none rounded-sm600"
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="block dark:text-slate-300 font-medium mb-22">
            Upload Image
          </label>
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => setImageFile(e.target.files[0])}
            className="mt-1 block w-full focus:outline-none bg-base-300 dark:bg-slate-300 dark:text-black border-none rounded-sm600"
            accept="image/*"
          />
          {imageFile && (
            <div className="mt-2">
              <img
                src={URL.createObjectURL(imageFile)}
                alt="Preview"
                className="w-32 h-32 object-cover rounded"
              />
            </div>
          )}
        </div>

        {/* Google Drive Link */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Google Drive Link
          </label>
          <input
            type="url"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            className="mt-1 block w-full focus:outline-none bg-base-300 dark:bg-slate-300 dark:text-black border-none rounded-sm"
            placeholder="Enter Google Drive link"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isUploading || isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          <FaUpload />
          {isUploading ? (
            <span>
              <GrPowerCycle className="animate-spin" />
            </span>
          ) : (
            "Upload Material"
          )}
        </button>
      </form>
    </div>
  );
};

export default UploadMaterial;
