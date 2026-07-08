import { motion } from "framer-motion";
import { Cpu, Monitor, Server, MemoryStick, Globe, Code2, Layers } from "lucide-react";

const INFO_ITEMS = [
  { key: "cpu",              label: "CPU",              icon: Cpu,         color: "#06b6d4" },
  { key: "physical_cores",   label: "Physical Cores",   icon: Layers,      color: "#6366f1" },
  { key: "logical_threads",  label: "Logical Threads",  icon: Server,      color: "#8b5cf6" },
  { key: "ram_gb",           label: "RAM",              icon: MemoryStick, color: "#10b981", suffix: " GB" },
  { key: "os",               label: "Operating System", icon: Monitor,     color: "#f59e0b" },
  { key: "python",           label: "Python Version",   icon: Code2,       color: "#22d3ee" },
  { key: "architecture",     label: "Architecture",     icon: Globe,       color: "#f97316" },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden:  { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export default function SystemInfo({ info }) {
  if (!info) return null;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
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
      {/* Header */}
      <motion.div
        variants={itemVariants}
        style={{
          padding: "18px 24px",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          background: "rgba(6,182,212,0.04)",
        }}
      >
        <div
          style={{
            width: "30px",
            height: "30px",
            borderRadius: "8px",
            background: "rgba(6,182,212,0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid rgba(6,182,212,0.25)",
          }}
        >
          <Cpu size={14} color="#22d3ee" />
        </div>
        <span style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-heading)" }}>
          System Information
        </span>
      </motion.div>

      {/* Info grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "1px",
          background: "var(--border)",
        }}
      >
        {INFO_ITEMS.map(({ key, label, icon: Icon, color, suffix = "" }) => {
          const val = info[key];
          if (val === undefined || val === null) return null;

          return (
            <motion.div
              key={key}
              variants={itemVariants}
              style={{
                background: "var(--bg-surface)",
                padding: "16px 20px",
                display: "flex",
                alignItems: "center",
                gap: "14px",
                transition: "background 0.15s",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "var(--bg-elevated)"}
              onMouseLeave={e => e.currentTarget.style.background = "var(--bg-surface)"}
            >
              {/* Icon */}
              <div
                style={{
                  width: "34px",
                  height: "34px",
                  borderRadius: "9px",
                  background: `${color}18`,
                  border: `1px solid ${color}33`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Icon size={14} color={color} />
              </div>

              {/* Label + value */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 600, letterSpacing: "0.5px", textTransform: "uppercase" }}>
                  {label}
                </div>
                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: 700,
                    color: "var(--text-heading)",
                    marginTop: "2px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                  title={`${val}${suffix}`}
                >
                  {val}{suffix}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}