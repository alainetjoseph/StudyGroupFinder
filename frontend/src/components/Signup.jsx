import { useState } from "react";
const Signup = () => {


  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted");
    const from = {
      name,
      email,
      password,
      confirmPassword
    }
    console.log("form: \n", from)
    return
  };

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");







  return (
    <div className="h-screen w-screen flex m-0 p-0 overflow-hidden bg-[#05070a]">

      {/* LEFT PANEL */}
      <div className="hidden lg:flex w-1/2 relative flex-col justify-between p-16 overflow-hidden">
        {/* Background Image with Darker Contrast Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1761475145944-52df2def23e9?q=80&w=1080"
            className="w-full h-full object-cover brightness-[0.70] contrast-[1.6]"
            alt="Background"
          />
          {/* Deep Blue-Purple Gradient for Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-tr from-[#05070a] via-transparent to-[#4338ca]/20" />
        </div>

        {/* Top Logo */}
        <div className="relative z-10 flex items-center gap-2">
          <div className="p-1 border border-white/40 rounded bg-white/5 backdrop-blur-md">
            <span className="text-white text-lg">📖</span>
          </div>
          <span className="text-2xl font-bold tracking-tight text-white">StudyGroupFinder</span>
        </div>

        {/* Hero Text */}
        <div className="relative z-10">
          <h1 className="text-[54px] font-bold leading-[1.1] text-white tracking-tighter">
            Start your journey with <br />
            <span className="text-indigo-400">
              peer learning
            </span>
          </h1>

          <p className="mt-8 text-xl text-white/90 font-normal leading-relaxed max-w-lg">
            Create an account to join thousands of students who are achieving better grades by studying together.
          </p>

          {/* Feature Chips: Higher contrast border */}
          <div className="mt-12 flex flex-wrap gap-4">
            {['Smart Matching', 'Real-time Chat', 'Resource Sharing'].map((item) => (
              <span key={item} className="px-5 py-2.5 rounded-full border border-white/30 bg-white/10 backdrop-blur-xl text-sm font-semibold text-white flex items-center gap-2">
                ✓ {item}
              </span>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-[13px] font-medium text-[oklch(0.87_0.065_274.039)]">
          <div className="flex items-center gap-6">
            <span>© 2026 StudyConnect Platform</span>
            <span className="opacity-60">•</span>
            <a href="#" className="hover:underline">Privacy</a>
            <span className="opacity-60">•</span>
            <a href="#" className="hover:underline">Terms</a>
          </div>
        </div>
      </div>


      {/* Right Panel - Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12 xl:p-16">
        <div className="w-full max-w-[440px] space-y-8">

          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              Create an account
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Enter your details to get started
            </p>
          </div>


          <form onSubmit={handleSubmit} className="space-y-5">

            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#9ca3af]">Full Name</label>
              <input
                type="text"
                placeholder="John Doe"
                className="w-full bg-[#11141b] border border-[#1f2937] rounded-xl px-4 py-3.5 text-white placeholder-[#4b5563] focus:outline-none focus:ring-2 focus:ring-[#6366f1]/50 transition-all"
                value={name}
                onChange={(e) => { setName(e.target.value) }}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#9ca3af]">Email</label>
              <input
                type="email"
                placeholder="johndoe@gmail.com"
                className="w-full bg-[#11141b] border border-[#1f2937] rounded-xl px-4 py-3.5 text-white placeholder-[#4b5563] focus:outline-none focus:ring-2 focus:ring-[#6366f1]/50 transition-all"
                value={email}
                onChange={(e) => { setEmail(e.target.value) }}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#9ca3af]">Password</label>
              <input
                type="password"
                placeholder="password"
                className="w-full bg-[#11141b] border border-[#1f2937] rounded-xl px-4 py-3.5 text-white placeholder-[#4b5563] focus:outline-none focus:ring-2 focus:ring-[#6366f1]/50 transition-all"
                value={password}
                onChange={(e) => { setPassword(e.target.value) }}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#9ca3af]">Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm Password"
                className="w-full bg-[#11141b] border border-[#1f2937] rounded-xl px-4 py-3.5 text-white placeholder-[#4b5563] focus:outline-none focus:ring-2 focus:ring-[#6366f1]/50 transition-all"
                value={confirmPassword}
                onChange={(e) => { setConfirmPassword(e.target.value) }}
              />
            </div>

            <div className="flex items-start gap-2 text-sm">
              <input
                type="checkbox"
                className="mt-1 rounded border-gray-300 dark:border-gray-600"
                required
              />
              <span className="text-gray-600 dark:text-gray-400">
                I agree to the{" "}
                <a href="#" className="text-indigo-600 hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-indigo-600 hover:underline">
                  Privacy Policy
                </a>
              </span>
            </div>

            {/* You probably also need a submit button */}
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              Create Account
            </button>
          </form>
          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <button
              onClick={() => onNavigate('login')}
              className="font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 hover:underline transition-all"
            >
              Sign in
            </button>
          </p>

        </div>
      </div>
    </div>



  );
}

export default Signup
