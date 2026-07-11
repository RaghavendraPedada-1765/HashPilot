/**
 * TrendChart
 *
 * Shows hashrate trend over the last N benchmark runs using a Line chart.
 * Data comes from the /history endpoint.
 */

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { TrendingUp } from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/api";
import { Card } from "./ui/Card";
import { useTheme } from "../context/ThemeContext";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
);

const STRATEGY_COLORS = {
  SequentialStrategy:  { line: "#6366f1", fill: "rgba(99,102,241,0.12)" },
  RandomStrategy:      { line: "#f59e0b", fill: "rgba(245,158,11,0.12)" },
  MultiThreadStrategy: { line: "#22d3ee", fill: "rgba(34,211,238,0.12)" },
  MultiProcessStrategy:{ line: "#10b981", fill: "rgba(16,185,129,0.12)" },
};

export default function TrendChart() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  useEffect(() => {
    async function load() {
      try {
        const { data } = await api.get("/history");
        setHistory(data);
      } catch {
        toast.error("Failed to load trend data.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <Card className="animate-pulse p-6">
        <div className="mb-4 h-5 w-44 rounded bg-slate-200 dark:bg-white/10" />
        <div className="h-[280px] rounded-xl bg-slate-200 dark:bg-white/10" />
      </Card>
    );
  }

  if (!history.length) return null;

  // Group by strategy, keep last 20 runs each, sort by id ascending.
  const strategies = [...new Set(history.map((r) => r.strategy))];
  const maxRuns = 20;

  const datasets = strategies.map((strategy) => {
    const rows = history
      .filter((r) => r.strategy === strategy)
      .slice(-maxRuns);
    const colors = STRATEGY_COLORS[strategy] ?? {
      line: "#94a3b8",
      fill: "rgba(148,163,184,0.08)",
    };

    return {
      label: strategy.replace("Strategy", ""),
      data: rows.map((r) => Math.round(r.hashrate)),
      borderColor: colors.line,
      backgroundColor: colors.fill,
      fill: true,
      tension: 0.4,
      pointRadius: 4,
      pointHoverRadius: 6,
      borderWidth: 2,
    };
  });

  // Use run index as x-axis label (1, 2, 3…)
  const maxLen = Math.max(...datasets.map((d) => d.data.length));
  const labels = Array.from({ length: maxLen }, (_, i) => `Run ${i + 1}`);

  const chartData = { labels, datasets };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "index", intersect: false },
    plugins: {
      legend: {
        display: true,
        position: "top",
        align: "end",
        labels: {
          color: isDark ? "#cbd5e1" : "#475569",
          usePointStyle: true,
          font: { size: 12, weight: "700" },
        },
      },
      tooltip: {
        backgroundColor: isDark ? "rgba(2,6,23,0.95)" : "rgba(255,255,255,0.96)",
        titleColor: isDark ? "#e2e8f0" : "#0f172a",
        bodyColor: isDark ? "#94a3b8" : "#475569",
        borderColor: isDark ? "rgba(34,211,238,0.22)" : "rgba(14,165,233,0.18)",
        borderWidth: 1,
        padding: 14,
        cornerRadius: 12,
        callbacks: {
          label: (ctx) => ` ${ctx.dataset.label}: ${ctx.raw?.toLocaleString()} H/s`,
        },
      },
    },
    scales: {
      x: {
        ticks: { color: isDark ? "#cbd5e1" : "#475569", font: { size: 11 } },
        grid: { display: false },
        border: { display: false },
      },
      y: {
        ticks: {
          color: "#64748b",
          font: { size: 11 },
          callback: (v) => `${Math.round(v / 1000)}k`,
        },
        grid: { color: isDark ? "rgba(148,163,184,0.08)" : "rgba(15,23,42,0.06)" },
        border: { display: false },
      },
    },
    animation: { duration: 900, easing: "easeOutQuart" },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.35 }}
    >
      <Card className="overflow-hidden">
        <div className="flex items-center gap-3 border-b border-slate-200 bg-slate-50/70 p-6 dark:border-white/10 dark:bg-white/[0.03]">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-indigo-400/20 bg-indigo-400/10 shadow-inner">
            <TrendingUp size={17} className="text-indigo-300" />
          </div>
          <h2 className="m-0 text-lg font-black text-slate-950 dark:text-white">
            Hash Rate Trend
          </h2>
        </div>
        <div className="h-[300px] p-6">
          <Line data={chartData} options={options} />
        </div>
      </Card>
    </motion.div>
  );
}
