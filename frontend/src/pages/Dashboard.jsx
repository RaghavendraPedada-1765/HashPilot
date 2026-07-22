import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

import api from "../api/api";

import Layout from "../components/Layout";
import AIRecommendation from "../components/AIRecommendation";
import AIPredictionCard from "../components/AIPredictionCard";
import SystemInfo from "../components/SystemInfo";
import ProgressPanel from "../components/ProgressPanel";
import ControlPanel from "../components/ControlPanel";
import PerformanceChart from "../components/PerformanceChart";
import BenchmarkTable from "../components/BenchmarkTable";
import StatCard from "../components/StatCard";
import DownloadReportButton from "../components/DownloadReportButton";
import LiveBenchmark from "../components/LiveBenchmark";

import { Trophy, Zap, Clock, Hash } from "lucide-react";

export default function Dashboard() {
  const [difficulty, setDifficulty] = useState(4);
  const [threads, setThreads] = useState(4);
  const [processes, setProcesses] = useState(4);

  const [loading, setLoading] = useState(false);

  const [results, setResults] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [systemInfo, setSystemInfo] = useState(null);

  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState(0);

  /** AI Prediction from the ML model (before benchmark runs) */
  const [prediction, setPrediction] = useState(null);

  /** Actual winner after benchmark completes — used for Predicted vs Actual */
  const [actualWinner, setActualWinner] = useState(null);

  // ── System info ────────────────────────────────────────────────────────────
  useEffect(() => {
    async function loadSystemInfo() {
      try {
        const response = await api.get("/system");
        setSystemInfo(response.data);
      } catch (error) {
        console.error("System Info Error:", error);
      }
    }
    loadSystemInfo();
  }, []);

  // ── AI Prediction (re-fetched whenever params change) ─────────────────────
  const fetchPrediction = useCallback(async () => {
    try {
      const response = await api.post("/predict/", {
        difficulty,
        threads,
        processes,
      });
      setPrediction(response.data);
    } catch (error) {
      console.error("Prediction Error:", error);
    }
  }, [difficulty, threads, processes]);

  useEffect(() => {
    let cancelled = false;
    api.post("/predict/", { difficulty, threads, processes })
      .then(r => { if (!cancelled) setPrediction(r.data); })
      .catch(e => console.error("Prediction Error:", e));
    return () => { cancelled = true; };
  }, [difficulty, threads, processes]);

  // ── Run benchmark ──────────────────────────────────────────────────────────
  async function runBenchmark() {
    setLoading(true);
    setProgress(0);
    setStage(0);
    setResults([]);
    setActualWinner(null);

    const toastId = toast.loading("Running benchmark…");

    try {
      const response = await api.get("/benchmark", {
        params: { difficulty, threads, processes },
      });

      const { results: newResults, analysis: newAnalysis } = response.data;

      setResults(newResults);
      setAnalysis(newAnalysis);
      setProgress(100);
      setStage(4);

      const winner = newResults.reduce((a, b) =>
        a.hashrate > b.hashrate ? a : b,
        newResults[0]
      );
      setActualWinner(winner);

      toast.success(
        `Benchmark complete! Winner: ${winner.strategy.replace("Strategy", "")}`,
        { id: toastId, duration: 4000 }
      );
    } catch (error) {
      console.error(error);
      toast.error(
        "Benchmark failed. Check the backend connection and try again.",
        { id: toastId }
      );
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  }

  // ── WebSocket event handler ────────────────────────────────────────────────
  const handleWSEvent = useCallback((data) => {
    if (data.event === "strategy_started") {
      setProgress(data.progress ?? 0);
      setStage((data.current ?? 1) - 1);
      setResults((prev) => {
        const filtered = prev.filter((r) => r.strategy !== data.strategy);
        return [
          ...filtered,
          { strategy: data.strategy, hashrate: 0, attempts: 0, time: 0 },
        ];
      });
    } else if (data.event === "progress") {
      setResults((prev) =>
        prev.map((r) =>
          r.strategy === data.strategy
            ? { ...r, hashrate: data.hashrate, attempts: data.attempts, time: data.elapsed }
            : r
        )
      );
    } else if (data.event === "strategy_completed") {
      setProgress(data.progress ?? 0);
      setStage(data.current ?? 0);
      setResults((prev) => {
        const filtered = prev.filter((r) => r.strategy !== data.strategy);
        return [...filtered, data.result];
      });
    }
  }, []);

  // ── Derived: winner for stat cards ─────────────────────────────────────────
  const winner =
    results.length > 0
      ? results.reduce((a, b) => (a.hashrate > b.hashrate ? a : b), results[0])
      : null;

  return (
    <Layout>
      <AIRecommendation analysis={analysis} />

      {/* Live Monitor + AI Prediction */}
      <div className="grid grid-cols-1 xl:grid-cols-[1.25fr_0.75fr] gap-6 mb-8">
        <LiveBenchmark onEvent={handleWSEvent} />
        {/*
          Pass actualWinner so the card can compare Predicted vs Actual
          once a benchmark run has completed.
        */}
        <AIPredictionCard prediction={prediction} actualWinner={actualWinner} onRetrain={fetchPrediction} />
      </div>

      <ProgressPanel loading={loading} progress={progress} stage={stage} />

      <ControlPanel
        difficulty={difficulty}
        setDifficulty={setDifficulty}
        threads={threads}
        setThreads={setThreads}
        processes={processes}
        setProcesses={setProcesses}
        loading={loading}
        onRun={runBenchmark}
      />

      <SystemInfo info={systemInfo} />

      {winner && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard
            title="Winner"
            value={winner.strategy}
            icon={<Trophy size={18} />}
            color="#10b981"
            delay={0}
          />
          <StatCard
            title="Hash Rate"
            value={winner.hashrate.toFixed(2)}
            icon={<Zap size={18} />}
            color="#3b82f6"
            delay={0.06}
          />
          <StatCard
            title="Attempts"
            value={winner.attempts.toLocaleString()}
            icon={<Hash size={18} />}
            color="#f59e0b"
            delay={0.12}
          />
          <StatCard
            title="Runtime"
            value={`${winner.time.toFixed(3)} s`}
            icon={<Clock size={18} />}
            color="#8b5cf6"
            delay={0.18}
          />
        </div>
      )}

      <div className="mb-6">
        <PerformanceChart results={results} />
      </div>

      <BenchmarkTable results={results} />

      {results.length > 0 && (
        <div className="mt-4 mb-6 flex justify-end">
          <DownloadReportButton
            difficulty={difficulty}
            threads={threads}
            processes={processes}
          />
        </div>
      )}
    </Layout>
  );
}
