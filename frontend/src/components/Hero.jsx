import { motion } from "framer-motion";
import { Zap, TrendingUp } from "lucide-react";
import { Badge } from "./ui/Badge";

export default function Hero() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className="relative overflow-hidden bg-white dark:bg-slate-900 rounded-3xl p-10 md:p-14 mb-8 border border-slate-200 dark:border-slate-800 shadow-2xl"
    >
      {/* Dynamic Background Gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-100/40 via-white/90 to-cyan-100/20 dark:from-indigo-900/40 dark:via-slate-900/90 dark:to-cyan-900/20" />
      
      {/* Decorative blobs */}
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-cyan-500/10 blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-32 left-1/4 w-80 h-80 rounded-full bg-indigo-500/10 blur-[100px] pointer-events-none" />

      {/* Mesh Overlay */}
      <div className="absolute inset-0 mesh-bg opacity-40 pointer-events-none mix-blend-overlay" />

      {/* Content above the mesh */}
      <div className="relative z-10">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="mb-6"
        >
          <Badge variant="indigo" className="border-indigo-500/40 bg-indigo-500/10 backdrop-blur-md px-3 py-1.5 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
            <TrendingUp size={14} className="text-indigo-600 dark:text-indigo-400" />
            <span className="text-indigo-700 dark:text-indigo-300 font-semibold tracking-wide">
              Advanced Analytics Engine
            </span>
          </Badge>
        </motion.div>

        {/* Title row */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-6 mb-5">
          <motion.div
            className="animate-float w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center shrink-0 shadow-[0_8px_30px_rgba(6,182,212,0.4)] border border-white/10"
          >
            <Zap size={32} className="text-white" strokeWidth={2.5} />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="text-5xl md:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-slate-700 to-slate-500 dark:from-white dark:via-slate-200 dark:to-slate-400"
          >
            HashPilot
          </motion.h1>
        </div>

        {/* Subtitle */}
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-2xl md:text-3xl font-semibold text-cyan-600 dark:text-cyan-400 mb-4 tracking-tight"
        >
          AI-Powered Benchmark Platform
        </motion.h2>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-base md:text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl font-medium"
        >
          Benchmark computational strategies, compare hash performance,
          visualize execution metrics, and analyze historical benchmark
          data through a premium analytics dashboard.
        </motion.p>

        {/* Stats strip */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.45 }}
          className="mt-10 flex flex-wrap gap-x-10 gap-y-6"
        >
          {[
            { label: "Strategies", value: "4" },
            { label: "Real-time Progress", value: "Live" },
            { label: "AI Analysis", value: "Active" },
            { label: "History Tracking", value: "Enabled" },
          ].map(({ label, value }) => (
            <div key={label} className="flex flex-col gap-1">
              <span className="text-lg md:text-xl font-bold text-slate-900 dark:text-slate-200">{value}</span>
              <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">{label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}