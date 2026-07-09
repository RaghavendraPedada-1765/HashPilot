import { useState, useEffect } from "react";

import api from "../api/api";

import Layout from "../components/Layout";
import Hero from "../components/Hero";
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

  // AI Prediction
  const [prediction, setPrediction] = useState(null);

  useEffect(() => {
    loadSystemInfo();
  }, []);

  async function loadSystemInfo() {
    try {
      const response = await api.get("/system");
      setSystemInfo(response.data);
    } catch (error) {
      console.error("System Info Error:", error);
    }
  }

  // ============================
  // AI Prediction
  // ============================
  useEffect(() => {

    async function fetchPrediction() {

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

    }

    fetchPrediction();

  }, [difficulty, threads, processes]);

  async function runBenchmark() {

    setLoading(true);
    setProgress(0);
    setStage(0);
    setResults([]);

    try {

      const response = await api.get("/benchmark", {

        params: {

          difficulty,

          threads,

          processes,

        },

      });

      setResults(response.data.results);

      setAnalysis(response.data.analysis);

      setProgress(100);

      setStage(4);

    }

    catch (error) {

      console.error(error);

      alert("Benchmark failed.");

    }

    finally {

      setTimeout(() => {

        setLoading(false);

      }, 500);

    }

  }

  const handleWSEvent = (data) => {

    if (data.event === "strategy_started") {

      setProgress(data.progress);

      setStage(data.current - 1);

      setResults(prev => {

        const filtered = prev.filter(

          r => r.strategy !== data.strategy

        );

        return [

          ...filtered,

          {

            strategy: data.strategy,

            hashrate: 0,

            attempts: 0,

            time: 0,

          },

        ];

      });

    }

    else if (data.event === "progress") {

      setResults(prev =>

        prev.map(r =>

          r.strategy === data.strategy

            ? {

              ...r,

              hashrate: data.hashrate,

              attempts: data.attempts,

              time: data.elapsed,

            }

            : r

        )

      );

    }

    else if (data.event === "strategy_completed") {

      setProgress(data.progress);

      setStage(data.current);

      setResults(prev => {

        const filtered = prev.filter(

          r => r.strategy !== data.strategy

        );

        return [

          ...filtered,

          data.result,

        ];

      });

    }

  };

  const winner =
    results.length > 0
      ? results.reduce(
        (a, b) =>
          a.hashrate > b.hashrate ? a : b,
        results[0]
      )
      : null;

  return (

    <Layout>

      <Hero />

      <AIRecommendation analysis={analysis} />

      <SystemInfo info={systemInfo} />

      <LiveBenchmark onEvent={handleWSEvent} />

      {/* AI Prediction */}
      <AIPredictionCard prediction={prediction} />

      <ProgressPanel

        loading={loading}

        progress={progress}

        stage={stage}

      />

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

      <div className="flex justify-center mb-8">

        <DownloadReportButton

          difficulty={difficulty}

          threads={threads}

          processes={processes}

        />

      </div>

      {winner && (

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

          <StatCard

            title="Winner"

            value={winner.strategy}

            icon={<Trophy size={20} />}

            color="#10b981"

            delay={0}

          />

          <StatCard

            title="Hash Rate"

            value={winner.hashrate.toFixed(2)}

            icon={<Zap size={20} />}

            color="#06b6d4"

            delay={0.08}

          />

          <StatCard

            title="Attempts"

            value={winner.attempts.toLocaleString()}

            icon={<Hash size={20} />}

            color="#f59e0b"

            delay={0.16}

          />

          <StatCard

            title="Runtime"

            value={`${winner.time.toFixed(3)} s`}

            icon={<Clock size={20} />}

            color="#8b5cf6"

            delay={0.24}

          />

        </div>

      )}

      <div className="mb-8">

        <PerformanceChart results={results} />

      </div>

      <BenchmarkTable results={results} />

    </Layout>

  );

}