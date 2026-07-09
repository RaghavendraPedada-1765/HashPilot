import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Clock, History as HistoryIcon } from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/api";
import Layout from "../components/Layout";
import BenchmarkTable from "../components/BenchmarkTable";
import { Card } from "../components/ui/Card";

function SkeletonRow() {
  return (
    <div className="grid grid-cols-5 gap-4 border-b border-slate-200 p-4 animate-pulse dark:border-white/10">
      <div className="h-4 w-20 rounded bg-slate-200 dark:bg-white/10" />
      <div className="h-4 w-32 rounded bg-slate-200 dark:bg-white/10" />
      <div className="h-4 w-24 rounded bg-slate-200 dark:bg-white/10" />
      <div className="h-4 w-28 rounded bg-slate-200 dark:bg-white/10" />
      <div className="h-4 w-16 rounded bg-slate-200 dark:bg-white/10" />
    </div>
  );
}

export default function History() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <Layout>
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
            <h3 className="mb-2 text-xl font-bold text-slate-950 dark:text-white">No History Yet</h3>
            <p className="mx-auto max-w-sm text-sm text-slate-500">
              Run your first benchmark from the Dashboard to start building history.
            </p>
          </Card>
        </motion.div>
      ) : (
        <BenchmarkTable results={results} />
      )}
    </Layout>
  );
}
