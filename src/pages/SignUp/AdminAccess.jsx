import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import Lottie from "lottie-react";
import signUpAnimation from "../../assets/images/adminAccess.json";
// import ContinueWithGoogle from "../../components/SocialLinks/ContinueWithGoogle";
import { imageUpload } from "../../api/utils";
import { GrPowerCycle } from "react-icons/gr";
import useAuth from "../../hooks/useAuth";
import { Helmet } from "react-helmet-async";

const validPasswordRegex = /^(?=.*[A-Z])(?=.*[a-z]).{6,}$/;

const AdminAccess = () => {
  const { createUser, updateUserProfile, loading } = useAuth();
  const navigate = useNavigate();

  const handleSignUp = async (event) => {
    event.preventDefault();
    const form = event.target;
    const name = form.name.value;
    const email = form.email.value;
    const image = form.image.files[0];
    const password = form.password.value;

    // 1. send image data to imageBB
    const photoURL = await imageUpload(image);

    try {
      if (!validPasswordRegex.test(password)) {
        toast.error(
          "Password must be at least 6 characters long, include at least one uppercase letter, and one lowercase letter."
        );
        return;
      }
      // 2. User Registration
      const result = await createUser({
        email,
        password,
        displayName: name,
        photoURL,
        userRole: "Admin",
      });
      // 3. save username and photo
      if (result) {
        navigate("/");
        return toast.success("Account created successfully!");
      } else {
        throw new Error("Failed to sign up");
      }
    } catch (error) {
      toast.error("Failed to Sign-up");
      console.error(error.message);
    }
  };

  return (
    <div
      data-aos="fade-zoom-in"
      data-aos-easing="ease-in-back"
      data-aos-delay="100"
      data-aos-offset="0"
      className="min-h-screen dark:bg-gray-900 flex flex-col md:flex-row items-center justify-center p-4"
    >
      <Helmet>
        <title>Session Sync | Sign Up</title>
      </Helmet>
      <div className="flex flex-row-reverse">
        {/* Form Section */}
        <div className="w-full dark:bg-gray-900 bg-base-100 max-w-md shadow-sm rounded-sm p-6 sm:p-8 md:mr-8">
          <h1 className="text-3xl font-bold text-purple-500 mb-4 text-center">
            Create Admin Account
          </h1>
          <p className="mb-6 text-center text-gray-500 dark:text-slate-400">
            Empowering Control, Streamlining Success – Admin Access for a
            Smarter Website
          </p>

          <form onSubmit={handleSignUp}>
            {/* Name Input */}
            <div className="mb-4">
              <label className="block dark:text-slate-400 font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                name="name"
                placeholder="Enter name"
                className="border-slate-200 bg-base-100 dark:bg-slate-300 border w-full px-3 py-2 rounded-sm shadow-sm focus:ring-indigo-200 focus:ring-1 focus:outline-none"
              />
            </div>

            {/* Email Input */}
            <div className="mb-4">
              <label className="block dark:text-slate-400 font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="Enter email"
                className="border-slate-200 bg-base-100 dark:bg-slate-300 border w-full px-3 py-2 rounded-sm shadow-sm focus:ring-indigo-200 focus:ring-1 focus:outline-none"
              />
            </div>

            {/* Image Input  */}
            <div>
              <label
                htmlFor="image"
                className="block font-medium text-gray-700 mb-1 dark:text-slate-400"
              >
                Select Image
              </label>
              <input
                required
                type="file"
                id="image"
                name="image"
                accept="image/*"
                className="border-slate-200 bg-base-100 border w-full rounded-sm shadow-sm focus:ring-blue-200 focus:ring-1 focus:outline-none dark:bg-slate-300"
              />
            </div>

            {/* Password Input */}
            <div className="my-4">
              <label className="block dark:text-slate-400 font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="Enter password"
                className="border-slate-200 bg-base-100 dark:bg-slate-300 border w-full px-3 py-2 rounded-sm shadow-sm focus:ring-indigo-200 focus:ring-1 focus:outline-none"
              />
            </div>

            {/* Register Button */}
            <button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 rounded-sm hover:bg-blue-700 transition">
              {loading ? (
                <GrPowerCycle className="animate-spin m-auto" />
              ) : (
                "Sign Up"
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="text-center my-4">
            <p className="text-slate-600 text-sm dark:text-slate-400">
              Already have an admin account?{" "}
              <Link
                to={"/sign_in"}
                className="text-indigo-500 font-semibold hover:underline"
              >
                Sign In
              </Link>
            </p>
            <p className="text-slate-600 text-sm dark:text-slate-400">
              Do you want to get access as a student?{" "}
              <Link
                to={"/sign_up"}
                className="text-indigo-500 font-semibold hover:underline"
              >
                Click here
              </Link>
            </p>
            {/* <div className="space-y-1 mt-3 dark:text-slate-300">
              <ContinueWithGoogle></ContinueWithGoogle>
            </div> */}
          </div>
        </div>
        {/* Sign-up Image  */}
        <div className="hidden lg:block">
          <Lottie
            className="h-[700px] w-[600px]"
            animationData={signUpAnimation}
          ></Lottie>
        </div>
      </div>
    </div>
  );
};

export default AdminAccess;
