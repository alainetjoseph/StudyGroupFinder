import {
  LayoutDashboardIcon,
  LogOut,
  PlusCircle,
  Search,
  Settings,
  User,
  ShieldCheck,
  Activity,
  AlertTriangle,
  Bot,
  History
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isAdminPath = location.pathname.startsWith("/admin");

  const userItems = [
    { label: "Dashboard", path: "/", icon: LayoutDashboardIcon },
    { label: "Find Groups", path: "/findgroup", icon: Search },
    { label: "Create Group", path: "/creategroup", icon: PlusCircle },
    { label: "AI Assistant", path: "/ai", icon: Bot },
    { label: "Profile", path: "/profile", icon: User },
    { label: "Settings", path: "/settings", icon: Settings }
  ];

  const adminItems = [
    { label: "Admin Panel", path: "/admin", icon: ShieldCheck },
    { label: "Platform Stats", path: "/admin/stats", icon: Activity },
    { label: "Activity Logs", path: "/admin/logs", icon: History },
    { label: "Standard View", path: "/", icon: LayoutDashboardIcon }
  ];

  const items = isAdminPath ? adminItems : userItems;

  function SidebarItem({ icon: Icon, label, path }) {
    const active = location.pathname === path;
    return (
      <div
        onClick={() => navigate(path)}
        className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition ${active
          ? "bg-primary/20 text-primary"
          : "text-muted hover:bg-card hover:text-foreground"
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
    <aside className="w-72 bg-sidebar border-r border-border md:flex flex-col justify-between p-6 hidden">
      {/* Logo */}
      <div>
        <div className="mb-10">
          <h1 className="text-2xl font-bold text-primary">
            Study Group Finder
          </h1>
          <p className="text-xs text-muted">
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
      <div className="pt-6 border-t border-border">
        <div className="flex items-center gap-3 p-3 rounded-lg text-destructive hover:bg-destructive/10 cursor-pointer transition"
          onClick={handleLogout}>
          <LogOut size={18} />
          <span>Logout</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
