import { useState, useRef, useEffect } from "react";
import { FaSave } from "react-icons/fa";
import useImageUpload from "../../../hooks/useImageUpload";
import axios from "axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";
import LoadingSpinner from "../../../components/Shared/LoadingSpinner";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const UpdateMaterial = () => {
  const { id } = useParams(); // Get material ID from URL
  const navigate = useNavigate(); // To navigate after update
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [existingImage, setExistingImage] = useState("");
  const fileInputRef = useRef(null);

  const { isUploading, uploadImage } = useImageUpload();

  // Fetch material details
  const { data: material, isLoading } = useQuery({
    queryKey: ["material", id],
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/single-material/${id}`
      );
      return res.data;
    },
  });

  useEffect(() => {
    if (material) {
      setTitle(material.title || "");
      setLink(material.link || "");
      setExistingImage(material.image || "");
    }
  }, [material]);

  if (isLoading) return <LoadingSpinner />;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let imageUrl = existingImage;
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/update-material/${id}`,
        {
          title,
          image: imageUrl,
          link,
        }
      );

      if (res.status === 200) {
        toast.success("Your study material has been successfully updated.");
        queryClient.invalidateQueries(["materials"]);
        navigate("/dashboard/view_materials"); // Redirect to the view materials page
      }
    } catch (error) {
      toast.error("An error occurred while updating the material.");
    }
  };

  return (
    <div
      data-aos="zoom-out"
      className="lg:mt-3 mt-16 max-w-3xl mx-auto p-6 rounded-sm shadow-sm"
    >
      <h2 className="text-3xl text-center md:text-start font-bold mt-10 mb-5 text-blue-500">
        Update Study Material
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block dark:text-slate-300 font-medium mb-22">
            Material Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full focus:outline-none bg-base-300 dark:bg-slate-300 dark:text-black border-none rounded-sm"
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
            className="mt-1 block w-full focus:outline-none bg-base-300 dark:bg-slate-300 dark:text-black border-none rounded-sm"
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="block dark:text-slate-300 font-medium mb-22">
            Update Image
          </label>
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => setImageFile(e.target.files[0])}
            className="mt-1 block w-full focus:outline-none bg-base-300 dark:bg-slate-300 dark:text-black border-none rounded-sm"
            accept="image/*"
          />
          {existingImage && (
            <div className="mt-2">
              <img
                src={imageFile ? URL.createObjectURL(imageFile) : existingImage}
                alt="Preview"
                className="w-32 h-32 object-cover rounded"
              />
            </div>
          )}
        </div>

        {/* Google Drive Link */}
        <div>
          <label className="block dark:text-slate-300 font-medium mb-22">
            Google Drive Link
          </label>
          <input
            type="url"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            className="mt-1 block w-full focus:outline-none bg-base-300 dark:bg-slate-300 dark:text-black border-none rounded-sm"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isUploading}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          <FaSave />
          {isUploading ? "Updating..." : "Update Material"}
        </button>
      </form>
    </div>
  );
};

export default UpdateMaterial;
