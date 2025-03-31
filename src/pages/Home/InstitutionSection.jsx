import Lottie from "lottie-react";
import boyImage from "../../assets/images/singleStudy.json";

const InstitutionSection = () => {
  return (
    <div
      data-aos="fade-up"
      data-aos-anchor-placement="top-bottom"
      className="flex flex-col md:flex-row items-center justify-between py-12 px-6 md:px-20"
    >
      {/* Left: Image Section */}
      <div className="md:w-1/3 w-full">
        <Lottie animationData={boyImage} className="w-full rounded" />
      </div>

      {/* Right: Text Section */}
      <div className="md:w-1/2 w-full md:pl-12 text-center md:text-left mt-6 md:mt-0">
        <p className="text-blue-500 font-semibold flex items-center gap-2 text-lg">
          <span>🏛</span> Focus, Learn, Succeed!
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-slate-300 mt-2">
          Your partner for digital, direct <br /> and truly global student
          recruitment
        </h2>
        <p className="text-gray-700 dark:text-slate-400 text-lg mt-4">
          Success begins with smart preparation! Whether you're taking an exam,
          completing an assignment, or setting study goals, staying focused is
          the key. With the right resources and a supportive learning
          environment, you can achieve more and study with confidence. Stay
          motivated, practice effectively, and take one step closer to success
          every day
        </p>

        {/* Button */}
        <button className="mt-6 bg-blue-500 hover:bg-blue-600 dark:text-slate-200 text-white font-semibold py-1 px-4 rounded transition">
          For institutions
        </button>
      </div>
    </div>
  );
};

export default InstitutionSection;
