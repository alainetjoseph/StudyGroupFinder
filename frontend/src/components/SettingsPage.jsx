import { Moon, Sun, Lock } from "lucide-react";
import { useState } from "react";
// Sidebar is now handled by Layout

export default function Settings() {

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
    <div className="space-y-12 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-bold mb-3">Settings</h1>
        <p className="text-text-secondary text-sm md:text-lg">
          Manage your account preferences
        </p>
      </div>

      <div className="space-y-12">


        {/* ================= CHANGE PASSWORD ================= */}
        <div className="bg-bg-card border border-border-base rounded-3xl p-6 sm:p-10 shadow-xl">
          <div className="flex items-center gap-3 mb-8">
            <Lock size={24} className="text-accent-primary" />
            <h2 className="text-2xl font-bold">Security</h2>
          </div>

          <div className="space-y-6 max-w-xl">
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

            <div className="pt-6">
              <button
                disabled={loading}
                onClick={handleChangePassword}
                className="w-full sm:w-auto bg-accent-primary hover:bg-accent-hover px-10 py-3.5 rounded-xl font-bold transition shadow-lg shadow-accent-primary/20 active:scale-95 disabled:opacity-50"
              >
                {loading ? "Updating..." : "Update Password"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= INPUT COMPONENT ================= */
function InputField({ label, type, value, onChange }) {
  return (
    <div>
      <label className="block text-sm mb-2 text-text-secondary">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className="w-full bg-bg-secondary border border-border-base rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent-primary text-text-primary"
      />
    </div>
  );
}
