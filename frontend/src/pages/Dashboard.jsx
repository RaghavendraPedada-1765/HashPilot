import { useState, useEffect } from "react";

import api from "../api/api";

import Layout from "../components/Layout";
import Hero from "../components/Hero";
import AIRecommendation from "../components/AIRecommendation";
import SystemInfo from "../components/SystemInfo";
import ProgressPanel from "../components/ProgressPanel";
import ControlPanel from "../components/ControlPanel";
import PerformanceChart from "../components/PerformanceChart";
import BenchmarkTable from "../components/BenchmarkTable";
import StatCard from "../components/StatCard";

import {
  FaTrophy,
  FaBolt,
  FaClock,
  FaHashtag,
} from "react-icons/fa";

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

  useEffect(() => {
    loadSystemInfo();
  }, []);

  async function loadSystemInfo() {

    try {

      const response = await api.get("/system");

      setSystemInfo(response.data);

    }

    catch (error) {

      console.error("System Info Error:", error);

    }

  }

  async function runBenchmark() {

    setLoading(true);

    setProgress(0);

    setStage(0);

    const interval = setInterval(() => {

      setProgress((prev) => {

        if (prev >= 90) return prev;

        const next = prev + 5;

        if (next < 25)
          setStage(0);
        else if (next < 50)
          setStage(1);
        else if (next < 75)
          setStage(2);
        else
          setStage(3);

        return next;

      });

    }, 200);

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

      clearInterval(interval);

      setProgress(100);

      setStage(4);

    }

    catch (error) {

      clearInterval(interval);

      console.error(error);

      alert("Benchmark failed.");

    }

    finally {

      setTimeout(() => {

        setLoading(false);

      }, 500);

    }

  }

  const winner =
    results.length > 0
      ? results.reduce((a, b) =>
        a.hashrate > b.hashrate ? a : b
      )
      : null;

  return (

    <Layout>

      <Hero />

      <AIRecommendation
        analysis={analysis}
      />

      <SystemInfo
        info={systemInfo}
      />

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

      {

        winner && (

          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mx-12 mb-12"
          >

            <StatCard

              title="Winner"

              value={winner.strategy}

              icon={<FaTrophy />}

              color="#16a34a"

            />

            <StatCard

              title="Hash Rate"

              value={`${Math.round(
                winner.hashrate
              ).toLocaleString()} H/s`}

              icon={<FaBolt />}

              color="#2563eb"

            />

            <StatCard

              title="Attempts"

              value={winner.attempts.toLocaleString()}

              icon={<FaHashtag />}

              color="#ea580c"

            />

            <StatCard

              title="Runtime"

              value={`${winner.time.toFixed(4)} s`}

              icon={<FaClock />}

              color="#7c3aed"

            />

          </div>

        )

      }

      <div className="mx-12 mb-12">

        <PerformanceChart
          results={results}
        />

      </div>

      <BenchmarkTable
        results={results}
      />

    </Layout>

  );

}