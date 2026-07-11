import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Clock,
  Download,
  History as HistoryIcon,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/api";
import Layout from "../components/Layout";
import BenchmarkTable from "../components/BenchmarkTable";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function downloadBlob(content, filename, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.setAttribute("download", filename);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function toCsv(rows) {
  const headers = ["id", "strategy", "difficulty", "attempts", "hashrate", "runtime", "winner"];
  const lines = rows.map((r) =>
    headers.map((k) => `"${String(r[k] ?? "").replaceAll('"', '""')}"`).join(",")
  );
  return [headers.join(","), ...lines].join("\n");
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function SkeletonRow() {
  return (
    <div className="grid grid-cols-5 gap-4 border-b border-slate-200 p-4 animate-pulse dark:border-white/10">
      {[20, 32, 24, 28, 16].map((w, i) => (
        <div
          key={i}
          className={`h-4 w-${w} rounded bg-slate-200 dark:bg-white/10`}
        />
      ))}
    </div>
  );
}

// ─── Filters ──────────────────────────────────────────────────────────────────

const STRATEGY_OPTIONS = [
  "All",
  "SequentialStrategy",
  "RandomStrategy",
  "MultiThreadStrategy",
  "MultiProcessStrategy",
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function History() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  /** Text search across strategy field */
  const [searchTerm, setSearchTerm] = useState("");
  /** Strategy dropdown filter */
  const [strategyFilter, setStrategyFilter] = useState("All");
  /** Winner-only toggle */
  const [winnersOnly, setWinnersOnly] = useState(false);

  useEffect(() => {
    async function loadHistory() {
      try {
        const response = await api.get("/history");
        setResults(response.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load benchmark history.");
      } finally {
        setLoading(false);
      }
    }

    loadHistory();
  }, []);

  // ── Filtered rows ──────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    return results.filter((r) => {
      const matchSearch =
        !searchTerm ||
        r.strategy.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStrategy =
        strategyFilter === "All" || r.strategy === strategyFilter;
      const matchWinner = !winnersOnly || r.winner;
      return matchSearch && matchStrategy && matchWinner;
    });
  }, [results, searchTerm, strategyFilter, winnersOnly]);

  // ── CSV export ──────────────────────────────────────────────────────────────
  function exportCsv() {
    if (!filtered.length) {
      toast.error("No data to export.");
      return;
    }
    downloadBlob(
      toCsv(filtered),
      `hashpilot_history_${Date.now()}.csv`,
      "text/csv;charset=utf-8"
    );
    toast.success("History exported as CSV.");
  }

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
          <HistoryIcon size={24} className="text-indigo-300" />
        </div>
        <div>
          <h1 className="m-0 text-3xl font-black leading-tight tracking-tight text-slate-950 dark:text-white">
            Benchmark History
          </h1>
          <p className="m-0 mt-1 text-sm text-slate-500">
            Previous benchmark executions stored in the database
          </p>
        </div>
      </motion.div>

      {/* ── Filters + export bar ────────────────────────────────────────── */}
      {!loading && results.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-wrap"
        >
          {/* Text search */}
          <div className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-slate-300 bg-white/70 px-3 py-2 text-slate-500 transition focus-within:border-cyan-400 focus-within:ring-2 focus-within:ring-cyan-400/15 dark:border-white/10 dark:bg-slate-950/50 dark:text-slate-400">
            <Search size={16} className="shrink-0" />
            <input
              type="text"
              placeholder="Search by strategy…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-slate-200 dark:placeholder:text-slate-500"
            />
          </div>

          {/* Strategy dropdown */}
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={15} className="text-slate-400" />
            <select
              value={strategyFilter}
              onChange={(e) => setStrategyFilter(e.target.value)}
              className="rounded-xl border border-slate-300 bg-white/70 px-3 py-2 text-sm font-semibold text-slate-700 outline-none transition focus:border-cyan-400 dark:border-white/10 dark:bg-slate-950/50 dark:text-slate-300"
            >
              {STRATEGY_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt === "All" ? "All Strategies" : opt.replace("Strategy", "")}
                </option>
              ))}
            </select>
          </div>

          {/* Winners only toggle */}
          <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-300 bg-white/70 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 dark:border-white/10 dark:bg-slate-950/50 dark:text-slate-300">
            <input
              type="checkbox"
              checked={winnersOnly}
              onChange={(e) => setWinnersOnly(e.target.checked)}
              className="accent-cyan-400"
            />
            Winners only
          </label>

          {/* CSV export */}
          <Button variant="outline" onClick={exportCsv} className="shrink-0">
            <Download size={16} />
            Export CSV
          </Button>
        </motion.div>
      )}

      {/* ── Content ─────────────────────────────────────────────────────── */}
      {loading ? (
        <Card className="overflow-hidden">
          <div className="flex items-center gap-3 border-b border-slate-200 p-5 dark:border-white/10">
            <div className="h-8 w-8 rounded-lg bg-slate-200 animate-pulse dark:bg-white/10" />
            <div className="h-4 w-40 rounded bg-slate-200 animate-pulse dark:bg-white/10" />
          </div>
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonRow key={i} />
          ))}
        </Card>
      ) : results.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Card className="flex flex-col items-center justify-center px-8 py-20 text-center">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-indigo-400/20 bg-indigo-400/10 shadow-inner">
              <Clock size={32} className="text-indigo-300" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-slate-950 dark:text-white">
              No History Yet
            </h3>
            <p className="mx-auto max-w-sm text-sm text-slate-500">
              Run your first benchmark from the Dashboard to start building
              history.
            </p>
          </Card>
        </motion.div>
      ) : filtered.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Card className="flex flex-col items-center justify-center px-8 py-16 text-center">
            <Search size={32} className="mb-4 text-slate-300" />
            <h3 className="mb-2 text-lg font-bold text-slate-950 dark:text-white">
              No results match your filters
            </h3>
            <p className="text-sm text-slate-500">
              Try adjusting the search term or strategy filter.
            </p>
          </Card>
        </motion.div>
      ) : (
        <BenchmarkTable results={filtered} />
      )}

      {/* Row count */}
      {!loading && results.length > 0 && (
        <p className="mt-4 text-center text-xs text-slate-500">
          Showing{" "}
          <span className="font-bold text-slate-700 dark:text-slate-300">
            {filtered.length}
          </span>{" "}
          of{" "}
          <span className="font-bold text-slate-700 dark:text-slate-300">
            {results.length}
          </span>{" "}
          records
        </p>
      )}
    </Layout>
  );
}
