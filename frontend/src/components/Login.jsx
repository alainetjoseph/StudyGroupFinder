
export default function Login() {
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
            Master your subjects with <br />
            <span className="text-indigo-400">
              collaborative learning
            </span>
          </h1>

          <p className="mt-8 text-xl text-white/90 font-normal leading-relaxed max-w-lg">
            Join thousands of students who are achieving better grades by studying together.
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

      {/* RIGHT PANEL: Deep Obsidian/Dark Grey Contrast */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-[#080a0f]">
        <div className="w-full max-w-[400px]">

          <div className="mb-10">
            <h2 className="text-[34px] font-bold text-white tracking-tight">Welcome back</h2>
            <p className="mt-2 text-[#6b7280] text-sm">Enter your details to access your account</p>
          </div>

          <form className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#9ca3af]">Email</label>
              <input
                type="email"
                placeholder="username@gmail.com"
                className="w-full bg-[#11141b] border border-[#1f2937] rounded-xl px-4 py-3.5 text-white placeholder-[#4b5563] focus:outline-none focus:ring-2 focus:ring-[#6366f1]/50 transition-all"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-[#9ca3af]">Password</label>
                <a href="#" className="text-sm text-[#818cf8] hover:text-white font-medium transition-colors">Forgot password?</a>
              </div>
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full bg-[#11141b] border border-[#1f2937] rounded-xl px-4 py-3.5 text-white placeholder-[#4b5563] focus:outline-none focus:ring-2 focus:ring-[#6366f1]/50 transition-all"
              />
            </div>

            {/* Vibrant Action Button */}
            <button className="w-full py-4 bg-[#6366f1] hover:bg-[#4f46e5] text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(99,102,241,0.2)] active:scale-[0.98] mt-2">
              Sign In <span className="text-lg">→</span>
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-12">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#1f2937]"></div></div>
            <div className="relative flex justify-center text-[10px] font-black tracking-[0.25em] text-[#4b5563] uppercase">
              <span className="bg-[#080a0f] px-4">Or continue with demo</span>
            </div>
          </div>

          {/* Demo Cards */}
          <div className="grid grid-cols-2 gap-4">
            <button className="border border-[#1f2937] bg-[#11141b]/50 rounded-2xl py-6 hover:bg-[#11141b] transition-all flex flex-col items-center">
              <span className="text-white font-bold">Student</span>
              <span className="text-[10px] text-[#6b7280] font-black mt-1 tracking-widest">VIEW DASHBOARD</span>
            </button>
            <button className="border border-[#1f2937] bg-[#11141b]/50 rounded-2xl py-6 hover:bg-[#11141b] transition-all flex flex-col items-center">
              <span className="text-white font-bold">Admin</span>
              <span className="text-[10px] text-[#6b7280] font-black mt-1 tracking-widest">VIEW ANALYTICS</span>
            </button>
          </div>

          <p className="mt-12 text-center text-[#4b5563] text-sm font-medium">
            Don't have an account? <a href="#" className="text-[#818cf8] font-bold hover:text-white transition-colors ml-1">Create account</a>
          </p>
        </div>
      </div>
    </div>
  );
}
