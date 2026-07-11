import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BarChart3, Loader2, Medal, TrendingUp, Trophy, Zap } from "lucide-react";
import toast from "react-hot-toast";
import { Bar } from "react-chartjs-2";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
} from "chart.js";

import api from "../api/api";
import Layout from "../components/Layout";
import StatCard from "../components/StatCard";
import TrendChart from "../components/TrendChart";
import { Card } from "../components/ui/Card";
import { useTheme } from "../context/ThemeContext";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

function SkeletonCard() {
  return (
    <Card className="p-6 animate-pulse">
      <div className="mb-4 h-3 w-16 rounded bg-slate-200 dark:bg-white/10" />
      <div className="h-8 w-32 rounded bg-slate-200 dark:bg-white/10" />
    </Card>
  );
}

export default function Analytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  useEffect(() => {
    async function loadAnalytics() {
      try {
        const response = await api.get("/analytics");
        setAnalytics(response.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load analytics.");
      } finally {
        setLoading(false);
      }
    }

    loadAnalytics();
  }, []);

  return (
    <Layout>
      {/* ── Page header ─────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8 flex items-center gap-4"
      >
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-indigo-400/20 bg-indigo-400/10 shadow-inner">
          <BarChart3 size={24} className="text-indigo-300" />
        </div>
        <div>
          <h1 className="m-0 text-3xl font-black leading-tight tracking-tight text-slate-950 dark:text-white">
            Analytics Dashboard
          </h1>
          <p className="m-0 mt-1 text-sm text-slate-500">
            Performance insights and historical trends
          </p>
        </div>
      </motion.div>

      {/* ── Loading ──────────────────────────────────────────────────────── */}
      {loading && (
        <div>
          <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
          <Card className="flex items-center justify-center gap-3 py-20 text-slate-500">
            <Loader2 size={24} className="animate-spin text-indigo-400" />
            <span className="text-sm font-semibold tracking-wide">
              Loading analytics…
            </span>
          </Card>
        </div>
      )}

      {/* ── Content ──────────────────────────────────────────────────────── */}
      {!loading && analytics && (
        <>
          {/* Stat cards */}
          <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total Runs"
              value={analytics.total_runs}
              icon={<TrendingUp size={20} />}
              color="#6366f1"
              delay={0}
            />
            <StatCard
              title="Winning Runs"
              value={analytics.total_winners}
              icon={<Medal size={20} />}
              color="#10b981"
              delay={0.08}
            />
            <StatCard
              title="Avg Hash Rate"
              value={`${Math.round(analytics.average_hashrate).toLocaleString()} H/s`}
              icon={<Zap size={20} />}
              color="#f59e0b"
              delay={0.16}
            />
            <StatCard
              title="Best Strategy"
              value={analytics.best_strategy}
              icon={<Trophy size={20} />}
              color="#8b5cf6"
              delay={0.24}
            />
          </div>

          {/* Average Hashrate bar chart */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.3 }}
            className="mb-8"
          >
            <Card className="overflow-hidden">
              <div className="flex items-center gap-3 border-b border-slate-200 bg-slate-50/70 p-6 dark:border-white/10 dark:bg-white/[0.03]">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10 shadow-inner">
                  <BarChart3 size={17} className="text-cyan-300" />
                </div>
                <h2 className="m-0 text-lg font-black text-slate-950 dark:text-white">
                  Average Hash Rate by Strategy
                </h2>
              </div>

              <div className="h-[400px] p-8">
                <Bar
                  data={{
                    labels: analytics.strategies.map((item) =>
                      item.strategy.replace("Strategy", "")
                    ),
                    datasets: [
                      {
                        label: "Avg Hash Rate (H/s)",
                        data: analytics.strategies.map(
                          (item) => item.average_hashrate
                        ),
                        backgroundColor: (context) => {
                          const ctx = context.chart.ctx;
                          const gradient = ctx.createLinearGradient(0, 0, 0, 400);
                          gradient.addColorStop(0, "rgba(34, 211, 238, 0.9)");
                          gradient.addColorStop(1, "rgba(129, 140, 248, 0.18)");
                          return gradient;
                        },
                        borderColor: "rgba(34, 211, 238, 0.9)",
                        borderWidth: 1,
                        borderRadius: 10,
                        borderSkipped: false,
                        barPercentage: 0.55,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
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
                        backgroundColor: isDark
                          ? "rgba(2, 6, 23, 0.95)"
                          : "rgba(255,255,255,0.96)",
                        titleColor: isDark ? "#e2e8f0" : "#0f172a",
                        bodyColor: isDark ? "#94a3b8" : "#475569",
                        borderColor: isDark
                          ? "rgba(34, 211, 238, 0.22)"
                          : "rgba(14, 165, 233, 0.18)",
                        borderWidth: 1,
                        padding: 14,
                        cornerRadius: 12,
                        callbacks: {
                          label: (ctx) =>
                            ` ${Math.round(ctx.raw).toLocaleString()} H/s`,
                        },
                      },
                    },
                    scales: {
                      x: {
                        ticks: {
                          color: isDark ? "#cbd5e1" : "#475569",
                          font: { size: 12, weight: "700" },
                        },
                        grid: { display: false },
                        border: { display: false },
                      },
                      y: {
                        ticks: {
                          color: "#64748b",
                          font: { size: 12 },
                          callback: (v) => `${Math.round(v / 1000)}k`,
                        },
                        grid: {
                          color: isDark
                            ? "rgba(148,163,184,0.08)"
                            : "rgba(15,23,42,0.06)",
                        },
                        border: { display: false },
                      },
                    },
                    animation: { duration: 1000, easing: "easeOutQuart" },
                  }}
                />
              </div>
            </Card>
          </motion.div>

          {/* Trend Chart (hashrate over time) */}
          <TrendChart />
        </>
      )}

      {/* ── Empty state ──────────────────────────────────────────────────── */}
      {!loading && !analytics && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Card className="flex flex-col items-center justify-center px-8 py-20 text-center">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-indigo-400/20 bg-indigo-400/10 shadow-inner">
              <BarChart3 size={32} className="text-indigo-300" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-slate-950 dark:text-white">
              No Analytics Data
            </h3>
            <p className="mx-auto max-w-sm text-sm text-slate-500">
              Run benchmarks from the Dashboard to generate analytics data.
            </p>
          </Card>
        </motion.div>
      )}
    </Layout>
  );
}
