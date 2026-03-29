import { useState, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  LayoutDashboardIcon,
  Search,
  PlusCircle,
  User,
  Settings,
  LogOut,
  ShieldCheck,
  Activity,
  AlertTriangle,
  Bot,
  History
} from "lucide-react";
import { AuthContext } from "../contexts/AuthContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user } = useContext(AuthContext);

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
    <nav className="md:hidden bg-sidebar border-b border-border sticky top-0 z-50">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link to="/" className="flex flex-col">
          <span className="text-xl font-bold text-primary">Study Group Finder</span>
          <span className="text-[10px] text-muted">Find your study tribe</span>
        </Link>

        {/* Hamburger Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-muted hover:text-foreground transition-colors"
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-0 top-[60px] bg-sidebar transition-transform duration-300 ease-in-out z-40 ${isOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <div className="flex flex-col h-full p-6">
          <div className="space-y-4 flex-1">
            {items.map((item) => {
              const active = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-4 p-4 rounded-xl transition ${active
                    ? "bg-primary/20 text-primary"
                    : "text-muted hover:bg-card hover:text-foreground"
                    }`}
                >
                  <Icon size={20} />
                  <span className="font-medium text-lg">{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Logout Section */}
          <div className="pt-6 border-t border-border">
            <button
              onClick={handleLogout}
              className="flex items-center gap-4 p-4 rounded-xl text-destructive hover:bg-destructive/10 w-full transition"
            >
              <LogOut size={20} />
              <span className="font-medium text-lg">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
