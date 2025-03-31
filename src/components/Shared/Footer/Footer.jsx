import React from "react";
import Lottie from "lottie-react";
// import footerLogo from "../../../assets/images/footerAnimation.json";
import footerLogo from "../../../assets/images/groupStudy.json";

const Footer = () => {
  return (
    <footer>
      <div className="container mx-auto p-4">
        {/* Footer Content */}
        <div className="flex flex-col md:flex-row md:justify-between  gap-8">
          {/* Logo and Description */}
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold text-blue-600">Study Platform</h2>
            <p className="mt-2 text-sm ">
              Connecting students, tutors, and administrators <br /> to enhance
              collaboration and streamline educational activities.
            </p>
            <div className="flex justify-center md:justify-start">
              <Lottie className="w-72 md:w-32" animationData={footerLogo} />
            </div>
          </div>

          {/* Contact Information */}
          <div className="dark:bg-gray-900  dark:text-slate-200">
            <h3 className="text-lg font-bold">Contact Us</h3>
            <ul className="mt-3 space-y-2">
              <li className="text-sm">
                <strong>Email:</strong>{" "}
                <a
                  href="mailto:sahabulislamsifat@gmail.com"
                  className="hover:underline"
                >
                  sahabulislamsifat@gmail.com
                </a>
              </li>
              <li className="text-sm">
                <strong>Phone:</strong>{" "}
                <a href="tel:+8801632165523" className="hover:underline">
                  +880 1632165523
                </a>
              </li>
              <li className="text-sm">
                <strong>Address:</strong> 123 Education Street, Dhaka,
                Bangladesh
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-gray-400 mt-2 lg:mt-0 pt-4 text-center">
          <p className="text-xs">
            &copy; {new Date().getFullYear()} Collaborative Study Platform. All
            rights reserved.
          </p>
          <div className="mt-2">
            <a href="/terms" className="text-xs hover:underline text-gray-400">
              Terms of Service
            </a>{" "}
            |{" "}
            <a
              href="/privacy"
              className="text-xs hover:underline text-gray-400"
            >
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
