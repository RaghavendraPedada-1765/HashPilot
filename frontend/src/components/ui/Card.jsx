import { motion } from "framer-motion";

export function Card({ children, className = "", animate = false, ...props }) {
  const base =
    "rounded-[var(--radius-lg)] bg-[var(--bg-elevated)] border border-[var(--border)] shadow-[var(--shadow-card)] transition-colors duration-200 hover:border-[var(--border-strong)]";

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className={`${base} ${className}`}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={`${base} ${className}`} {...props}>
      {children}
    </div>
  );
}
