import { motion } from "framer-motion";
import { CheckCircle2, Loader2, Clock, Zap } from "lucide-react";

const STEPS = [
  { label: "Sequential",   icon: Zap,    color: "#6366f1" },
  { label: "Random",       icon: Zap,    color: "#8b5cf6" },
  { label: "MultiThread",  icon: Zap,    color: "#06b6d4" },
  { label: "MultiProcess", icon: Zap,    color: "#10b981" },
];

export default function ProgressPanel({ loading, progress, stage }) {
  if (!loading) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.35 }}
      style={{
        background: "var(--bg-glass)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderRadius: "20px",
        border: "1px solid rgba(99,102,241,0.25)",
        boxShadow: "0 12px 35px rgba(0,0,0,0.4), 0 0 0 1px rgba(99,102,241,0.08) inset",
        marginBottom: "28px",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "18px 24px",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          background: "rgba(99,102,241,0.06)",
        }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
          style={{
            width: "28px",
            height: "28px",
            borderRadius: "50%",
            border: "2.5px solid rgba(99,102,241,0.3)",
            borderTopColor: "#6366f1",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        />
        <span style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-heading)" }}>
          Running Benchmark
        </span>
        <span
          style={{
            marginLeft: "auto",
            fontSize: "22px",
            fontWeight: 800,
            color: "#a5b4fc",
            fontVariantNumeric: "tabular-nums",
            letterSpacing: "-0.5px",
          }}
        >
          {progress}%
        </span>
      </div>

      <div style={{ padding: "24px" }}>
        {/* Progress bar */}
        <div
          style={{
            width: "100%",
            height: "8px",
            background: "rgba(255,255,255,0.05)",
            borderRadius: "999px",
            overflow: "hidden",
            marginBottom: "28px",
            position: "relative",
          }}
        >
          <motion.div
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            style={{
              height: "100%",
              background: "linear-gradient(90deg, #6366f1, #8b5cf6, #06b6d4)",
              borderRadius: "999px",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Shimmer */}
            <div
              className="shimmer"
              style={{ position: "absolute", inset: 0 }}
            />
          </motion.div>
        </div>

        {/* Stepper */}
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          {STEPS.map((step, index) => {
            const isDone    = index < stage;
            const isCurrent = index === stage;
            const isPending = index > stage;

            return (
              <div key={step.label} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                {/* Step circle */}
                <motion.div
                  animate={isCurrent ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 1, repeat: Infinity }}
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: isDone
                      ? "rgba(16,185,129,0.15)"
                      : isCurrent
                        ? "rgba(99,102,241,0.2)"
                        : "rgba(255,255,255,0.04)",
                    border: isDone
                      ? "1.5px solid rgba(16,185,129,0.4)"
                      : isCurrent
                        ? "1.5px solid rgba(99,102,241,0.5)"
                        : "1.5px solid rgba(255,255,255,0.08)",
                    flexShrink: 0,
                    transition: "all 0.3s",
                  }}
                >
                  {isDone ? (
                    <CheckCircle2 size={16} color="#10b981" />
                  ) : isCurrent ? (
                    <Loader2 size={15} color="#818cf8" className="spin" />
                  ) : (
                    <Clock size={14} color="var(--text-faint)" />
                  )}
                </motion.div>

                {/* Connector line between steps */}

                {/* Label */}
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 600,
                    color: isDone
                      ? "#10b981"
                      : isCurrent
                        ? "#a5b4fc"
                        : "var(--text-muted)",
                    textAlign: "center",
                    transition: "color 0.3s",
                  }}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}