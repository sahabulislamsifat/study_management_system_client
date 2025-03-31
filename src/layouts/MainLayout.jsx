import Navbar from "../components/Shared/Navbar/Navbar";
import { Outlet } from "react-router-dom";
import Footer from "../components/Shared/Footer/Footer";

const MainLayout = () => {
  return (
    <div className="dark:bg-gray-900  dark:text-gray-200">
      <div className="container mx-auto">
        <header>
          <Navbar></Navbar>
        </header>
        <main className="min-h-[calc(100vh-68px)]">
          <Outlet></Outlet>
        </main>
        <footer>
          <Footer></Footer>
        </footer>
      </div>
    </div>
  );
};

export default MainLayout;
