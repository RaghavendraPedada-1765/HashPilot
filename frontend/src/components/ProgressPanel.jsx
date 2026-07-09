import { motion } from "framer-motion";
import { CheckCircle2, Loader2, Clock, Zap } from "lucide-react";
import { Card } from "./ui/Card";

const STEPS = [
  { label: "Sequential",   icon: Zap,    color: "indigo" },
  { label: "Random",       icon: Zap,    color: "purple" },
  { label: "MultiThread",  icon: Zap,    color: "cyan" },
  { label: "MultiProcess", icon: Zap,    color: "emerald" },
];

export default function ProgressPanel({ loading, progress, stage }) {
  if (!loading) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.35 }}
      className="mb-8"
    >
      <Card className="overflow-hidden shadow-[0_12px_35px_rgba(0,0,0,0.4)] border-indigo-500/25 relative">
        <div className="absolute inset-0 shadow-[inset_0_0_0_1px_rgba(99,102,241,0.08)] pointer-events-none" />
        
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3 bg-indigo-50 dark:bg-indigo-500/5">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
            className="w-7 h-7 rounded-full border-[2.5px] border-indigo-200 dark:border-indigo-500/30 border-t-indigo-600 dark:border-t-indigo-500 flex items-center justify-center"
          />
          <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Running Benchmark
          </span>
          <span className="ml-auto text-2xl font-extrabold text-indigo-600 dark:text-indigo-300 font-mono tracking-tight tabular-nums">
            {progress}%
          </span>
        </div>

        <div className="p-6">
          {/* Progress bar */}
          <div className="w-full h-2 bg-slate-200 dark:bg-white/5 rounded-full overflow-hidden mb-8 relative">
            <motion.div
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 rounded-full relative overflow-hidden"
            >
              {/* Shimmer */}
              <div className="absolute inset-0 animate-shimmer bg-[linear-gradient(90deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.2)_50%,rgba(255,255,255,0)_100%)] bg-[length:200%_100%]" />
            </motion.div>
          </div>

          {/* Stepper */}
          <div className="flex gap-2 items-center justify-between px-2">
            {STEPS.map((step, index) => {
              const isDone    = index < stage;
              const isCurrent = index === stage;

              return (
                <div key={step.label} className="flex flex-col items-center gap-2 flex-1">
                  {/* Step circle */}
                  <motion.div
                    animate={isCurrent ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ duration: 1, repeat: Infinity }}
                    className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 border-[1.5px] ${
                      isDone
                        ? "bg-emerald-100 dark:bg-emerald-500/15 border-emerald-300 dark:border-emerald-500/40"
                        : isCurrent
                          ? "bg-indigo-100 dark:bg-indigo-500/20 border-indigo-300 dark:border-indigo-500/50"
                          : "bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10"
                    }`}
                  >
                    {isDone ? (
                      <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-500" />
                    ) : isCurrent ? (
                      <Loader2 size={16} className="text-indigo-600 dark:text-indigo-400 animate-spin" />
                    ) : (
                      <Clock size={14} className="text-slate-400 dark:text-slate-600" />
                    )}
                  </motion.div>

                  {/* Label */}
                  <span
                    className={`text-[11px] font-semibold text-center transition-colors duration-300 ${
                      isDone
                        ? "text-emerald-600 dark:text-emerald-500"
                        : isCurrent
                          ? "text-indigo-600 dark:text-indigo-300"
                          : "text-slate-500"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}