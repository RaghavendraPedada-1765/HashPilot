import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BarChart3, Zap, Trophy, Medal, TrendingUp, Loader2 } from "lucide-react";

import api from "../api/api";
import Layout from "../components/Layout";
import StatCard from "../components/StatCard";

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

/* ─── Skeleton StatCard ── */
function SkeletonCard() {
  return (
    <div
      style={{
        background: "var(--bg-glass)",
        backdropFilter: "blur(12px)",
        borderRadius: "18px",
        border: "1px solid var(--border)",
        padding: "24px",
      }}
    >
      <div className="skeleton" style={{ width: "60px", height: "10px", marginBottom: "16px" }} />
      <div className="skeleton" style={{ width: "120px", height: "28px" }} />
    </div>
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
      alert("Failed to load analytics.");
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
        style={{ marginBottom: "28px" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "8px" }}>
          <div
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "12px",
              background: "rgba(99,102,241,0.15)",
              border: "1px solid rgba(99,102,241,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <BarChart3 size={20} color="#a5b4fc" />
          </div>
          <div>
            <h1 style={{ fontSize: "26px", fontWeight: 800, letterSpacing: "-0.5px" }}>
              Analytics Dashboard
            </h1>
            <p style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "2px" }}>
              Performance insights and historical trends
            </p>
          </div>
        </div>
      </motion.div>

      {/* Loading skeleton */}
      {loading && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-7">
            {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
          <div
            style={{
              background: "var(--bg-glass)",
              backdropFilter: "blur(12px)",
              borderRadius: "20px",
              border: "1px solid var(--border)",
              padding: "60px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "12px",
              color: "var(--text-muted)",
            }}
          >
            <Loader2 size={20} className="spin" />
            <span style={{ fontSize: "14px", fontWeight: 600 }}>Loading analytics…</span>
          </div>
        </div>
      )}

      {/* Loaded state */}
      {!loading && analytics && (
        <>
          {/* Stat cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-7">
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
            {/* Chart header */}
            <div
              style={{
                padding: "18px 24px",
                borderBottom: "1px solid var(--border)",
                display: "flex",
                alignItems: "center",
                gap: "10px",
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
                <BarChart3 size={14} color="#22d3ee" />
              </div>
              <span style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-heading)" }}>
                Average Hash Rate by Strategy
              </span>
            </div>

            {/* Chart */}
            <div style={{ padding: "28px", height: "360px" }}>
              <Bar
                data={{
                  labels: analytics.strategies.map((item) =>
                    item.strategy.replace("Strategy", "")
                  ),
                  datasets: [
                    {
                      label: "Average Hash Rate (H/s)",
                      data: analytics.strategies.map((item) => item.average_hashrate),
                      backgroundColor: "rgba(99,102,241,0.70)",
                      hoverBackgroundColor: "rgba(99,102,241,1)",
                      borderRadius: 10,
                      borderSkipped: false,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false },
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
                      ticks: { color: "#64748b", font: { size: 12, weight: "600" } },
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
                      border: { color: "transparent" },
                    },
                  },
                  animation: { duration: 900 },
                }}
              />
            </div>
          </motion.div>
        </>
      )}

      {/* Empty state when no analytics data */}
      {!loading && !analytics && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            background: "var(--bg-glass)",
            backdropFilter: "blur(12px)",
            borderRadius: "20px",
            border: "1px solid var(--border)",
            padding: "80px 40px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "18px",
              background: "rgba(99,102,241,0.1)",
              border: "1px solid rgba(99,102,241,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
            }}
          >
            <BarChart3 size={26} color="#6366f1" />
          </div>
          <h3 style={{ color: "var(--text-heading)", fontSize: "18px", marginBottom: "8px" }}>
            No Analytics Data
          </h3>
          <p style={{ color: "var(--text-muted)", fontSize: "14px", maxWidth: "320px", margin: "0 auto" }}>
            Run benchmarks from the Dashboard to generate analytics data.
          </p>
        </motion.div>
      )}
    </Layout>
  );
}