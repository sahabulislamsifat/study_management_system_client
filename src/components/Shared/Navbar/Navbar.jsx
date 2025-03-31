import { NavLink, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { AiOutlineFileSync } from "react-icons/ai";
import { RiMenuFill } from "react-icons/ri";
import useAuth from "../../../hooks/useAuth";
import { BiSolidDashboard } from "react-icons/bi";
import { FaRegCircleUser } from "react-icons/fa6";
import ThemeController from "../ThemeController";

const Navbar = () => {
  const { user, logOut } = useAuth();

  const handleLogout = async () => {
    try {
      await logOut();
      toast.error("Log out...");
    } catch (error) {
      toast.error(`Error during logout: ${error.message}`);
    }
  };

  return (
    <section className="dark:bg-gray-900  dark:text-gray-200 navbar fixed top-0 bg-base-100 left-0 z-40">
      <div className="container navbar mx-auto flex justify-between items-center">
        {/* Navbar Start */}
        <div className="navbar-start flex items-center">
          {/* Logo */}
          <NavLink to="/" className="flex items-center">
            <AiOutlineFileSync className="size-14 lg:size-12" />
            <div>
              <h1>
                <span className="font-bold text-blue-600 text-xl lg:text-2xl hover:text-blue-500 transition-all duration-300">
                  Session
                </span>
                <span className="lg:text-2xl text-xl font-semibold transition-all duration-300">
                  Sync
                </span>
              </h1>
            </div>
          </NavLink>
        </div>
        {/* Navbar End */}
        <div className="navbar-end">
          <ThemeController></ThemeController>
          {user ? (
            <div className="flex items-center">
              <div>
                <img
                  className="w-[34px] h-[34px] rounded-full"
                  alt="User Avatar"
                  src={user?.photoURL}
                />
              </div>
              {/* Menu Icon  */}
              <div className="dropdown dropdown-end">
                <button className="pl-4 pt-2">
                  <RiMenuFill className="size-5" />
                </button>
                <ul className="menu menu-sm dropdown-content bg-base-100 rounded-sm w-36 mt-5 space-y-1 dark:bg-gray-900  dark:text-slate-200">
                  <li>
                    <Link className="text-left rounded-sm w-full dark:bg-gray-900  dark:text-slate-200 font-semibold">
                      <FaRegCircleUser />
                      {user?.role}
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="text-left rounded-sm w-full font-semibold"
                      to={"/dashboard"}
                    >
                      <BiSolidDashboard />
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link
                      onClick={handleLogout}
                      className="bg-red-600 mt-1 text-white hover:bg-red-700 text-left rounded-none w-full font-semibold"
                    >
                      Logout
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="md:block">
              <NavLink
                to="/sign_in"
                className="btn bg-blue-600 rounded-sm transition-all duration-300 hover:bg-blue-700 text-white btn-sm border-none"
              >
                Sign In
              </NavLink>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Navbar;
