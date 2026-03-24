import { Moon, Sun, Lock } from "lucide-react";
import { useState } from "react";
import { useTheme } from "../contexts/ThemeContext";

export default function Settings() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  
  const { theme, setTheme } = useTheme();

  const storedUser = JSON.parse(sessionStorage.getItem("user") || "{}");

  /* ================= HANDLE PASSWORD UPDATE ================= */
  const handleChangePassword = async () => {
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
    <div className="w-full max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
        <p className="text-muted-foreground text-sm">
          Manage your account preferences
        </p>
      </div>

      <div className="space-y-6">
        
        {/* ================= APPEARANCE ================= */}
        <div className="bg-card border border-border rounded-xl p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <Moon size={20} className="text-foreground" />
            <h2 className="text-xl font-semibold text-foreground">Appearance</h2>
          </div>
          
          <div className="space-y-4">
            <label className="block text-sm text-muted-foreground">
              Theme
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setTheme("light")}
                className={`flex flex-col items-center justify-center gap-2 p-6 rounded-xl border transition-all ${
                  theme === "light" 
                    ? "border-primary bg-accent-soft text-foreground" 
                    : "border-border hover:border-border-muted text-muted-foreground bg-input-background hover:bg-card-elevated"
                }`}
              >
                <Sun size={24} />
                <span className="font-medium">Light</span>
              </button>
              <button
                onClick={() => setTheme("dark")}
                className={`flex flex-col items-center justify-center gap-2 p-6 rounded-xl border transition-all ${
                  theme === "dark" 
                    ? "border-primary bg-accent-soft text-foreground" 
                    : "border-border hover:border-border-muted text-muted-foreground bg-input-background hover:bg-card-elevated"
                }`}
              >
                <Moon size={24} />
                <span className="font-medium">Dark</span>
              </button>
            </div>
          </div>
        </div>

        {/* ================= CHANGE PASSWORD ================= */}
        <div className="bg-card border border-border rounded-xl p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <Lock size={20} className="text-foreground" />
            <h2 className="text-xl font-semibold text-foreground">Change Password</h2>
          </div>

          <div className="space-y-5">
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

            <div className="pt-4">
              <button
                disabled={loading}
                onClick={handleChangePassword}
                className="w-full sm:w-auto bg-gradient-primary hover:opacity-90 text-white px-8 py-3 rounded-lg font-medium transition shadow-primary-glow active:scale-95 disabled:opacity-50"
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
    <div className="space-y-2">
      <label className="block text-sm text-foreground">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className="w-full bg-input-background border border-border rounded-lg px-4 py-3 text-foreground placeholder-text-muted focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors"
      />
    </div>
  );
}
