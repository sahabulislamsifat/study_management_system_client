import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState, useEffect } from "react";
import LoadingSpinner from "../../../components/Shared/LoadingSpinner";
import useAuth from "../../../hooks/useAuth";
import { toast } from "react-hot-toast";
import { FaDownload, FaExternalLinkAlt } from "react-icons/fa";
import Modal from "../../../components/Shared/Modal/PaymentModal";
import { Helmet } from "react-helmet-async";

const ViewAllStudyMaterials = () => {
  const { user } = useAuth();
  const [selectedSessionId, setSelectedSessionId] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  // Fetch booked sessions
  const { data: bookedSessions = [], isLoading: isBookedSessionsLoading } =
    useQuery({
      queryKey: ["bookedSessions", user?.email],
      queryFn: async () => {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/get-booked-sessions?studentEmail=${
            user?.email
          }`
        );
        return response.data;
      },
      enabled: !!user?.email,
    });

  // Fetch study materials
  const { data: materials = [], isLoading: isMaterialsLoading } = useQuery({
    queryKey: ["studyMaterials", selectedSessionId],
    queryFn: async () => {
      if (!selectedSessionId) return [];
      const response = await axios.get(
        `${
          import.meta.env.VITE_API_URL
        }/materials?sessionId=${selectedSessionId}`
      );
      return response.data;
    },
    enabled: !!selectedSessionId,
  });

  // Handle Image Download
  const handleDownload = async (imageUrl) => {
    try {
      const response = await axios.get(imageUrl, { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "study-material.jpg");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Image downloaded successfully!");
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Failed to download image.");
    }
  };

  if (isBookedSessionsLoading || isMaterialsLoading) return <LoadingSpinner />;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <Helmet>
        <title>Session Sync | View Study Materials</title>
      </Helmet>
      <h1 className="text-3xl text-center md:text-start font-bold mb-6 mt-10 text-blue-500">
        View Study Materials
      </h1>

      {/* Booked Sessions Dropdown */}
      <div
        data-aos="fade-right"
        data-aos-anchor="#example-anchor"
        data-aos-offset="500"
        data-aos-duration="500"
        className="mb-5 "
      >
        <label className="block dark:text-slate-300 font-medium mb-2">
          Select a Booked Session
        </label>
        <select
          value={selectedSessionId}
          onChange={(e) => setSelectedSessionId(e.target.value)}
          className="w-full text-center md:text-start mb-4 px-4 py-2 border dark:bg-slate-300 dark:text-black border-gray-300 rounded-sm"
        >
          <option value="">Choose a session</option>
          {bookedSessions.map((session) => (
            <option key={session._id} value={session?.sessionId}>
              {session?.sessionTitle} - {session?.tutorName}
            </option>
          ))}
        </select>
      </div>

      {/* Study Materials */}
      {selectedSessionId && (
        <div>
          <h3 className="text-xl dark:text-slate-300 font-semibold mb-4">
            Study Materials
          </h3>
          {materials.length === 0 ? (
            <p className="text-gray-600">
              No materials found for this session.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-0">
              {materials.map((material) => (
                <div
                  key={material._id}
                  className="py-6 px-6 w-80 border border-gray-300 rounded dark:border-slate-500 shadow-md hover:shadow-lg transition-shadow"
                >
                  <h1 className="text-2xl font-semibold mb-2 dark:text-slate-300">
                    {material?.title}
                  </h1>

                  {material?.image ? (
                    <div className="mt-4">
                      <img
                        src={material?.image}
                        alt={material?.title}
                        className="w-full h-48 object-cover rounded-lg cursor-pointer"
                        onClick={() => setSelectedImage(material?.image)}
                      />
                      <button
                        onClick={() => handleDownload(material?.image)}
                        className="mt-2 flex items-center gap-2 text-blue-500 hover:text-blue-600"
                      >
                        <FaDownload /> Download Image
                      </button>
                    </div>
                  ) : (
                    <p className="text-gray-500">No image available</p>
                  )}

                  {material?.link && (
                    <div className="mt-4">
                      <a
                        href={material?.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-green-500 hover:text-green-600"
                      >
                        <FaExternalLinkAlt /> Open Resource
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Image Preview Modal */}
      <Modal
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        title="Image Preview"
      >
        <img
          src={selectedImage}
          alt="Preview"
          className="w-full h-auto rounded-lg"
        />
      </Modal>
    </div>
  );
};

export default ViewAllStudyMaterials;
