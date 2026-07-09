import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BarChart3, Zap, Trophy, Medal, TrendingUp, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

import api from "../api/api";
import Layout from "../components/Layout";
import StatCard from "../components/StatCard";
import { Card } from "../components/ui/Card";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

function SkeletonCard() {
  return (
    <Card className="p-6 animate-pulse">
      <div className="w-16 h-3 bg-slate-800 rounded mb-4"></div>
      <div className="w-32 h-8 bg-slate-800 rounded"></div>
    </Card>
  );
}

export default function Analytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

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

  return (
    <Layout>
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8 flex items-center gap-4"
      >
        <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center shrink-0 shadow-inner">
          <BarChart3 size={24} className="text-indigo-400" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white m-0 leading-tight">
            Analytics Dashboard
          </h1>
          <p className="text-sm text-slate-400 m-0 mt-1">
            Performance insights and historical trends
          </p>
        </div>
      </motion.div>

      {/* Loading state */}
      {loading && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
          <Card className="py-20 flex items-center justify-center gap-3 text-slate-400">
            <Loader2 size={24} className="animate-spin text-indigo-500" />
            <span className="font-semibold text-sm tracking-wide">Loading analytics…</span>
          </Card>
        </div>
      )}

      {/* Loaded state */}
      {!loading && analytics && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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

          {/* Chart card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.3 }}
          >
            <Card className="overflow-hidden">
              <div className="p-6 border-b border-slate-800 bg-slate-900/50 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shadow-inner">
                  <BarChart3 size={16} className="text-cyan-400" />
                </div>
                <h2 className="text-lg font-bold text-white m-0">Average Hash Rate by Strategy</h2>
              </div>

              <div className="p-8 h-[400px]">
                <Bar
                  data={{
                    labels: analytics.strategies.map((item) =>
                      item.strategy.replace("Strategy", "")
                    ),
                    datasets: [
                      {
                        label: "Avg Hash Rate (H/s)",
                        data: analytics.strategies.map((item) => item.average_hashrate),
                        backgroundColor: (context) => {
                          const ctx = context.chart.ctx;
                          const gradient = ctx.createLinearGradient(0, 0, 0, 400);
                          gradient.addColorStop(0, "rgba(99, 102, 241, 0.8)");
                          gradient.addColorStop(1, "rgba(99, 102, 241, 0.1)");
                          return gradient;
                        },
                        borderColor: "rgba(99, 102, 241, 1)",
                        borderWidth: 1,
                        borderRadius: 8,
                        barPercentage: 0.5,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { display: false },
                      tooltip: {
                        backgroundColor: "rgba(15, 23, 42, 0.95)",
                        titleColor: "#f1f5f9",
                        bodyColor: "#94a3b8",
                        borderColor: "rgba(30, 41, 59, 1)",
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
                        ticks: { color: "#64748b", font: { family: "'Inter', sans-serif", size: 12, weight: "600" } },
                        grid: { display: false },
                        border: { display: false },
                      },
                      y: {
                        ticks: {
                          color: "#64748b",
                          font: { family: "'Inter', sans-serif", size: 12 },
                          callback: (v) => Math.round(v / 1000) + "k",
                        },
                        grid: { color: "rgba(255,255,255,0.05)" },
                        border: { display: false },
                      },
                    },
                    animation: { duration: 1000, easing: "easeOutQuart" },
                  }}
                />
              </div>
            </Card>
          </motion.div>
        </>
      )}

      {/* Empty state when no analytics data */}
      {!loading && !analytics && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Card className="py-20 px-8 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-6 shadow-inner">
              <BarChart3 size={32} className="text-indigo-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No Analytics Data</h3>
            <p className="text-slate-400 text-sm max-w-sm mx-auto">
              Run benchmarks from the Dashboard to generate analytics data.
            </p>
          </Card>
        </motion.div>
      )}
    </Layout>
  );
}