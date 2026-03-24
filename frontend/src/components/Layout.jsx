import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const Layout = () => {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background text-foreground font-sans overflow-x-hidden">
      {/* Mobile Navbar */}
      <Navbar />

      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto max-w-full">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
