import { Helmet } from "react-helmet-async";
import Banner from "../../components/Home/Banner/Banner";
import TutorSection from "../../components/Home/TutorSection/TutorSection";
import StudySessions from "../../components/Home/StudySection/StudySession";
import ExtraSection from "./ExtraSection";
import InstitutionSection from "./InstitutionSection";
import FAQSection from "../../components/Home/FAQ/FAQSection";

const Home = () => {
  return (
    <div>
      <Helmet>
        <title>Session Sync | Home</title>
      </Helmet>
      {/* Banner Section */}
      <div>
        <Banner />
      </div>
      {/* Study Section */}
      <div>
        <StudySessions />
      </div>
      {/* Community Section */}
      <div>
        <ExtraSection></ExtraSection>
      </div>
      {/* Institution Section */}
      <div>
        <InstitutionSection></InstitutionSection>
      </div>
      {/* Tutor Section */}
      <h1 className="font-bold my-10 text-gray-800 dark:text-blue-600 text-3xl text-center">
        Our Tutors
      </h1>
      <div>
        <TutorSection />
      </div>
      {/* FAQ Section */}
      <div>
        <FAQSection></FAQSection>
      </div>
    </div>
  );
};

export default Home;
