import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import LoadingSpinner from "../../../components/Shared/LoadingSpinner";
import { FaTrash } from "react-icons/fa";
import { Helmet } from "react-helmet-async";

const ViewAllMaterials = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10; // Number of materials per page

  // Fetch all materials
  const {
    data: materials = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["allMaterials"],
    queryFn: async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/all-materials`
      );
      return response.data;
    },
  });

  // Mutation to delete a material
  const deleteMaterial = useMutation({
    mutationFn: async (materialId) => {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/delete-material/${materialId}`
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("Material deleted successfully!");
      queryClient.invalidateQueries(["allMaterials"]); // Refresh the materials list
    },
    onError: (error) => {
      toast.error(`Failed to delete material: ${error.message}`);
    },
  });

  // Filter materials based on search term
  const filteredMaterials = materials.filter((material) =>
    material.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Paginate materials
  const paginatedMaterials = filteredMaterials.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  if (isLoading) return <LoadingSpinner />;
  if (isError)
    return <div className="text-red-500">Error: {error.message}</div>;

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      <Helmet>
        <title>Session Sync | Manage All Materials</title>
      </Helmet>
      <h1 className="text-3xl text-center md:text-start font-bold mt-10 mb-5 text-blue-500">
        Manage All Materials
      </h1>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search by title..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full md:w-1/2 mt-1 block focus:outline-none bg-base-300 dark:bg-slate-300 dark:text-black border-none rounded-sm"
      />

      {/* Materials Table */}
      <div className="overflow-x-auto shadow-md rounded-sm mt-5">
        <table className="min-w-full table-auto">
          <thead className="bg-gradient-to-l from-blue-300 via-white to-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-blue-600">
                Title
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-blue-600">
                Tutor Email
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-blue-600">
                Session ID
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-blue-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedMaterials.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-4 text-gray-500">
                  No materials found.
                </td>
              </tr>
            ) : (
              paginatedMaterials.map((material) => (
                <tr key={material._id}>
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-slate-300">
                    {material.title}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 dark:text-slate-400">
                    {material.tutorEmail}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 dark:text-slate-400">
                    {material.sessionId}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => deleteMaterial.mutate(material._id)}
                      className="flex items-center gap-2 bg-red-500 text-white px-3 py-1 rounded-sm hover:bg-red-600 transition"
                    >
                      <FaTrash />
                      <span>Delete</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="text-sm text-gray-600">
          Showing {paginatedMaterials.length} of {filteredMaterials.length}{" "}
          materials
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-1 dark:text-slate-900 bg-slate-200 rounded-sm hover:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="px-4 dark:text-slate-400">
            Page {currentPage} of{" "}
            {Math.ceil(filteredMaterials.length / pageSize)}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) =>
                Math.min(
                  prev + 1,
                  Math.ceil(filteredMaterials.length / pageSize)
                )
              )
            }
            disabled={
              currentPage === Math.ceil(filteredMaterials.length / pageSize)
            }
            className="px-4 py-1 dark:text-slate-900 bg-slate-200 rounded-sm hover:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewAllMaterials;
