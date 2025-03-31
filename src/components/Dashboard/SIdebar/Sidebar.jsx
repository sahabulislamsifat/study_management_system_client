import { AiOutlineFileSync } from "react-icons/ai";
import { GrLogout } from "react-icons/gr";
import { Link } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import { useState } from "react";
import StudentMenu from "./Menu/StudentMenu";
import TutorMenu from "./Menu/TutorMenu";
import AdminMenu from "./Menu/AdminMenu";
import { CiMenuBurger } from "react-icons/ci";
import { FaRegAddressCard } from "react-icons/fa";
import MenuItem from "./Menu/MenuItem";
import { toast } from "react-hot-toast";

const Sidebar = () => {
  const { logOut, user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Sidebar Toggle Handler
  const handleToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Logout Handler
  const handleLogout = async () => {
    try {
      await logOut();
      toast.success("Logged out successfully!");
    } catch (error) {
      toast.error(`Error during logout: ${error.message}`);
    }
  };

  return (
    <>
      {/* Toggle Button for Mobile */}
      <button
        onClick={handleToggle}
        className="fixed top-3 pt-3 pr-3 pl-2 pb-2 mb-2 md:hidden "
      >
        <CiMenuBurger className="w-6 h-6" />
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 min-h-screen bg-gray-100 shadow-sm transition-transform duration-300 z-40 w-72 dark:bg-gray-900 dark:text-slate-200 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:static`}
      >
        <section className="flex flex-col h-full">
          {/* Logo Section */}
          <Link to="/" onClick={() => setIsSidebarOpen(false)}>
            <div className="p-4 flex items-center">
              <AiOutlineFileSync className="size-16 lg:size-12" />
              <div>
                <h1>
                  <span className="font-bold text-blue-600 text-2xl hover:text-blue-500 transition-all duration-300">
                    Session
                  </span>
                  <span className="lg:text-2xl font-semibold transition-all duration-300">
                    Sync
                  </span>
                </h1>
              </div>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="flex-1 px-4 overflow-y-auto">
            <ul className="space-y-2">
              {/* Role-Based Menus */}
              {user?.role === "Student" && <StudentMenu />}
              {user?.role === "Tutor" && <TutorMenu />}
              {user?.role === "Admin" && <AdminMenu />}
            </ul>
          </nav>

          {/* Profile and Logout Section */}
          <div className="p-4 border-t border-gray-200 mt-[290px]">
            {/* Profile Button */}
            <MenuItem
              icon={FaRegAddressCard}
              label="Profile"
              address="/dashboard/profile"
              onClick={() => setIsSidebarOpen(false)}
            />

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="font-semibold flex items-center gap-3 px-4 py-2 w-full text-left rounded-sm hover:bg-red-500 hover:text-white transition-all duration-300"
            >
              <GrLogout className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </section>
      </div>

      {/* Background overlay for mobile */}
      {isSidebarOpen && (
        <div
          onClick={handleToggle}
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
        ></div>
      )}
    </>
  );
};

export default Sidebar;
