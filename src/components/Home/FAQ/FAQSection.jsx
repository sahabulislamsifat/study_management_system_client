import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import Lottie from "lottie-react";
import faqImage from "../../../assets/images/faq.json";

const faqs = [
  {
    question: "How do I get started with the Collaborative Study Platform?",
    answer:
      "Sign up as a student, tutor, or admin, then explore study sessions, book tutors, or upload materials.",
  },
  {
    question: "Is the platform completely free?",
    answer:
      "Some sessions are free, while premium sessions require payment. Registration is free for all users.",
  },
  {
    question: "How does the platform compare to traditional learning?",
    answer:
      "Our platform provides interactive sessions, direct tutor-student communication, and self-paced learning.",
  },
  {
    question: "Is there a trial period?",
    answer:
      "Yes! You can access free study sessions before purchasing premium content.",
  },
  {
    question: "What features are included in the platform?",
    answer:
      "Role-based dashboards, session booking, note management, material uploads, and admin moderation.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-center dark:text-blue-600 text-gray-800 mb-8">
        Frequently Asked Questions
      </h2>
      <div className="flex flex-col md:flex-row items-center justify-between py-12 px-6 md:px-20">
        {/* Left: Image Section */}
        <div className="md:w-1/3 w-full">
          <Lottie animationData={faqImage} className="w-full rounded" />
        </div>

        {/* Right: Text Section */}

        <div className="space-y-4 md:w-1/2 w-full md:pl-12 text-center md:text-left mt-6 md:mt-0">
          {faqs.map((faq, index) => (
            <div key={index} className=" p-4 shadow-sm">
              <button
                onClick={() => toggleFAQ(index)}
                className="flex justify-between items-center w-full font-medium text-lg text-gray-700 dark:text-slate-300"
              >
                {faq.question}
                {openIndex === index ? (
                  <ChevronUp
                    className="text-gray-500 dark:text-slate-400"
                    size={22}
                  />
                ) : (
                  <ChevronDown
                    className="text-gray-500 dark:text-slate-400"
                    size={22}
                  />
                )}
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="mt-3 text-gray-600 text-sm dark:text-slate-400">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
