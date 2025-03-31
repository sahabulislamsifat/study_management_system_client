import { Helmet } from "react-helmet-async";
import { useState } from "react";
import useAuth from "../../../hooks/useAuth";
import LoadingSpinner from "../../../components/Shared/LoadingSpinner";
import profileCover from "../../../assets/images/profileCover.jpg";
import toast from "react-hot-toast";
import { updateProfile, sendPasswordResetEmail } from "firebase/auth";
import useImageUpload from "../../../hooks/useImageUpload"; // Import the custom hook

const Profile = () => {
  const { user, loading, auth, setUser } = useAuth();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [name, setName] = useState(user?.displayName || "");
  const { imageUrl, isUploading, error, uploadImage } = useImageUpload(); // Use the custom hook

  if (loading) return <LoadingSpinner />;

  // Update User Profile
  const updateUserProfile = async (event) => {
    event.preventDefault();
    const name = event.target.name.value;

    let photoURL = user?.photoURL;

    try {
      if (imageUrl) {
        photoURL = imageUrl; // Use the image URL from the hook
      }

      await updateProfile(auth.currentUser, { displayName: name, photoURL });
      await auth.currentUser.reload();

      setUser((prevUser) => ({
        ...prevUser,
        displayName: name,
        photoURL: photoURL,
      }));

      toast.success("Profile updated successfully!");
      setIsEditingProfile(false);
    } catch (error) {
      console.error("Error updating profile:", error.message);
      toast.error("Failed to update profile.");
    }
  };

  // Handle Password Reset
  const handlePasswordReset = async (event) => {
    event.preventDefault();
    if (!user?.email) {
      return toast.error("No email found for this account.");
    }
    try {
      await sendPasswordResetEmail(auth, user.email);
      toast.success("Password reset email sent!");
      setIsChangingPassword(false);
    } catch (error) {
      console.error("Error resetting password:", error.message);
      toast.error("Failed to send password reset email.");
    }
  };

  return (
    <div className="flex justify-center">
      <Helmet>
        <title>Session Sync | Profile</title>
      </Helmet>
      <div className="shadow-md rounded-sm pt-24 w-full max-w-xs sm:max-w-sm md:max-w-lg lg:max-w-2xl">
        <img
          alt="Cover"
          src={profileCover}
          className="w-full rounded-none h-36 sm:h-48 md:h-56 lg:h-64 object-cover"
        />
        <div className="flex flex-col items-center justify-center p-4 -mt-16">
          <img
            alt="profile"
            src={user?.photoURL || imageUrl}
            className="mx-auto object-cover rounded-full h-24 w-24 border-4 border-white shadow-md"
          />
          <p className="mt-2 py-1 px-4 text-sm md:text-base bg-gradient-to-l from-blue-300 via-white to-gray-200 rounded-sm text-black dark:text-gray-900">
            {user?.role}
          </p>
          <div className="w-full px-4 py-6  rounded-lg">
            <div className="text-center text-sm md:text-base text-gray-600">
              <p className="font-semibold text-black dark:text-slate-400">
                {user?.displayName}
              </p>
              <p className="font-semibold text-black dark:text-slate-400">
                {user?.email}
              </p>
            </div>

            {/* Conditional Fields for Profile Update */}
            {isEditingProfile ? (
              <form onSubmit={updateUserProfile} className="space-y-4">
                <input
                  type="text"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="focus:outline-none dark:text-black mt-6 dark:bg-slate-300 block w-full bg-base-300 border-none rounded-sm"
                  placeholder="Enter your name"
                />
                {/* Image Input  */}
                <div>
                  <label
                    htmlFor="image"
                    className="block font-medium text-gray-700 mb-1 dark:text-slate-400"
                  >
                    Select Image
                  </label>
                  <input
                    type="file"
                    id="image"
                    name="image"
                    accept="image/*"
                    className="border-slate-200 bg-base-100 border w-full rounded-sm shadow-sm focus:ring-blue-200 dark:text-gray-900 focus:ring-1 focus:outline-none dark:bg-slate-300"
                    onChange={(e) => uploadImage(e.target.files[0])} // Use the custom hook for image upload
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
                    type="submit"
                    disabled={isUploading} // Disable button while uploading
                  >
                    {isUploading ? "Uploading..." : "Update"}
                  </button>
                  <button
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-1 rounded"
                    type="button"
                    onClick={() => setIsEditingProfile(false)}
                  >
                    Cancel
                  </button>
                </div>
                {error && <p className="text-red-500 text-center">{error}</p>}{" "}
                {/* Display error */}
              </form>
            ) : isChangingPassword ? (
              <form onSubmit={handlePasswordReset} className="space-y-4">
                <p className="text-gray-600 text-center my-5 dark:text-slate-400">
                  A password reset link will be sent to your email.
                </p>
                <div className="flex gap-2 justify-center">
                  <button
                    className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
                    type="submit"
                  >
                    Send Reset Link
                  </button>
                  <button
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-1 rounded"
                    type="button"
                    onClick={() => setIsChangingPassword(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mt-6">
                <button
                  className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
                  onClick={() => setIsEditingProfile(true)}
                >
                  Edit Profile
                </button>
                <button
                  className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
                  onClick={() => setIsChangingPassword(true)}
                >
                  Change Password
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
