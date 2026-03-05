import React, { useState } from "react";
import { Moon, Sun, Lock } from "lucide-react";
import Sidebar from "./Sidebar";

export default function Settings() {
  /* ================= USER ================= */
  const storedUser = JSON.parse(sessionStorage.getItem("user"));

  /* ================= STATE ================= */
  const [theme, setTheme] = useState("dark");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);

  /* ================= HANDLE PASSWORD UPDATE ================= */
  const handleChangePassword = async () => {
    console.log(storedUser)
    if (!currentPassword || !newPassword || !confirmPassword) {
      return alert("All fields are required");
    }

    if (newPassword !== confirmPassword) {
      return alert("Passwords do not match");
    }

    if (!storedUser?._id) {
      return alert("User not found");
    }

    try {
      setLoading(true);

      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/change-password/${storedUser._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "include",
          body: JSON.stringify({
            currentPassword,
            newPassword
          })
        }
      );

      const data = await res.json();

      if (!res.ok) {
        return alert(data.message || "Failed to update password");
      }

      alert("Password updated successfully");

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1220] text-white flex">
      {/* Sidebar handles mobile + desktop internally */}
      <Sidebar />

      {/* ================= MAIN ================= */}
      <main className="flex-1 min-h-screen flex justify-center py-16 bg-gradient-to-br from-[#0B1220] via-[#0E1626] to-[#0B1220]">
        <div className="w-full max-w-4xl px-6">

          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-3">Settings</h1>
            <p className="text-gray-400 text-lg">
              Manage your account preferences
            </p>
          </div>

          <div className="space-y-12">

            {/* ================= APPEARANCE ================= */}
            <div className="bg-[#182235] border border-gray-700 rounded-2xl p-6 shadow-xl max-w-2xl">
              <div className="flex items-center gap-3 mb-6">
                <Moon size={18} />
                <h2 className="text-xl font-semibold">Appearance</h2>
              </div>

              <p className="text-gray-400 mb-4 text-sm">Theme</p>

              <div className="grid grid-cols-2 gap-4">
                {/* Light */}
                <div
                  onClick={() => setTheme("light")}
                  className={`cursor-pointer rounded-xl p-6 border transition-all duration-300 ${theme === "light"
                    ? "border-indigo-500 bg-indigo-500/10"
                    : "border-gray-700 hover:border-gray-600"
                    }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <Sun size={22} />
                    <span className="text-sm font-medium">Light</span>
                  </div>
                </div>

                {/* Dark */}
                <div
                  onClick={() => setTheme("dark")}
                  className={`cursor-pointer rounded-xl p-6 border transition-all duration-300 ${theme === "dark"
                    ? "border-indigo-500 bg-indigo-500/10"
                    : "border-gray-700 hover:border-gray-600"
                    }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <Moon size={22} />
                    <span className="text-sm font-medium">Dark</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ================= CHANGE PASSWORD ================= */}
            <div className="bg-[#182235] border border-gray-700 rounded-2xl p-10 shadow-xl">
              <div className="flex items-center gap-3 mb-8">
                <Lock size={22} />
                <h2 className="text-2xl font-semibold">Change Password</h2>
              </div>

              <div className="space-y-6">

                <InputField
                  label="Current Password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />

                <InputField
                  label="New Password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />

                <InputField
                  label="Confirm New Password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />

                <div className="pt-6 flex justify-end">
                  <button
                    disabled={loading}
                    onClick={handleChangePassword}
                    className="bg-indigo-600 hover:bg-indigo-700 px-8 py-3 rounded-xl font-medium transition disabled:opacity-50"
                  >
                    {loading ? "Updating..." : "Update Password"}
                  </button>
                </div>

              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}

/* ================= INPUT COMPONENT ================= */
function InputField({ label, type, value, onChange }) {
  return (
    <div>
      <label className="block text-sm mb-2 text-gray-300">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className="w-full bg-[#111827] border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>
  );
}
