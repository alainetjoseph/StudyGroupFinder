import axios from "axios";
import { enqueueSnackbar } from "notistack";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      return enqueueSnackbar("Please fill all required fields", {
        variant: "error",
        anchorOrigin: { horizontal: "right", vertical: "bottom" }
      });
    }

    axios
      .post(`${import.meta.env.VITE_BACKEND_URL}/login`, { email, password }, { withCredentials: true })
      .then(() => navigate("/"))
      .catch((err) => console.log(err));
  }

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#05070a]">

      {/* LEFT PANEL */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between px-8 xl:px-16 py-12 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1761475145944-52df2def23e9?q=80&w=1080"
            className="w-full h-full object-cover brightness-[0.7] contrast-[1.6]"
            alt="Background"
          />
          <div className="absolute inset-0 bg-linear-to-tr from-[#05070a] via-transparent to-[#4338ca]/20" />
        </div>

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-2">
          <div className="p-1 border border-white/40 rounded bg-white/5 backdrop-blur-md">
            <span className="text-white text-lg">📖</span>
          </div>
          <span className="text-xl xl:text-2xl font-bold text-white">
            StudyGroupFinder
          </span>
        </div>

        {/* Hero */}
        <div className="relative z-10">
          <h1 className="text-3xl xl:text-5xl font-bold leading-tight text-white">
            Master your subjects with{" "}
            <span className="text-indigo-400">
              collaborative learning
            </span>
          </h1>

          <p className="mt-6 text-base xl:text-lg text-white/90 max-w-lg">
            Join thousands of students achieving better grades through group study.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            {["Smart Matching", "Real-time Chat", "Resource Sharing"].map((item) => (
              <span
                key={item}
                className="px-4 py-2 rounded-full border border-white/30 bg-white/10 backdrop-blur text-sm text-white"
              >
                ✓ {item}
              </span>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-xs text-white/60">
          © 2026 StudyConnect Platform
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 sm:px-10 py-10 bg-[#080a0f]">
        <div className="w-full max-w-md">

          {/* Heading */}
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Welcome back
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Enter your details to access your account
            </p>
          </div>

          {/* Form */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="text-sm font-medium text-gray-400">
                Email
              </label>
              <input
                type="email"
                placeholder="username@gmail.com"
                className="mt-2 w-full bg-[#11141b] border border-[#1f2937] rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500/50 outline-none transition"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <div className="flex justify-between text-sm">
                <label className="font-medium text-gray-400">
                  Password
                </label>
                <a href="#" className="text-indigo-400 hover:text-white">
                  Forgot?
                </a>
              </div>

              <input
                type="password"
                placeholder="Enter your password"
                className="mt-2 w-full bg-[#11141b] border border-[#1f2937] rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500/50 outline-none transition"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition active:scale-[0.98]">
              Sign In →
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-10">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-800"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-widest text-gray-500">
              <span className="bg-[#080a0f] px-3">
                Or
              </span>
            </div>
          </div>

          <p className="mt-10 text-center text-sm text-gray-500">
            Don't have an account?
            <a href="#" className="ml-1 text-indigo-400 hover:text-white">
              Create account
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
