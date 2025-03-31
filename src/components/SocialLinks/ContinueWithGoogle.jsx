import { useContext } from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../providers/AuthProvider";

const ContinueWithGoogle = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { continueWithGoogle } = useContext(AuthContext);

  const handleGoogle = async () => {
    try {
      await continueWithGoogle();
      const redirectPath = location.state?.form || "/";
      navigate(redirectPath);
      toast.success("Welcome to Session Sync!");
    } catch (error) {
      toast.error("Failed to sign in with Google");
      console.error("Google sign-in error:", error.message);
    }
  };

  return (
    <div className="border rounded-sm dark:border-slate-400">
      <button
        onClick={handleGoogle}
        className="flex items-center dark:bg-gray-900 justify-center bg-gray-200 border-none py-2 px-4 w-full hover:bg-gray-300 "
      >
        <img
          src="https://loodibee.com/wp-content/uploads/Google-Symbol.png"
          alt="Google Logo"
          className="w-6 h-6 mr-2"
        />
        Continue with Google
      </button>
    </div>
  );
};

export default ContinueWithGoogle;
