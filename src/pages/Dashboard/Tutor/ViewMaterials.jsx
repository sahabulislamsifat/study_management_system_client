import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { FaDownload, FaExternalLinkAlt, FaEdit, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import axios from "axios";
import useAuth from "../../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../../../components/Shared/LoadingSpinner";
import { Helmet } from "react-helmet-async";

const ViewMaterials = () => {
  const { user } = useAuth();
  const userRole = user?.role;
  const queryClient = useQueryClient();

  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const navigate = useNavigate();

  // Fetch all materials for tutor
  const { data: sessions = [], isLoading } = useQuery({
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

  // Fetch single material when session is selected
  const { data: selectedData } = useQuery({
    queryKey: ["data", selectedSessionId],
    queryFn: async () => {
      const res = await axios.get(
        `${
          import.meta.env.VITE_API_URL
        }/sessionId-material?id=${selectedSessionId}`
      );

      return res.data;
    },
    enabled: !!selectedSessionId,
  });

  // Handle material deletion
  const handleDelete = async (materialId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        // Optimistic UI Update
        queryClient.setQueryData(["materials"], (oldData) =>
          oldData?.filter((material) => material._id !== materialId)
        );

        try {
          const res = await axios.delete(
            `${import.meta.env.VITE_API_URL}/delete-material/${materialId}`
          );

          if (res.status === 200) {
            Swal.fire({
              icon: "success",
              title: "Deleted!",
              text: "The material has been deleted.",
            });

            // Force UI Refresh after deletion
            queryClient.invalidateQueries(["materials"]);
          }
        } catch (error) {
          console.error("Deletion failed:", error);
          Swal.fire({
            icon: "error",
            title: "Error!",
            text: "Failed to delete material. Try again later.",
          });

          // Revert UI Update if deletion fails
          queryClient.invalidateQueries(["materials"]);
        }
      }
    });
  };

  // Handle material update (redirect to update page)
  const handleUpdate = (materialId) => {
    // console.log("Update material:", materialId);
    navigate(`/dashboard/update-material/${materialId}`); // Redirect with ID
  };

  // Handle image download
  const handleDownload = async (imageUrl) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "study-material.jpg";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Blob URL
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading the image:", error);
    }
  };

  if (isLoading) return <LoadingSpinner></LoadingSpinner>;

  return (
    <div className="p-4">
      <Helmet>
        <title>Session Sync | View All Materials</title>
      </Helmet>
      <h1 className="text-3xl text-center md:text-start font-bold mb-6 mt-10 text-blue-500">
        Study Materials
      </h1>

      {/* Session Selection */}
      <div
        data-aos="fade-left"
        data-aos-anchor="#example-anchor"
        data-aos-offset="500"
        data-aos-duration="500"
        className="mb-6"
      >
        <label className="block dark:text-slate-300 font-medium mb-2">
          Select a Study Session
        </label>
        <select
          onChange={(e) => setSelectedSessionId(e.target.value)}
          className="w-full text-center md:text-start mb-4 px-4 py-2 border dark:bg-slate-300 dark:text-black border-gray-300 rounded-sm"
        >
          <option value="">Choose a session</option>
          {sessions?.map((session) => (
            <option key={session._id} value={session._id}>
              {session?.sessionTitle}
            </option>
          ))}
        </select>
      </div>

      {/* Materials List */}
      <div
        data-aos="fade-up"
        className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-0 "
      >
        {selectedData?.length > 0 ? (
          selectedData.map((material) => (
            <div key={material._id}>
              {/* Render material details */}
              <div
                key={material._id}
                className="border p-4 rounded dark:border-slate-500 w-72 shadow-sm"
              >
                {/* Image */}
                {material?.image && (
                  <div className="mb-4">
                    <img
                      src={material?.image}
                      alt={material?.title}
                      className="w-full h-48 object-cover rounded "
                    />
                    <button
                      onClick={() => handleDownload(material?.image)}
                      className="mt-3 flex items-center gap-2 text-blue-500"
                    >
                      <FaDownload /> Download
                    </button>
                  </div>
                )}

                {/* Title */}
                <h3 className="text-lg font-semibold mb-2">
                  {material?.title}
                </h3>

                {/* Google Drive Link */}
                {material?.link && (
                  <a
                    href={material?.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-green-500"
                  >
                    <FaExternalLinkAlt /> Open Resource
                  </a>
                )}

                {/* Update/Delete Buttons (for Tutors) */}
                {userRole === "Tutor" && (
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => handleUpdate(material._id)}
                      className="px-4 py-1 flex justify-center items-center gap-2 hover:bg-blue-600 bg-blue-500 text-white rounded"
                    >
                      <FaEdit /> Update
                    </button>
                    <button
                      onClick={() => handleDelete(material._id)}
                      className="px-4 flex py-1 justify-center items-center gap-2 hover:bg-red-600 bg-red-500 text-white rounded"
                    >
                      <FaTrash /> Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <p>No materials found for this session.</p>
        )}
      </div>
    </div>
  );
};

export default ViewMaterials;
