import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Medal, Zap, Clock, Hash, Table } from "lucide-react";

const RANK_CONFIG = [
  { bg: "rgba(251,191,36,0.15)", border: "rgba(251,191,36,0.35)", color: "#fbbf24", icon: <Trophy size={13} /> },
  { bg: "rgba(148,163,184,0.12)", border: "rgba(148,163,184,0.25)", color: "#94a3b8", icon: <Medal size={13} /> },
  { bg: "rgba(180,83,9,0.12)",   border: "rgba(180,83,9,0.25)",   color: "#b45309", icon: <Medal size={13} /> },
];

const rowVariants = {
  hidden:  { opacity: 0, x: -12 },
  visible: (i) => ({ opacity: 1, x: 0, transition: { delay: i * 0.06, duration: 0.3 } }),
};

export default function BenchmarkTable({ results }) {
  if (!results || results.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{
          background: "var(--bg-glass)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderRadius: "20px",
          border: "1px solid var(--border)",
          padding: "64px 40px",
          textAlign: "center",
          marginTop: "28px",
        }}
      >
        <div
          style={{
            width: "56px",
            height: "56px",
            borderRadius: "16px",
            background: "rgba(99,102,241,0.1)",
            border: "1px solid rgba(99,102,241,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px",
          }}
        >
          <Table size={24} color="#6366f1" />
        </div>
        <h3 style={{ color: "var(--text-heading)", marginBottom: "8px", fontSize: "16px" }}>
          No Results Yet
        </h3>
        <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>
          Run a benchmark to populate results here.
        </p>
      </motion.div>
    );
  }

  const sorted = [...results].sort((a, b) => b.hashrate - a.hashrate);
  const winnerStrategy = sorted[0].strategy;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.25 }}
      style={{
        background: "var(--bg-glass)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderRadius: "20px",
        border: "1px solid var(--border)",
        boxShadow: "var(--shadow-md)",
        marginTop: "28px",
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
          gap: "10px",
          background: "rgba(99,102,241,0.05)",
        }}
      >
        <div
          style={{
            width: "30px",
            height: "30px",
            borderRadius: "8px",
            background: "rgba(99,102,241,0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid rgba(99,102,241,0.25)",
          }}
        >
          <Table size={14} color="#a5b4fc" />
        </div>
        <span style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-heading)" }}>
          Benchmark Results
        </span>
        <span
          style={{
            marginLeft: "auto",
            fontSize: "11px",
            fontWeight: 600,
            color: "var(--text-muted)",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid var(--border)",
            borderRadius: "999px",
            padding: "2px 10px",
          }}
        >
          {results.length} strategies
        </span>
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "rgba(0,0,0,0.2)" }}>
              {["Rank", "Strategy", "Runtime", "Attempts", "Hash Rate", "Status"].map((h) => (
                <th
                  key={h}
                  style={{
                    color: "var(--text-muted)",
                    padding: "12px 20px",
                    textAlign: "left",
                    fontWeight: 700,
                    fontSize: "11px",
                    letterSpacing: "0.8px",
                    textTransform: "uppercase",
                    whiteSpace: "nowrap",
                    borderBottom: "1px solid var(--border)",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            <AnimatePresence>
              {sorted.map((item, index) => {
                const runtime    = item.time ?? item.runtime;
                const isWinner   = item.strategy === winnerStrategy;
                const rankConfig = RANK_CONFIG[index] ?? RANK_CONFIG[2];

                return (
                  <motion.tr
                    key={`${item.strategy}-${index}`}
                    custom={index}
                    variants={rowVariants}
                    initial="hidden"
                    animate="visible"
                    style={{
                      borderBottom: "1px solid var(--border)",
                      background: isWinner
                        ? "rgba(16,185,129,0.04)"
                        : "transparent",
                      transition: "background 0.15s",
                      cursor: "default",
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = isWinner
                      ? "rgba(16,185,129,0.08)"
                      : "rgba(255,255,255,0.03)"}
                    onMouseLeave={e => e.currentTarget.style.background = isWinner
                      ? "rgba(16,185,129,0.04)"
                      : "transparent"}
                  >
                    {/* Rank */}
                    <td style={{ padding: "14px 20px", whiteSpace: "nowrap" }}>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "5px",
                          background: rankConfig.bg,
                          border: `1px solid ${rankConfig.border}`,
                          borderRadius: "6px",
                          padding: "3px 9px",
                          fontSize: "12px",
                          fontWeight: 700,
                          color: rankConfig.color,
                        }}
                      >
                        {rankConfig.icon}
                        #{index + 1}
                      </span>
                    </td>

                    {/* Strategy */}
                    <td style={{ padding: "14px 20px" }}>
                      <span
                        style={{
                          fontWeight: 600,
                          fontSize: "14px",
                          color: isWinner ? "#6ee7b7" : "var(--text-heading)",
                        }}
                      >
                        {item.strategy}
                      </span>
                    </td>

                    {/* Runtime */}
                    <td style={{ padding: "14px 20px", whiteSpace: "nowrap" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <Clock size={12} color="#38bdf8" />
                        <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-body)", fontVariantNumeric: "tabular-nums" }}>
                          {runtime.toFixed(4)} s
                        </span>
                      </div>
                    </td>

                    {/* Attempts */}
                    <td style={{ padding: "14px 20px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <Hash size={12} color="#94a3b8" />
                        <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-body)", fontVariantNumeric: "tabular-nums" }}>
                          {item.attempts.toLocaleString()}
                        </span>
                      </div>
                    </td>

                    {/* Hash Rate */}
                    <td style={{ padding: "14px 20px", whiteSpace: "nowrap" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <Zap size={12} color="#10b981" />
                        <span
                          style={{
                            fontSize: "13px",
                            fontWeight: 700,
                            color: isWinner ? "#10b981" : "var(--text-body)",
                            fontVariantNumeric: "tabular-nums",
                          }}
                        >
                          {Math.round(item.hashrate).toLocaleString()} H/s
                        </span>
                      </div>
                    </td>

                    {/* Status badge */}
                    <td style={{ padding: "14px 20px" }}>
                      {isWinner ? (
                        <span
                          style={{
                            background: "rgba(16,185,129,0.15)",
                            color: "#6ee7b7",
                            padding: "5px 12px",
                            borderRadius: "999px",
                            fontWeight: 700,
                            fontSize: "12px",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "5px",
                            border: "1px solid rgba(16,185,129,0.3)",
                          }}
                        >
                          <Trophy size={11} />
                          Winner
                        </span>
                      ) : (
                        <span
                          style={{
                            background: "rgba(100,116,139,0.12)",
                            color: "var(--text-muted)",
                            padding: "5px 12px",
                            borderRadius: "999px",
                            fontSize: "12px",
                            fontWeight: 600,
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "5px",
                            border: "1px solid rgba(100,116,139,0.2)",
                          }}
                        >
                          <Medal size={11} />
                          Runner Up
                        </span>
                      )}
                    </td>
                  </motion.tr>
                );
              })}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}