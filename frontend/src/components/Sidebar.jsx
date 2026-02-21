import {
  LayoutDashboardIcon,
  LogOut,
  PlusCircle,
  Search,
  Settings,
  User
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const items = [
    { label: "Dashboard", path: "/", icon: LayoutDashboardIcon },
    { label: "Find Groups", path: "/findgroup", icon: Search },
    { label: "Create Group", path: "/creategroup", icon: PlusCircle },
    { label: "Profile", path: "/profile", icon: User },
    { label: "Settings", path: "/settings", icon: Settings }
  ];

  function SidebarItem({ icon: Icon, label, path }) {
    const active = location.pathname === path;
    return (
      <div
        onClick={() => navigate(path)}
        className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition ${active
          ? "bg-indigo-900/40 text-indigo-400"
          : "text-gray-400 hover:bg-gray-800 hover:text-white"
          }`}
      >
        <Icon size={18} />
        <span className="font-medium">{label}</span>
      </div>
    );
  }

  const handleLogout = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/logout`, {
        method: "POST",
        credentials: "include"
      });

      const data = await res.json();

      if (data.status) {
        window.location.href = "/login";
      }
    } catch (err) {
      console.log("Logout error:", err);
    }
  };
  return (
    <aside className="w-72 bg-[#111827] border-r border-gray-800 flex flex-col justify-between p-6 lg:block sm:hidden">
      {/* Logo */}
      <div>
        <div className="mb-10">
          <h1 className="text-2xl font-bold text-indigo-400">
            StudyGroup
          </h1>
          <p className="text-xs text-gray-500">
            Find your study tribe
          </p>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          {items.map((item) => (
            <SidebarItem
              key={item.path}
              icon={item.icon}
              label={item.label}
              path={item.path}
            />
          ))}
        </nav>
      </div>

      {/* Logout */}
      <div className="pt-6 border-t border-gray-800">
        <div className="flex items-center gap-3 p-3 rounded-lg text-red-400 hover:bg-red-900/10 cursor-pointer transition"
          onClick={handleLogout}>
          <LogOut size={18} />
          <span>Logout</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
