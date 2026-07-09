import { motion } from "framer-motion";

export function Card({ children, className = "", animate = false, ...props }) {
  const baseClasses = "group/card bg-white/85 dark:bg-slate-950/55 backdrop-blur-2xl border border-slate-200/80 dark:border-white/10 rounded-2xl shadow-[0_18px_55px_rgba(15,23,42,0.08)] dark:shadow-[0_24px_80px_rgba(0,0,0,0.35)] transition-all duration-300 hover:border-slate-300 dark:hover:border-cyan-400/20";
  
  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className={`${baseClasses} ${className}`}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={`${baseClasses} ${className}`} {...props}>
      {children}
    </div>
  );
}
