import React, { useState } from "react";
import {
  LayoutDashboard,
  Settings,
  LogOut,
  Users,
  ShieldCheck,
  AlertTriangle,
  TrendingUp,
  Search,
  Ban,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export default function AdminHome() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("users");

  const menuItems = [
    { label: "Admin Dashboard", icon: LayoutDashboard, path: "/admin" },
    { label: "Settings", icon: Settings, path: "/admin/settings" },
  ];

  const users = [
    {
      name: "John Smith",
      email: "john@university.edu",
      groups: 5,
      status: "active",
      joined: "Jan 10, 2026",
    },
    {
      name: "Sarah Johnson",
      email: "sarah@university.edu",
      groups: 8,
      status: "active",
      joined: "Jan 8, 2026",
    },
    {
      name: "Michael Chen",
      email: "michael@university.edu",
      groups: 3,
      status: "active",
      joined: "Jan 5, 2026",
    },
    {
      name: "Emily Davis",
      email: "emily@university.edu",
      groups: 6,
      status: "suspended",
      joined: "Jan 3, 2026",
    },
  ];

  return (
    <div className="flex h-screen bg-[#0f172a] text-white">
      
      {/* ================= SIDEBAR ================= */}
      <div className="fixed left-0 top-0 h-screen w-64 bg-[#1e293b] border-r border-gray-800 flex flex-col justify-between">

        {/* Logo */}
        <div>
          <div className="p-6 border-b border-gray-800">
            <h1 className="text-xl font-bold text-indigo-400">
              StudyGroup
            </h1>
            <p className="text-xs text-gray-400">
              Find your study tribe
            </p>
          </div>

          {/* Menu */}
          <div className="p-4 space-y-2">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <button
                  key={index}
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition ${
                    isActive
                      ? "bg-indigo-600 text-white"
                      : "text-gray-400 hover:bg-gray-800 hover:text-white"
                  }`}
                >
                  <Icon size={18} />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Logout */}
        <div className="p-4 border-t border-gray-800">
          <button
            onClick={() => {
              localStorage.removeItem("user");
              navigate("/login");
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>

      {/* ================= MAIN CONTENT ================= */}
      <div className="flex-1 ml-64 overflow-y-auto p-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-400">
            Monitor and manage the platform
          </p>
        </div>

        {/* ===== Stats Cards ===== */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

          <StatCard
            icon={<Users size={28} />}
            title="Total Users"
            value="1,234"
            color="bg-indigo-500/20 text-indigo-400"
          />

          <StatCard
            icon={<ShieldCheck size={28} />}
            title="Active Groups"
            value="156"
            color="bg-green-500/20 text-green-400"
          />

          <StatCard
            icon={<AlertTriangle size={28} />}
            title="Pending Reports"
            value="7"
            color="bg-red-500/20 text-red-400"
          />

        </div>

        {/* ===== Tabs ===== */}
        <div className="bg-[#1e293b] rounded-xl p-2 flex mb-6">
          <TabButton
            active={activeTab === "users"}
            onClick={() => setActiveTab("users")}
            label="User Management"
          />
          <TabButton
            active={activeTab === "groups"}
            onClick={() => setActiveTab("groups")}
            label="Group Moderation"
          />
          <TabButton
            active={activeTab === "reports"}
            onClick={() => setActiveTab("reports")}
            label="Reports"
          />
        </div>

        {/* ===== USERS TABLE ===== */}
        {activeTab === "users" && (
          <div className="bg-[#1e293b] rounded-xl p-6">

            {/* Search */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search users..."
                className="w-full bg-[#0f172a] border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-gray-400 border-b border-gray-700">
                  <tr>
                    <th className="text-left py-3">User</th>
                    <th className="text-left py-3">Email</th>
                    <th className="text-left py-3">Groups</th>
                    <th className="text-left py-3">Status</th>
                    <th className="text-left py-3">Joined</th>
                    <th className="text-left py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-800 hover:bg-[#0f172a]"
                    >
                      <td className="py-4 font-medium">{user.name}</td>
                      <td className="py-4 text-gray-400">{user.email}</td>
                      <td className="py-4">{user.groups}</td>
                      <td className="py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            user.status === "active"
                              ? "bg-green-500/20 text-green-400"
                              : "bg-red-500/20 text-red-400"
                          }`}
                        >
                          {user.status}
                        </span>
                      </td>
                      <td className="py-4 text-gray-400">{user.joined}</td>
                      <td className="py-4">
                        <button className="text-red-400 hover:text-red-600">
                          <Ban size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}

/* ================= REUSABLE COMPONENTS ================= */

function StatCard({ icon, title, value, growth, color }) {
  return (
    <div className="bg-[#1e293b] rounded-xl p-6 hover:scale-105 transition shadow-md">
      <div className="flex justify-between items-center mb-4">
        <div className={`p-3 rounded-lg ${color}`}>
          {icon}
        </div>
        <span className="text-green-400 text-sm font-medium">
          {growth}
        </span>
      </div>
      <h2 className="text-2xl font-bold">{value}</h2>
      <p className="text-gray-400 text-sm">{title}</p>
    </div>
  );
}

function TabButton({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
        active
          ? "bg-indigo-600 text-white"
          : "text-gray-400 hover:text-white"
      }`}
    >
      {label}
    </button>
  );
}