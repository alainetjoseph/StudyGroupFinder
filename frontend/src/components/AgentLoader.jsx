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
      <div className="flex flex-col items-center gap-6">

        {/* NETWORK GRAPH */}
        <div className="relative w-40 h-40">

          {/* Lines */}
          <div className="absolute inset-0">
            <span className="line line1"></span>
            <span className="line line2"></span>
            <span className="line line3"></span>
          </div>

          {/* Nodes */}
          <div className="node node-center"></div>
          <div className="node node-top"></div>
          <div className="node node-left"></div>
          <div className="node node-right"></div>
          <div className="node node-bottom"></div>
        </div>

        {/* TEXT */}
        <RotatingText />

      </div>

      {/* STYLES */}
      <style>{`
        .node {
          position: absolute;
          width: 10px;
          height: 10px;
          border-radius: 9999px;
          background: #6366f1;
          box-shadow: 0 0 12px rgba(99, 102, 241, 0.8),
                      0 0 24px rgba(168, 85, 247, 0.4);
          animation: pulse 1.6s ease-in-out infinite;
        }

        .node-center { top: 50%; left: 50%; transform: translate(-50%, -50%); }
        .node-top { top: 0; left: 50%; transform: translateX(-50%); }
        .node-left { left: 0; top: 50%; transform: translateY(-50%); }
        .node-right { right: 0; top: 50%; transform: translateY(-50%); }
        .node-bottom { bottom: 0; left: 50%; transform: translateX(-50%); }

        .line {
          position: absolute;
          background: linear-gradient(90deg, #6366f1, #a855f7);
          opacity: 0.6;
          transform-origin: left;
          animation: draw 1.6s ease-in-out infinite;
        }

        .line1 {
          width: 50%;
          height: 1px;
          top: 50%;
          left: 50%;
        }

        .line2 {
          width: 50%;
          height: 1px;
          top: 50%;
          left: 50%;
          transform: rotate(60deg);
        }

        .line3 {
          width: 50%;
          height: 1px;
          top: 50%;
          left: 50%;
          transform: rotate(-60deg);
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.4); opacity: 1; }
        }

        @keyframes draw {
          0% { transform: scaleX(0); opacity: 0; }
          50% { transform: scaleX(1); opacity: 0.8; }
          100% { transform: scaleX(0); opacity: 0; }
        }
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
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <p className="text-sm text-muted-foreground transition-opacity duration-500">
      {messages[index]}
    </p>
  );
}