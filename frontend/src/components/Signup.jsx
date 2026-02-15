import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate()
  const handleSubmit = (e) => {
    e.preventDefault();

    const form = {
      name,
      email,
      password,
      confirmPassword,
    }

    console.log("Form submitted:", form);
    if (form.name.trim() == "" ||
      form.email.trim() == "" ||
      form.password.trim() == "" ||
      form.confirmPassword.trim() == "") {
      return alert("please fill all the fields");
    }
    if (form.password != form.confirmPassword) {
      return alert("Incoorect Confirm Password");
    }
    delete form.confirmPassword
    axios.post("http://localhost:3000/signup", form, {
      withCredentials: true
    }).then(() => {
      console.log("signup successful !!");
      navigate("/login");
    })
      .catch((err) => {
        console.error("SignupErr", err)
        return alert("something went wrong");
      })
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#05070a]">

      {/* LEFT PANEL */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between overflow-hidden px-8 py-12 xl:px-16 xl:py-20">

        {/* Background */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1761475145944-52df2def23e9?q=80&w=1080"
            alt="Background"
            className="w-full h-full object-cover brightness-[0.65] contrast-[1.4]"
          />
          <div className="absolute inset-0 bg-linear-to-tr from-[#05070a] via-transparent to-indigo-700/20" />
        </div>

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-2">
          <div className="p-2 border border-white/30 rounded bg-white/5 backdrop-blur-md">
            <span className="text-white text-lg">📖</span>
          </div>
          <span className="text-2xl font-bold tracking-tight text-white">
            StudyGroupFinder
          </span>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-xl">
          <h1 className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-bold leading-tight tracking-tight text-white">
            Start your journey with{" "}
            <span className="text-indigo-400">peer learning</span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-white/90 leading-relaxed">
            Create an account to join thousands of students achieving better
            grades by studying together.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            {["Smart Matching", "Real-time Chat", "Resource Sharing"].map(
              (item) => (
                <span
                  key={item}
                  className="px-4 py-2 rounded-full border border-white/30 bg-white/10 backdrop-blur-xl text-sm font-medium text-white"
                >
                  ✓ {item}
                </span>
              )
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-sm text-white/70 flex gap-4 flex-wrap">
          <span>© 2026 StudyConnect</span>
          <a href="#" className="hover:text-white transition">
            Privacy
          </a>
          <a href="#" className="hover:text-white transition">
            Terms
          </a>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 sm:px-8 lg:px-12 xl:px-16">
        <div className="w-full max-w-md sm:max-w-lg space-y-6 sm:space-y-8">

          {/* Mobile Header */}
          <div className="lg:hidden text-center">
            <h2 className="text-2xl font-bold text-white">
              Join StudyGroupFinder
            </h2>
            <p className="text-gray-400 mt-2 text-sm">
              Learn smarter with peers
            </p>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Create an account
            </h1>
            <p className="text-gray-400">
              Enter your details to get started
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">
                Full Name
              </label>
              <input
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#11141b] border border-[#1f2937] rounded-xl px-4 py-3.5 sm:py-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition"
                required
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">
                Email
              </label>
              <input
                type="email"
                placeholder="johndoe@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#11141b] border border-[#1f2937] rounded-xl px-4 py-3.5 sm:py-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition"
                required
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#11141b] border border-[#1f2937] rounded-xl px-4 py-3.5 sm:py-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition"
                required
              />
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-[#11141b] border border-[#1f2937] rounded-xl px-4 py-3.5 sm:py-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition"
                required
              />
            </div>

            {/* Terms */}
            <div className="flex items-start gap-2 text-sm">
              <input
                type="checkbox"
                className="mt-1 rounded border-gray-600 bg-[#11141b]"
                required
              />
              <span className="text-gray-400">
                I agree to the{" "}
                <a href="#" className="text-indigo-400 hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-indigo-400 hover:underline">
                  Privacy Policy
                </a>
              </span>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700 transition active:scale-[0.98]"
            >
              Create Account
            </button>
          </form>

          {/* Login Redirect */}
          <p className="text-center text-sm text-gray-400">
            Already have an account?{" "}
            <button
              onClick={() => navigate?.("/login")}
              className="font-semibold text-indigo-400 hover:underline"
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
