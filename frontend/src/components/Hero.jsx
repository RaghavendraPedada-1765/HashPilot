import { motion } from "framer-motion";
import { Activity, Gauge, TrendingUp, Zap } from "lucide-react";
import { Badge } from "./ui/Badge";

export default function Hero() {
  return (
    <motion.section
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className="relative mb-8 min-h-[360px] overflow-hidden rounded-3xl border border-slate-200/80 bg-slate-950 p-6 shadow-[0_30px_90px_rgba(2,6,23,0.35)] dark:border-white/10 md:p-10"
    >
      <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(8,47,73,0.95),rgba(15,23,42,0.86),rgba(49,46,129,0.72))]" />
      <motion.div
        className="absolute inset-0 bg-[linear-gradient(100deg,transparent_0%,rgba(34,211,238,0.16)_35%,rgba(129,140,248,0.12)_58%,transparent_100%)] bg-[length:220%_100%]"
        animate={{ backgroundPosition: ["0% 0%", "100% 0%", "0% 0%"] }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
      />
      <div className="absolute inset-0 mesh-bg opacity-40" />

      <div className="relative z-10 flex min-h-[300px] flex-col justify-between">
        <div>
          <Badge variant="accent" className="mb-6 border-cyan-400/25 bg-cyan-400/10 px-3 py-1.5 text-cyan-100">
            <TrendingUp size={14} />
            Advanced Analytics Engine
          </Badge>

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <motion.div className="animate-float flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-cyan-200/20 bg-gradient-to-br from-cyan-400 to-indigo-500 shadow-[0_12px_40px_rgba(34,211,238,0.35)]">
              <Zap size={32} className="text-white" strokeWidth={2.5} />
            </motion.div>

            <div>
              <h1 className="m-0 text-5xl font-black tracking-tight text-white md:text-6xl">
                HashPilot
              </h1>
              <p className="mt-3 max-w-2xl text-lg font-medium leading-7 text-slate-300">
                AI-powered benchmarking for hash strategy selection, real-time solver telemetry, and executive-grade performance reporting.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            { label: "Strategies", value: "4", icon: Gauge },
            { label: "Telemetry", value: "Live", icon: Activity },
            { label: "AI Analysis", value: "Active", icon: Zap },
            { label: "Reports", value: "PDF", icon: TrendingUp },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur-xl">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-200">
                <Icon size={17} />
              </div>
              <div className="text-xl font-black text-white">{value}</div>
              <div className="mt-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
