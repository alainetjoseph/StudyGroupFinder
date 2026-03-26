import axios from "axios";
import { enqueueSnackbar } from "notistack";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { token } = useParams();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    if (!password || !confirmPassword) {
      return enqueueSnackbar("Please fill all fields", {
        variant: "error",
        anchorOrigin: { horizontal: "right", vertical: "bottom" }
      });
    }

    if (password !== confirmPassword) {
      return enqueueSnackbar("Passwords do not match", {
        variant: "error",
        anchorOrigin: { horizontal: "right", vertical: "bottom" }
      });
    }

    if (password.length < 6) {
      return enqueueSnackbar("Password must be at least 6 characters", {
        variant: "error",
        anchorOrigin: { horizontal: "right", vertical: "bottom" }
      });
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/reset-password/${token}`,
        { password },
        { withCredentials: true }
      );
      
      enqueueSnackbar(response.data.msg, { 
        variant: "success", 
        anchorOrigin: { horizontal: "right", vertical: "bottom" } 
      });
      
      navigate("/login");
    } catch (err) {
      console.log(err);
      enqueueSnackbar(
        err.response?.data?.msg || "Invalid or expired token.", 
        { variant: "error", anchorOrigin: { horizontal: "right", vertical: "bottom" } }
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-background">
      {/* LEFT PANEL */}
      <div className="hidden lg:flex w-1/2 relative flex-col justify-between p-16 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1761475145944-52df2def23e9?q=80&w=1080"
            className="w-full h-full object-cover brightness-[0.70] contrast-[1.6]"
            alt="Background"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-bg-primary via-transparent to-primary/20" />
        </div>

        <div className="relative z-10 flex items-center gap-2">
          <div className="p-1 border border-border rounded bg-card backdrop-blur-md">
            <span className="text-foreground text-lg">📖</span>
          </div>
          <span className="text-2xl font-bold tracking-tight text-foreground">
            StudyGroupFinder
          </span>
        </div>

        <div className="relative z-10">
          <h1 className="text-[54px] font-bold leading-[1.1] text-foreground tracking-tighter">
            Choose a <br />
            <span className="text-primary">
              strong password.
            </span>
          </h1>
          <p className="mt-8 text-xl text-foreground/90 font-normal leading-relaxed max-w-lg">
            Make sure it's something secure that you haven't used elsewhere.
          </p>
        </div>

        <div className="relative z-10 text-[13px] font-medium text-muted-foreground">
          <div className="flex items-center gap-6">
            <span>© 2026 StudyConnect Platform</span>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 sm:px-10 py-10 bg-background">
        <div className="w-full max-w-md">
          {/* Heading */}
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
              Reset Password
            </h2>
            <p className="mt-2 text-sm text-muted">
              Enter and confirm your new password below.
            </p>
          </div>

          {/* Form */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                New Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="mt-2 w-full bg-input-background border border-border rounded-xl px-4 py-3 text-foreground focus:ring-2 placeholder-[var(--color-text-muted)]/60 focus:ring-[var(--color-accent-primary)]/50 outline-none transition"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Confirm New Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="mt-2 w-full bg-input-background border border-border rounded-xl px-4 py-3 text-foreground focus:ring-2 placeholder-[var(--color-text-muted)]/60 focus:ring-[var(--color-accent-primary)]/50 outline-none transition"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <button 
              disabled={loading}
              className="w-full py-3 bg-linear-to-r from-primary to-primary-hover text-foreground font-semibold rounded-xl transition active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2" 
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Resetting Password...
                </>
              ) : "Reset Password →"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
