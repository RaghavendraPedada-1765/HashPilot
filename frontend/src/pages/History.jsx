import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { History as HistoryIcon, Clock } from "lucide-react";
import api from "../api/api";
import Layout from "../components/Layout";
import BenchmarkTable from "../components/BenchmarkTable";

/* ── Skeleton rows ── */
function SkeletonRow() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "80px 1fr 1fr 1fr 1fr 1fr",
        gap: "16px",
        padding: "14px 20px",
        borderBottom: "1px solid var(--border)",
      }}
    >
      {[80, 160, 100, 120, 130, 100].map((w, i) => (
        <div key={i} className="skeleton" style={{ height: "14px", width: `${w}px`, borderRadius: "6px" }} />
      ))}
    </div>
  );
}

export default function History() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  async function loadHistory() {
    try {
      const response = await api.get("/history");
      setResults(response.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load benchmark history.");
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
            <HistoryIcon size={20} color="#a5b4fc" />
          </div>
          <div>
            <h1 style={{ fontSize: "26px", fontWeight: 800, letterSpacing: "-0.5px" }}>
              Benchmark History
            </h1>
            <p style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "2px" }}>
              Previous benchmark executions stored in the database
            </p>
          </div>
        </div>
      </motion.div>

      {/* Content */}
      {loading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            background: "var(--bg-glass)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            borderRadius: "20px",
            border: "1px solid var(--border)",
            overflow: "hidden",
          }}
        >
          {/* Skeleton header */}
          <div
            style={{
              padding: "18px 24px",
              borderBottom: "1px solid var(--border)",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <div className="skeleton" style={{ width: "30px", height: "30px", borderRadius: "8px" }} />
            <div className="skeleton" style={{ width: "160px", height: "14px" }} />
          </div>

          {/* Skeleton rows */}
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonRow key={i} />
          ))}
        </motion.div>
      ) : results.length === 0 ? (
        /* Empty state */
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            background: "var(--bg-glass)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
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
            <Clock size={26} color="#6366f1" />
          </div>
          <h3 style={{ color: "var(--text-heading)", fontSize: "18px", marginBottom: "8px" }}>
            No History Yet
          </h3>
          <p style={{ color: "var(--text-muted)", fontSize: "14px", maxWidth: "320px", margin: "0 auto" }}>
            Run your first benchmark from the Dashboard to start building history.
          </p>
        </motion.div>
      ) : (
        <BenchmarkTable results={results} />
      )}
    </Layout>
  );
}