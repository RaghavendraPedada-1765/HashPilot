import { motion } from "framer-motion";

export function Card({ children, className = "", animate = false, ...props }) {
  const baseClasses = "bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-2xl shadow-lg";
  
  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
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
