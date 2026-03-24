import { AlertTriangle, Info, AlertCircle, Loader2 } from "lucide-react";
import { useEffect } from "react";
import { createPortal } from "react-dom";

/**
 * @param {object} props
 * @param {boolean} props.open
 * @param {function} props.onClose
 * @param {function} props.onConfirm
 * @param {string} props.title
 * @param {string} props.desc
 * @param {string} props.buttonName
 * @param {'danger' | 'warning' | 'info'} props.variant
 * @param {boolean} props.loading
 */
export default function ConfirmModal({ 
  open, 
  onClose, 
  onConfirm, 
  title, 
  desc, 
  buttonName, 
  variant = "danger",
  loading = false
}) {
  // Close on ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };

    if (open) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "auto";
    };
  }, [open, onClose]);

  if (!open) return null;

  const variants = {
    danger: {
      icon: <AlertTriangle size={24} className="text-destructive" />,
      bg: "bg-destructive/10",
      button: "bg-destructive hover:bg-destructive/80 shadow-[var(--color-danger)]/20",
    },
    warning: {
      icon: <AlertCircle size={24} className="text-warning" />,
      bg: "bg-warning/10",
      button: "bg-warning hover:bg-warning/80 shadow-[var(--color-warning)]/20",
    },
    info: {
      icon: <Info size={24} className="text-primary" />,
      bg: "bg-primary/10",
      button: "bg-primary hover:bg-primary-hover shadow-primary/20",
    }
  };

  const currentVariant = variants[variant] || variants.danger;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      {/* Modal */}
      <div className="relative w-full max-w-md rounded-2xl bg-card border border-border text-foreground shadow-2xl transform transition-all animate-in fade-in zoom-in duration-200">
        
        <div className="p-6">
          <div className="flex flex-col items-center text-center">
            {/* Icon */}
            <div className={`p-3 rounded-full mb-4 ${currentVariant.bg}`}>
              {currentVariant.icon}
            </div>

            {/* Content */}
            <h3 className="text-xl font-bold text-foreground mb-2">
              {title}
            </h3>
            <p className="text-muted text-sm leading-relaxed">
              {desc}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-card/50 px-6 py-4 flex gap-3 rounded-b-2xl">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 rounded-xl bg-background border border-border px-4 py-2.5 text-sm font-semibold hover:bg-card transition-all disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-foreground transition-all shadow-lg active:scale-[0.98] disabled:opacity-50 ${currentVariant.button}`}
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {buttonName}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
