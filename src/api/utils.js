import axios from "axios";

// Upload image and return image url
export const imageUpload = async (imageData) => {
  const fromData = new FormData();
  fromData.append("image", imageData);

  // send image data to imageBB
  const { data } = await axios.post(
    `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMAGE_API_KEY}`,
    fromData
  );

  return data.data.display_url;
};

export const saveUser = async (user) => {
  await axios.post(`${import.meta.env.VITE_API_URL}/users/${user?.email}`, {
    name: user?.displayName,
    image: user?.photoURL,
    email: user?.email,
  });
};
