import { Helmet } from "react-helmet-async";
import Sidebar from "../components/Dashboard/SIdebar/Sidebar";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  return (
    <div
      data-aos="fade-zoom-in"
      data-aos-easing="ease-in-back"
      data-aos-delay="100"
      data-aos-offset="0"
      className="relative min-h-screen md:flex dark:bg-gray-900 dark:text-slate-200"
    >
      <Helmet>
        <title>Session Sync | Dashboard</title>
      </Helmet>
      {/* Left Side: Sidebar Component */}
      <Sidebar></Sidebar>
      {/* Right Side: Dashboard Dynamic Content */}
      <div className="flex-1  md:ml-64">
        <div className="p-5">
          {/* Outlet for dynamic contents */}
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
