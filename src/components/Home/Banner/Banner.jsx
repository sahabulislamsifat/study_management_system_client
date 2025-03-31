import Lottie from "lottie-react";
import bannerLogo from "../../../assets/images/bannerLogo.json";
import { Link } from "react-router-dom";

const Banner = () => {
  return (
    <div className="mt-14">
      {/* Parallax Banner Section */}
      <div
        className="relative bg-gradient-to-r from-blue-500 to-purple-600 text-white bg-fixed bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')`, // Add your background image URL
        }}
      >
        {/* Overlay for better text visibility */}
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>

        <div className="container mx-auto px-6 py-16 flex flex-col lg:flex-row lg:items-center lg:justify-between relative z-10">
          {/* Text Section */}
          <div className="lg:w-1/2 text-center lg:text-left">
            <h1 className="text-3xl sm:text-4xl font-bold leading-tight">
              Welcome to{" "}
              <span className="text-yellow-300">
                Collaborative Study Platform
              </span>
            </h1>
            <p className="mt-4 text-base sm:text-lg">
              Join students, tutors, and administrators to enhance your learning
              experience.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
              <Link
                to={"/sign_in"}
                className="px-6 py-1 bg-yellow-400 text-black font-semibold rounded hover:bg-yellow-500 hover:text-white"
              >
                Get Started
              </Link>
              <button className="px-6 py-1 bg-transparent border-2 border-white font-semibold rounded hover:bg-white hover:text-black">
                Learn More
              </button>
            </div>
          </div>

          {/* Animation Section */}
          <div className="mt-10 lg:mt-0 lg:w-1/2">
            <Lottie
              animationData={bannerLogo}
              className="w-full max-w-xs sm:max-w-md lg:max-w-lg mx-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
