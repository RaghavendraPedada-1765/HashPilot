import { motion } from "framer-motion";
import { SlidersHorizontal, Cpu, Layers, ChevronDown, Play, Loader2 } from "lucide-react";

const CONFIG_ITEMS = [
  {
    key: "difficulty",
    label: "Difficulty",
    icon: Layers,
    iconColor: "#06b6d4",
    options: [1, 2, 3, 4, 5, 6, 7],
    description: "Hash complexity level",
  },
  {
    key: "threads",
    label: "Threads",
    icon: Cpu,
    iconColor: "#10b981",
    options: [1, 2, 4, 8, 12, 16],
    description: "Worker thread count",
  },
  {
    key: "processes",
    label: "Processes",
    icon: Cpu,
    iconColor: "#f97316",
    options: [1, 2, 4, 8],
    description: "Parallel processes",
  },
];

export default function ControlPanel({
  difficulty,
  setDifficulty,
  threads,
  setThreads,
  processes,
  setProcesses,
  onRun,
  loading,
}) {
  const setters = { difficulty: setDifficulty, threads: setThreads, processes: setProcesses };
  const values  = { difficulty, threads, processes };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.1 }}
      style={{
        background: "var(--bg-glass)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderRadius: "20px",
        border: "1px solid var(--border)",
        boxShadow: "var(--shadow-md)",
        marginBottom: "28px",
        overflow: "hidden",
      }}
    >
      {/* Card header */}
      <div
        style={{
          padding: "20px 28px",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          background: "rgba(99,102,241,0.06)",
        }}
      >
        <div
          style={{
            width: "34px",
            height: "34px",
            borderRadius: "9px",
            background: "rgba(99,102,241,0.18)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid rgba(99,102,241,0.3)",
          }}
        >
          <SlidersHorizontal size={16} color="#a5b4fc" />
        </div>
        <div>
          <h2 style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-heading)", margin: 0 }}>
            Benchmark Configuration
          </h2>
          <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: 0, marginTop: "1px" }}>
            Tune parameters then run the benchmark
          </p>
        </div>
      </div>

      {/* Config grid */}
      <div style={{ padding: "28px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px" }}>
        {CONFIG_ITEMS.map(({ key, label, icon: Icon, iconColor, options, description }) => (
          <div key={key}>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "8px",
              }}
            >
              <Icon size={14} color={iconColor} />
              <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-body)" }}>
                {label}
              </span>
            </label>

            <p style={{ fontSize: "11px", color: "var(--text-muted)", marginBottom: "10px" }}>
              {description}
            </p>

            {/* Custom select wrapper */}
            <div style={{ position: "relative" }}>
              <select
                value={values[key]}
                onChange={(e) => setters[key](Number(e.target.value))}
                style={{
                  width: "100%",
                  padding: "10px 36px 10px 14px",
                  borderRadius: "10px",
                  border: "1px solid var(--border)",
                  background: "var(--bg-elevated)",
                  color: "var(--text-heading)",
                  fontSize: "14px",
                  fontWeight: 600,
                  outline: "none",
                  cursor: "pointer",
                  appearance: "none",
                  WebkitAppearance: "none",
                  transition: "border-color 0.18s, box-shadow 0.18s",
                  fontFamily: "inherit",
                }}
                onFocus={e => {
                  e.target.style.borderColor = "rgba(99,102,241,0.55)";
                  e.target.style.boxShadow = "0 0 0 3px rgba(99,102,241,0.12)";
                }}
                onBlur={e => {
                  e.target.style.borderColor = "var(--border)";
                  e.target.style.boxShadow = "none";
                }}
              >
                {options.map((v) => (
                  <option key={v} value={v}
                    style={{ background: "#1e293b", color: "white" }}
                  >
                    {v}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={13}
                color="var(--text-muted)"
                style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Run button */}
      <div
        style={{
          padding: "0 28px 28px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <motion.button
          whileHover={loading ? {} : { scale: 1.03, boxShadow: "0 12px 40px rgba(99,102,241,0.55)" }}
          whileTap={loading ? {} : { scale: 0.97 }}
          disabled={loading}
          onClick={onRun}
          style={{
            background: loading
              ? "rgba(71,85,105,0.6)"
              : "linear-gradient(135deg, #6366f1, #8b5cf6)",
            color: "white",
            border: loading ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(139,92,246,0.5)",
            borderRadius: "14px",
            padding: "14px 48px",
            fontSize: "15px",
            fontWeight: 700,
            cursor: loading ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            boxShadow: loading ? "none" : "0 8px 28px rgba(99,102,241,0.38)",
            transition: "background 0.25s, box-shadow 0.25s",
            fontFamily: "inherit",
            letterSpacing: "-0.2px",
            animation: loading ? "none" : undefined,
          }}
        >
          {loading ? (
            <Loader2 size={18} className="spin" />
          ) : (
            <Play size={16} strokeWidth={2.5} />
          )}
          {loading ? "Running Benchmark…" : "Run Benchmark"}
        </motion.button>
      </div>
    </motion.div>
  );
}