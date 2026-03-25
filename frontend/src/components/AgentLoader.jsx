import { useEffect, useState } from "react";

export default function StudyGroupLoader({ isLoading, onFinished }) {
  const [visible, setVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  // Handle Fade In / Out
  useEffect(() => {
    let timeout;

    if (isLoading) {
      setVisible(true);
      setIsExiting(false);
    } else {
      // Start exit animation
      setIsExiting(true);
      // Wait for animation to finish before unmounting
      timeout = setTimeout(() => {
        setVisible(false);
        if (onFinished) onFinished();
      }, 800); // Matches duration-700 + buffer
    }

    return () => clearTimeout(timeout);
  }, [isLoading, onFinished]);

  if (!visible) return null;

  return (
    <div 
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-background backdrop-blur-md transition-all duration-700 ease-in-out
        ${isExiting ? 'opacity-0 pointer-events-none scale-105' : 'opacity-100'}`}
    >
      <div className="flex flex-col items-center gap-8">

        {/* NETWORK GRAPH (NODES ONLY) */}
        <div className="relative w-32 h-32">
          {/* Central Hub */}
          <div className="node node-center shadow-[0_0_30px_var(--primary)]"></div>
          
          {/* Orbital Nodes */}
          <div className="node node-top delay-75 shadow-[0_0_15px_var(--accent)]"></div>
          <div className="node node-left delay-150 shadow-[0_0_15px_var(--primary)]"></div>
          <div className="node node-right delay-300 shadow-[0_0_15px_var(--accent)]"></div>
          <div className="node node-bottom delay-500 shadow-[0_0_15px_var(--primary)]"></div>
          
          {/* Subtle Outer Ring */}
          <div className="absolute inset-0 rounded-full border border-primary/10 animate-spin-slow"></div>
          <div className="absolute inset-4 rounded-full border border-accent/5 animate-spin-reverse-slow"></div>
        </div>

        {/* TEXT */}
        <RotatingText />

      </div>

      {/* STYLES */}
      <style>{`
        .node {
          position: absolute;
          width: 12px;
          height: 12px;
          border-radius: 9999px;
          background: var(--primary);
          animation: pulse-theme 2s ease-in-out infinite;
        }

        .node-center { top: 50%; left: 50%; transform: translate(-50%, -50%); width: 16px; height: 16px; }
        .node-top { top: 0; left: 50%; transform: translateX(-50%); background: var(--accent); }
        .node-left { left: 0; top: 50%; transform: translateY(-50%); }
        .node-right { right: 0; top: 50%; transform: translateY(-50%); background: var(--accent); }
        .node-bottom { bottom: 0; left: 50%; transform: translateX(-50%); }

        @keyframes pulse-theme {
          0%, 100% { transform: scale(1); opacity: 0.7; }
          50% { transform: scale(1.3); opacity: 1; }
        }

        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes spin-reverse-slow {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }

        .animate-spin-slow {
          animation: spin-slow 10s linear infinite;
        }

        .animate-spin-reverse-slow {
          animation: spin-reverse-slow 15s linear infinite;
        }

        .delay-75 { animation-delay: 0.2s; }
        .delay-150 { animation-delay: 0.4s; }
        .delay-300 { animation-delay: 0.6s; }
        .delay-500 { animation-delay: 0.8s; }
      `}</style>
    </div>
  );
}

/* ROTATING TEXT */
function RotatingText() {
  const messages = [
    "Finding your study groups...",
    "Connecting learners...",
    "Syncing knowledge...",
    "Preparing your workspace..."
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % messages.length);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-6 flex items-center justify-center overflow-hidden">
      <p className="text-sm font-medium tracking-widest text-foreground/80 uppercase animate-fade-in">
        {messages[index]}
      </p>
      
      <style>{`
        @keyframes fade-in {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
}