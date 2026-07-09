import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { History as HistoryIcon, Clock } from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/api";
import Layout from "../components/Layout";
import BenchmarkTable from "../components/BenchmarkTable";
import { Card } from "../components/ui/Card";

function SkeletonRow() {
  return (
    <div className="grid grid-cols-5 gap-4 p-4 border-b border-slate-800 animate-pulse">
      <div className="h-4 w-20 bg-slate-800 rounded"></div>
      <div className="h-4 w-32 bg-slate-800 rounded"></div>
      <div className="h-4 w-24 bg-slate-800 rounded"></div>
      <div className="h-4 w-28 bg-slate-800 rounded"></div>
      <div className="h-4 w-16 bg-slate-800 rounded"></div>
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
      toast.error("Failed to load benchmark history.");
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
          <HistoryIcon size={24} className="text-indigo-400" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white m-0 leading-tight">
            Benchmark History
          </h1>
          <p className="text-sm text-slate-400 m-0 mt-1">
            Previous benchmark executions stored in the database
          </p>
        </div>
      </motion.div>

      {/* Content */}
      {loading ? (
        <Card className="overflow-hidden">
          <div className="p-5 border-b border-slate-800 flex items-center gap-3">
            <div className="h-8 w-8 bg-slate-800 rounded-lg animate-pulse"></div>
            <div className="h-4 w-40 bg-slate-800 rounded animate-pulse"></div>
          </div>
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonRow key={i} />
          ))}
        </Card>
      ) : results.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Card className="py-20 px-8 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-6 shadow-inner">
              <Clock size={32} className="text-indigo-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No History Yet</h3>
            <p className="text-slate-400 text-sm max-w-sm mx-auto">
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