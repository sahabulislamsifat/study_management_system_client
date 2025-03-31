import { motion } from "framer-motion";
import Marquee from "react-fast-marquee";
import Lottie from "lottie-react";
import communityAnimation from "../../assets/images/footerAnimation.json";
// import footerLogo from "../../../assets/images/footerAnimation.json";

const ExtraSection = () => {
  return (
    <div className="relative py-16 px-8 text-center">
      <h2 className="text-3xl dark:text-slate-300 font-bold text-gray-900">
        Find your community. <span className="text-blue-500">Set Goals.</span>{" "}
        Achieve Them. Get rewarded.
      </h2>

      {/* Animated Lottie Image */}
      <motion.div
        className="relative mt-10 flex justify-center items-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        <Lottie
          animationData={communityAnimation}
          className="w-full h-96 max-w-3xl"
        />
      </motion.div>

      <p className="mt-6 text-gray-700 text-lg dark:text-slate-400 max-w-2xl mx-auto">
        Imagine a world in which studying is actually enjoyable. A world where
        you set goals and accomplish them. Where you find guidance where needed
        and feel supported. Welcome to StudyTogether.
      </p>

      {/* Scrolling Text Marquee */}
      <Marquee
        speed={50}
        className="mt-10 bg-gradient-to-l from-blue-300 via-white dark:text-gray-900 to-gray-100 py-3"
      >
        <span className="mx-10 text-lg font-semibold">Progress</span>
        <span className="mx-10 text-lg font-semibold">Together</span>
        <span className="mx-10 text-lg font-semibold">Community</span>
        <span className="mx-10 text-lg font-semibold">Tutoring</span>
        <span className="mx-10 text-lg font-semibold">Social Events</span>
        <span className="mx-10 text-lg font-semibold">Motivation</span>
      </Marquee>
    </div>
  );
};

export default ExtraSection;
