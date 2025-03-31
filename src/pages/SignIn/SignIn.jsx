import { Link, Navigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import Lottie from "lottie-react";
import signInAnimation from "../../assets/images/sign-in-animation.json";
import LoadingSpinner from "../../components/Shared/LoadingSpinner";
import { useState } from "react";
import { GrPowerCycle } from "react-icons/gr";
import useAuth from "../../hooks/useAuth";
import ContinueWithGoogle from "../../components/SocialLinks/ContinueWithGoogle";
import { Helmet } from "react-helmet-async";

const SignIn = () => {
  const { signIn, loading, user } = useAuth();
  const location = useLocation();
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);

  const from = location?.state?.from?.pathname || "/";
  if (loading) return <LoadingSpinner></LoadingSpinner>;
  if (user) return <Navigate to={from} replace={true} />;

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

  // from submit handler
  const handleSignIn = async (event) => {
    event.preventDefault();
    const email = event.target.email.value;
    const password = event.target.password.value;

    try {
      await signIn(email, password);
      toast.success("Welcome Back");
    } catch (error) {
      toast.error("Sign-in failed");
      console.error("Sign-in error:", error.message);
    }
  };

  return (
    <div
      data-aos="fade-zoom-in"
      data-aos-easing="ease-in-back"
      data-aos-delay="100"
      data-aos-offset="0"
      className="dark:bg-gray-900 min-h-screen flex flex-col md:flex-row items-center justify-center p-4"
    >
      <Helmet>
        <title>Session Sync | Sign In</title>
      </Helmet>
      <div className="flex flex-row-reverse">
        {/* Form Section */}
        <div className="dark:bg-gray-900 dark:text-slate-200 w-full bg-base-100 max-w-md shadow-sm rounded-sm p-6 sm:p-8 md:mr-8">
          <h1 className="text-3xl font-bold text-purple-500 mb-4 text-center ">
            Welcome Back!
          </h1>
          <p className="text-gray-500 mb-6 text-center dark:text-slate-400">
            Sign in to your account to continue your learning journey.
          </p>
          <form onSubmit={handleSignIn}>
            {/* Email Input */}
            <div className="mb-4">
              <label className=" block dark:text-slate-400 font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="Enter email"
                className="border-slate-200 dark:text-black bg-base-100 dark:bg-slate-300 border w-full px-3 py-2 rounded-sm shadow-sm focus:ring-indigo-200 focus:ring-1 focus:outline-none"
              />
            </div>
            {/* Password Input */}
            <div className="mb-4">
              <label className="block font-medium text-gray-700 dark:text-slate-400 mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="Enter password"
                className="border-slate-200 dark:bg-slate-300 bg-base-100 border w-full dark:text-black px-3 py-2 rounded-sm shadow-sm focus:ring-indigo-200 focus:ring-1 focus:outline-none"
              />
            </div>
            {/* Keep Logged In & Forget Password */}
            <div className="flex items-center justify-between mb-4">
              <label className="flex items-center text-sm">
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4 text-indigo-600 dark:bg-slate-300 border-gray-200 rounded-sm"
                  checked={keepLoggedIn}
                  onChange={() => setKeepLoggedIn(!keepLoggedIn)}
                />
                <span className="ml-2 dark:text-slate-400 text-gray-700">
                  Keep me logged in
                </span>
              </label>

              <Link
                to={"/resetPassword"}
                className="text-sm text-indigo-600 hover:underline"
              >
                Forget password?
              </Link>
            </div>
            {/* Sign-In Button */}
            <button className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-2 rounded-sm hover:bg-gray-700 transition">
              {loading ? (
                <GrPowerCycle className="animate-spin m-auto" />
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Register & Google Sign-In */}
          <div className="text-center mt-6">
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Don’t have an account?{" "}
              <Link
                to="/sign_up"
                className="font-semibold text-indigo-500 hover:underline"
              >
                Register here
              </Link>
            </p>
            <div className=" relative flex items-center my-2">
              <div className=" flex-grow border-t dark:border-slate-400 border-gray-200"></div>
              <span className=" mx-4 dark:text-slate-400 text-gray-500">
                Or
              </span>
              <div className="flex-grow border-t border-gray-200 dark:border-slate-400"></div>
            </div>
            <div className="space-y-1">
              <ContinueWithGoogle></ContinueWithGoogle>
            </div>
          </div>
        </div>
        {/* Sign-in Image  */}
        <div className="hidden lg:block">
          <Lottie
            className="h-[600px] w-[600px]"
            animationData={signInAnimation}
          ></Lottie>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
