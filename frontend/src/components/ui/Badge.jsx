export function Badge({ children, variant = "default", className = "", dot = false }) {
  const variants = {
    default: "bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/10",
    success: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
    warning: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
    danger: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20",
    accent: "bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border-cyan-500/20",
    indigo: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/20",
  };

  const dotColors = {
    default: "bg-slate-500 dark:bg-slate-400",
    success: "bg-emerald-500 dark:bg-emerald-400",
    warning: "bg-amber-500 dark:bg-amber-400",
    danger: "bg-red-500 dark:bg-red-400",
    accent: "bg-cyan-500 dark:bg-cyan-400",
    indigo: "bg-indigo-500 dark:bg-indigo-400",
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full border ${variants[variant]} ${className}`}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]} animate-dot-pulse`} />}
      {children}
    </span>
  );
}
