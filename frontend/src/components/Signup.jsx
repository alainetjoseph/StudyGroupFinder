import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { enqueueSnackbar } from "notistack";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = { name, email, password, confirmPassword };

    if (!form.name.trim() || !form.email.trim() || !form.password.trim() || !form.confirmPassword.trim()) {
      return enqueueSnackbar("Please fill all required fields", { variant: "error", anchorOrigin: { horizontal: "right", vertical: "bottom" } });
    }

    if (form.password !== form.confirmPassword) {
      return enqueueSnackbar("Passwords do not match", { variant: "error", anchorOrigin: { horizontal: "right", vertical: "bottom" } });
    }

    delete form.confirmPassword;
    setLoading(true);

    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/signup`, form, {
        withCredentials: true
      });
      enqueueSnackbar("Account created successfully! Please log in.", { variant: "success", anchorOrigin: { horizontal: "right", vertical: "bottom" } });
      navigate("/login");
    } catch (err) {
      console.error("SignupErr", err);
      enqueueSnackbar(err.response?.data?.message || err.response?.data?.error || "Failed to create account", { variant: "error", anchorOrigin: { horizontal: "right", vertical: "bottom" } });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-background">

      {/* LEFT PANEL */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between overflow-hidden px-8 py-12 xl:px-16 xl:py-20">

        {/* Background */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1761475145944-52df2def23e9?q=80&w=1080"
            alt="Background"
            className="w-full h-full object-cover brightness-[0.65] contrast-[1.4]"
          />
          <div className="absolute inset-0 bg-linear-to-tr from-bg-primary via-transparent to-primary/20" />
        </div>

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-2">
          <div className="p-2 border border-border rounded bg-card backdrop-blur-md">
            <span className="text-foreground text-lg">📖</span>
          </div>
          <span className="text-2xl font-bold tracking-tight text-foreground">
            StudyGroupFinder
          </span>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-xl">
          <h1 className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-bold leading-tight tracking-tight text-foreground">
            Start your journey with{" "}
            <span className="text-primary">peer learning</span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-foreground/90 leading-relaxed">
            Create an account to join thousands of students achieving better
            grades by studying together.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            {["Smart Matching", "Real-time Chat", "Resource Sharing"].map(
              (item) => (
                <span
                  key={item}
                  className="px-4 py-2 rounded-full border border-text-primary/30 bg-text-primary/10 backdrop-blur-xl text-sm font-medium text-foreground"
                >
                  ✓ {item}
                </span>
              )
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-sm text-muted flex gap-4 flex-wrap">
          <span>© 2026 StudyConnect</span>
          <a href="#" className="hover:text-foreground transition">
            Privacy
          </a>
          <a href="#" className="hover:text-foreground transition">
            Terms
          </a>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 sm:px-8 lg:px-12 xl:px-16">
        <div className="w-full max-w-md sm:max-w-lg space-y-6 sm:space-y-8">

          {/* Mobile Header */}
          <div className="lg:hidden text-center">
            <h2 className="text-2xl font-bold text-foreground">
              Join StudyGroupFinder
            </h2>
            <p className="text-muted mt-2 text-sm">
              Learn smarter with peers
            </p>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Create an account
            </h1>
            <p className="text-muted-foreground">
              Enter your details to get started
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Full Name
              </label>
              <input
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-input-background border border-border rounded-xl px-4 py-3.5 sm:py-4 text-foreground placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-primary)]/50 transition"
                required
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Email
              </label>
              <input
                type="email"
                placeholder="johndoe@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-input-background border border-border rounded-xl px-4 py-3.5 sm:py-4 text-foreground placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-primary)]/50 transition"
                required
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-input-background border border-border rounded-xl px-4 py-3.5 sm:py-4 text-foreground placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-primary)]/50 transition"
                required
              />
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-input-background border border-border rounded-xl px-4 py-3.5 sm:py-4 text-foreground placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-primary)]/50 transition"
                required
              />
            </div>

            {/* Terms */}
            <div className="flex items-start gap-2 text-sm">
              <input
                type="checkbox"
                className="mt-1 rounded border-border bg-input-background"
                required
              />
              <span className="text-muted-foreground">
                I agree to the{" "}
                <a href="#" className="text-primary hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-primary hover:underline">
                  Privacy Policy
                </a>
              </span>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-foreground py-3 rounded-xl font-medium hover:bg-primary-hover transition active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Account...
                </>
              ) : "Create Account"}
            </button>
          </form>

          {/* Login Redirect */}
          <p className="text-center text-sm text-muted">
            Already have an account?{" "}
            <button
              onClick={() => navigate?.("/login")}
              className="font-semibold text-primary hover:underline"
            >
              Sign in
            </button>
          </p>

        </div>
      </div>
    </div>
  );
};

export default Signup;
