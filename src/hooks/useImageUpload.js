import { useState } from "react";
import { imageUpload } from "../api/utils";
// import { imageUpload } from "../utils/imageUpload";

const useImageUpload = () => {
  const [imageUrl, setImageUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);

  const uploadImage = async (imageFile) => {
    setIsUploading(true);
    setError(null);

    try {
      const url = await imageUpload(imageFile);
      setImageUrl(url);
      return url;
    } catch (err) {
      setError("Failed to upload image. Please try again.");
      throw err;
    } finally {
      setIsUploading(false);
    }
  };

  //   console.log(uploadImage);
  return { imageUrl, isUploading, error, uploadImage };
};

export default useImageUpload;
