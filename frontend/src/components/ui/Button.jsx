import { motion } from "framer-motion";

export function Button({ children, variant = "primary", className = "", ...props }) {
  const variants = {
    primary:
      "bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-semibold shadow-[0_2px_8px_rgba(59,130,246,0.35)]",
    secondary:
      "bg-[var(--bg-overlay)] hover:bg-[var(--bg-elevated)] text-[var(--text-primary)] border border-[var(--border)]",
    danger:
      "bg-[rgba(239,68,68,0.1)] hover:bg-[rgba(239,68,68,0.18)] text-red-400 border border-[rgba(239,68,68,0.25)]",
    outline:
      "bg-transparent border border-[var(--border)] hover:border-[var(--border-strong)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]",
    ghost:
      "bg-transparent hover:bg-[var(--bg-overlay)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.97 }}
      className={`px-4 py-2 rounded-[var(--radius-md)] font-medium text-sm transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${variants[variant] ?? variants.primary} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}
