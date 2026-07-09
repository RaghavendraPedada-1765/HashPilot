import { motion } from "framer-motion";

export function Button({ children, variant = "primary", className = "", ...props }) {
  const variants = {
    primary: "bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-400 hover:from-cyan-300 hover:to-indigo-300 text-slate-950 shadow-[0_0_22px_rgba(34,211,238,0.28)] hover:shadow-[0_0_34px_rgba(34,211,238,0.45)]",
    secondary: "bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/15 text-slate-900 dark:text-white border border-slate-200 dark:border-white/10",
    danger: "bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-500 border border-red-200 dark:border-red-500/30",
    outline: "bg-white/50 dark:bg-white/[0.03] border border-slate-300 dark:border-white/10 hover:border-slate-400 dark:hover:border-cyan-400/30 text-slate-700 dark:text-slate-300",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.96 }}
      className={`px-4 py-2 rounded-xl font-semibold transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}
