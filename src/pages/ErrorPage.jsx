import { useNavigate } from "react-router-dom";
import errorAnimation from "../assets/images/errorPage.json";
import Lottie from "lottie-react";
import { FaArrowLeft } from "react-icons/fa";

const ErrorPage = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-80">
        <Lottie animationData={errorAnimation}></Lottie>
      </div>
      <div className="text-center">
        <h2 className="text-2xl font-semibold">Page Not Found</h2>
        <p className="mt-2 text-gray-600">
          Sorry, the page you are looking for does not exist.
        </p>
        <div className="flex justify-center mt-4">
          <button
            onClick={handleGoHome}
            className="flex items-center justify-center gap-2 px-6 py-3 text-white bg-green-600 rounded-lg shadow-md hover:bg-green-700"
          >
            <FaArrowLeft />
            Go Back Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
