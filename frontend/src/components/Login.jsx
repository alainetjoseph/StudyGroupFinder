// import axios from "axios";
// import { enqueueSnackbar } from "notistack";
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
//
// export default function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();
//
//   function handleSubmit(e) {
//     e.preventDefault();
//
//     if (!email.trim() || !password.trim()) {
//       return enqueueSnackbar("Please fill all required fields", {
//         variant: "error",
//         anchorOrigin: { horizontal: "right", vertical: "bottom" }
//       });
//     }
//
//     axios
//       .post(`${import.meta.env.VITE_BACKEND_URL}/login`, { email, password }, { withCredentials: true })
//       .then(() => navigate("/"))
//       .catch((err) => console.log(err));
//   }
//
//   return (
//     <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#05070a]">
//
//       {/* LEFT PANEL */}
//       <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between px-8 xl:px-16 py-12 overflow-hidden">
//         <div className="absolute inset-0 z-0">
//           <img
//             src="https://images.unsplash.com/photo-1761475145944-52df2def23e9?q=80&w=1080"
//             className="w-full h-full object-cover brightness-[0.7] contrast-[1.6]"
//             alt="Background"
//           />
//           <div className="absolute inset-0 bg-linear-to-tr from-[#05070a] via-transparent to-[#4338ca]/20" />
//         </div>
//
//         {/* Logo */}
//         <div className="relative z-10 flex items-center gap-2">
//           <div className="p-1 border border-border rounded bg-card backdrop-blur-md">
//             <span className="text-foreground text-lg">📖</span>
//           </div>
//           <span className="text-xl xl:text-2xl font-bold text-foreground">
//             StudyGroupFinder
//           </span>
//         </div>
//
//         {/* Hero */}
//         <div className="relative z-10">
//           <h1 className="text-3xl xl:text-5xl font-bold leading-tight text-foreground">
//             Master your subjects with{" "}
//             <span className="text-primary">
//               collaborative learning
//             </span>
//           </h1>
//
//           <p className="mt-6 text-base xl:text-lg text-white/90 max-w-lg">
//             Join thousands of students achieving better grades through group study.
//           </p>
//
//           <div className="mt-10 flex flex-wrap gap-3">
//             {["Smart Matching", "Real-time Chat", "Resource Sharing"].map((item) => (
//               <span
//                 key={item}
//                 className="px-4 py-2 rounded-full border border-border bg-card backdrop-blur text-sm text-foreground"
//               >
//                 ✓ {item}
//               </span>
//             ))}
//           </div>
//         </div>
//
//         {/* Footer */}
//         <div className="relative z-10 text-xs text-white/60">
//           © 2026 StudyConnect Platform
//         </div>
//       </div>
//
//       {/* RIGHT PANEL */}
//       <div className="w-full lg:w-1/2 flex items-center justify-center px-6 sm:px-10 py-10 bg-[#080a0f]">
//         <div className="w-full max-w-md">
//
//           {/* Heading */}
//           <div className="mb-8">
//             <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
//               Welcome back
//             </h2>
//             <p className="mt-2 text-sm text-muted">
//               Enter your details to access your account
//             </p>
//           </div>
//
//           {/* Form */}
//           <form className="space-y-5" onSubmit={handleSubmit}>
//             <div>
//               <label className="text-sm font-medium text-muted-foreground">
//                 Email
//               </label>
//               <input
//                 type="email"
//                 placeholder="username@gmail.com"
//                 className="mt-2 w-full bg-[#11141b] border border-[#1f2937] rounded-xl px-4 py-3 text-foreground focus:ring-2 focus:ring-indigo-500/50 outline-none transition"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//               />
//             </div>
//
//             <div>
//               <div className="flex justify-between text-sm">
//                 <label className="font-medium text-muted-foreground">
//                   Password
//                 </label>
//                 <a href="#" className="text-primary hover:text-foreground">
//                   Forgot?
//                 </a>
//               </div>
//
//               <input
//                 type="password"
//                 placeholder="Enter your password"
//                 className="mt-2 w-full bg-[#11141b] border border-[#1f2937] rounded-xl px-4 py-3 text-foreground focus:ring-2 focus:ring-indigo-500/50 outline-none transition"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//               />
//             </div>
//
//             <button className="w-full py-3 bg-primary hover:bg-primary-hover text-foreground font-semibold rounded-xl transition active:scale-[0.98]" >
//               Sign In →
//             </button>
//           </form>
//
//           {/* Divider */}
//           <div className="relative my-10">
//             <div className="absolute inset-0 flex items-center">
//               <div className="w-full border-t border-border"></div>
//             </div>
//             <div className="relative flex justify-center text-xs uppercase tracking-widest text-muted">
//               <span className="bg-[#080a0f] px-3">
//                 Or
//               </span>
//             </div>
//           </div>
//
//           <p className="mt-10 text-center text-sm text-muted">
//             Don't have an account?
//             <a href="/signup" className="ml-1 text-primary hover:text-foreground">
//               Create account
//             </a>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }
import axios from "axios";
import { enqueueSnackbar } from "notistack";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const redirectPath = searchParams.get("redirect") || "/";

  async function handleSubmit(e) {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      return enqueueSnackbar("Please fill all required fields", {
        variant: "error",
        anchorOrigin: { horizontal: "right", vertical: "bottom" }
      });
    }

    setLoading(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/login`,
        { email, password },
        { withCredentials: true }
      );
      navigate(redirectPath);
    } catch (err) {
      console.log(err);
      enqueueSnackbar(
        err.response?.data?.message || err.response?.data?.error || "Login failed, please check your credentials.", 
        { variant: "error", anchorOrigin: { horizontal: "right", vertical: "bottom" } }
      );
    } finally {
      setLoading(false);
    }
  }

  /* ================= GOOGLE LOGIN (NEW CODE) ================= */

  const handleGoogleLogin = async () => {
    try {
      setGoogleLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      console.log("Google user:", user);

      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/google-login`,
        {
          name: user.displayName,
          email: user.email
        },
        { withCredentials: true }
      );

      navigate(redirectPath);

    } catch (error) {
      console.log(error);
      if (error.code !== "auth/popup-closed-by-user") {
        enqueueSnackbar(error.message || "Google Authentication failed", { 
          variant: "error", anchorOrigin: { horizontal: "right", vertical: "bottom" } 
        });
      }
    } finally {
      setGoogleLoading(false);
    }
  };

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
            Master your subjects with <br />
            <span className="text-primary">
              collaborative learning
            </span>
          </h1>

          <p className="mt-8 text-xl text-foreground/90 font-normal leading-relaxed max-w-lg">
            Join thousands of students who are achieving better grades by studying together.
          </p>

          <div className="mt-12 flex flex-wrap gap-4">
            {['Smart Matching', 'Real-time Chat', 'Resource Sharing'].map((item) => (
              <span
                key={item}
                className="px-5 py-2.5 rounded-full border border-text-primary/30 bg-text-primary/10 backdrop-blur-xl text-sm font-semibold text-foreground flex items-center gap-2"
              >
                ✓ {item}
              </span>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-[13px] font-medium text-muted-foreground">
          <div className="flex items-center gap-6">
            <span>© 2026 StudyConnect Platform</span>
            <span className="opacity-60">•</span>
            <a href="#" className="hover:underline">Privacy</a>
            <span className="opacity-60">•</span>
            <a href="#" className="hover:underline">Terms</a>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 sm:px-10 py-10 bg-background">
        <div className="w-full max-w-md">

          {/* Heading */}
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
              Welcome back
            </h2>
            <p className="mt-2 text-sm text-muted">
              Enter your details to access your account
            </p>
          </div>

          {/* Form */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Email
              </label>
              <input
                type="email"
                placeholder="username@gmail.com"
                className="mt-2 w-full bg-input-background border border-border rounded-xl px-4 py-3 text-foreground focus:ring-2 placeholder-[var(--color-text-muted)]/60 focus:ring-[var(--color-accent-primary)]/50 outline-none transition"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <div className="flex justify-between text-sm">
                <label className="font-medium text-muted-foreground">
                  Password
                </label>
                <a href="/forgot-password" data-discover="true" className="text-primary hover:text-foreground">
                  Forgot?
                </a>
              </div>

              <input
                type="password"
                placeholder="Enter your password"
                className="mt-2 w-full bg-input-background border border-border rounded-xl px-4 py-3 text-foreground focus:ring-2 placeholder-[var(--color-text-muted)]/60 focus:ring-[var(--color-accent-primary)]/50 outline-none transition"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button 
              disabled={loading || googleLoading}
              className="w-full py-3 bg-linear-to-r from-primary to-primary-hover text-foreground font-semibold rounded-xl transition active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2" 
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing In...
                </>
              ) : "Sign In →"}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-10">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-widest text-muted">
              <span className="bg-background px-3">
                Or
              </span>
            </div>
          </div>

          {/* GOOGLE LOGIN BUTTON (NEW CODE) */}

          <button
            onClick={handleGoogleLogin}
            disabled={loading || googleLoading}
            className="w-full flex items-center justify-center gap-3 py-3 bg-input-background hover:bg-card border border-border text-foreground font-semibold rounded-xl transition active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {googleLoading ? (
               <svg className="animate-spin h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
               </svg>
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            )}
            Continue with Google
          </button>

          <p className="mt-10 text-center text-sm text-muted">
            Don't have an account?
            <a href="/signup" className="ml-1 text-primary hover:text-foreground">
              Create account
            </a>
          </p>

        </div>
      </div>
    </div>
  );
}
