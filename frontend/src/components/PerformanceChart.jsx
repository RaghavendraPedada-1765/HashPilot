import { motion } from "framer-motion";
import { BarChart2, TrendingUp } from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend, Title);

export default function PerformanceChart({ results }) {
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
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "12px",
          height: "380px",
          color: "var(--text-muted)",
        }}
      >
        <div
          style={{
            width: "52px",
            height: "52px",
            borderRadius: "14px",
            background: "rgba(99,102,241,0.1)",
            border: "1px solid rgba(99,102,241,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <BarChart2 size={24} color="#6366f1" />
        </div>
        <p style={{ fontWeight: 600, fontSize: "15px", color: "var(--text-body)" }}>
          No chart data yet
        </p>
        <p style={{ fontSize: "13px", color: "var(--text-muted)", textAlign: "center", maxWidth: "260px" }}>
          Run a benchmark to see performance comparison across strategies
        </p>
      </motion.div>
    );
  }

  const winner = results.reduce((a, b) => (a.hashrate > b.hashrate ? a : b));

  const colors = results.map((item) =>
    item.strategy === winner.strategy
      ? "rgba(16,185,129,0.85)"
      : "rgba(99,102,241,0.70)"
  );

  const hoverColors = results.map((item) =>
    item.strategy === winner.strategy
      ? "rgba(16,185,129,1)"
      : "rgba(99,102,241,1)"
  );

  const data = {
    labels: results.map((item) => item.strategy.replace("Strategy", "")),
    datasets: [
      {
        label: "Hash Rate (H/s)",
        data: results.map((item) => item.hashrate),
        backgroundColor: colors,
        hoverBackgroundColor: hoverColors,
        borderRadius: 10,
        borderSkipped: false,
        borderWidth: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title:  { display: false },
      tooltip: {
        backgroundColor: "#0d1117",
        titleColor: "#f1f5f9",
        bodyColor: "#94a3b8",
        borderColor: "rgba(255,255,255,0.08)",
        borderWidth: 1,
        padding: 14,
        cornerRadius: 10,
        callbacks: {
          label: (ctx) => ` ${Math.round(ctx.raw).toLocaleString()} H/s`,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#64748b",
          font: { size: 12, weight: "600" },
        },
        grid: { display: false },
        border: { color: "rgba(255,255,255,0.05)" },
      },
      y: {
        ticks: {
          color: "#64748b",
          font: { size: 12 },
          callback: (v) => Math.round(v / 1000) + "k",
        },
        grid: { color: "rgba(255,255,255,0.04)" },
        border: { dash: [4, 4], color: "transparent" },
      },
    },
    animation: { duration: 900 },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.2 }}
      style={{
        background: "var(--bg-glass)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderRadius: "20px",
        border: "1px solid var(--border)",
        boxShadow: "var(--shadow-md)",
        overflow: "hidden",
      }}
    >
      {/* Chart title bar */}
      <div
        style={{
          padding: "18px 24px",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
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
            <TrendingUp size={14} color="#a5b4fc" />
          </div>
          <span style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-heading)" }}>
            Performance Comparison
          </span>
        </div>

        {/* Legend */}
        <div style={{ display: "flex", gap: "16px" }}>
          {[
            { color: "#10b981", label: "Winner" },
            { color: "#6366f1", label: "Other" },
          ].map(({ color, label }) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <div style={{ width: "8px", height: "8px", borderRadius: "2px", background: color }} />
              <span style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 600 }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div style={{ padding: "24px", height: "360px" }}>
        <Bar data={data} options={options} />
      </div>
    </motion.div>
  );
}