import { motion } from "framer-motion";

export function Button({ children, variant = "primary", className = "", ...props }) {
  const variants = {
    primary: "bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)]",
    secondary: "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700",
    danger: "bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-500 border border-red-200 dark:border-red-500/30",
    outline: "bg-transparent border border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 text-slate-700 dark:text-slate-300",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.96 }}
      className={`px-4 py-2 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}
