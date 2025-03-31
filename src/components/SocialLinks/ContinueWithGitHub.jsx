import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const ContinueWithGitHub = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { continueWithGitHub } = useAuth();

  const handleGitHub = async () => {
    try {
      await continueWithGitHub();
      const redirectPath = location.state?.form || "/";
      navigate(redirectPath);
      toast.success("Welcome to Session Sync!");
    } catch (error) {
      toast.error("Failed to continue with GitHub");
      console.error("Google sign-in error:", error.message);
    }
  };

  return (
    <div className="border rounded-sm">
      <button
        onClick={handleGitHub}
        className="flex items-center justify-center bg-gray-200 border-none py-2 px-4 w-full hover:bg-gray-300"
      >
        <img
          src="https://images.seeklogo.com/logo-png/30/2/github-logo-png_seeklogo-304612.png?v=1957907357408198576"
          alt="GitHub Logo"
          className="w-6 h-6 mr-2"
        />
        Continue with GitHub
      </button>
    </div>
  );
};

export default ContinueWithGitHub;
