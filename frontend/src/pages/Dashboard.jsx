import { useState } from "react";

import api from "../api/api";

import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import ControlPanel from "../components/ControlPanel";
import StatCard from "../components/StatCard";
import PerformanceChart from "../components/PerformanceChart";
import BenchmarkTable from "../components/BenchmarkTable";
import Footer from "../components/Footer";

export default function Dashboard() {

  const [results, setResults] = useState([]);
  const [history, setHistory] = useState([]);

  const [loading, setLoading] = useState(false);

  const [difficulty, setDifficulty] = useState(4);
  const [threads, setThreads] = useState(4);
  const [processes, setProcesses] = useState(4);

  async function runBenchmark() {

    try {

      setLoading(true);

      const response = await api.get("/benchmark", {

        params: {

          difficulty,
          threads,
          processes

        }

      });

      setResults(response.data);

      setHistory(previous => [

        {

          timestamp: new Date().toLocaleTimeString(),

          difficulty,

          threads,

          processes,

          results: response.data

        },

        ...previous

      ]);

    }

    catch (error) {

      console.error(error);

    }

    finally {

      setLoading(false);

    }

  }

  let winner = null;

  if (results.length > 0) {

    winner = results.reduce((best, current) =>
      current.hashrate > best.hashrate ? current : best
    );

  }

  return (

    <div className="min-h-screen bg-slate-900 text-white">

      <Navbar />

      <Hero />

      <ControlPanel

        difficulty={difficulty}
        setDifficulty={setDifficulty}

        threads={threads}
        setThreads={setThreads}

        processes={processes}
        setProcesses={setProcesses}

        onRun={runBenchmark}

        loading={loading}

      />

      {

        winner &&

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 px-12 mb-12">

          <StatCard

            title="Winner"

            value={winner.strategy}

            color="bg-green-700"

          />

          <StatCard

            title="Hash Rate"

            value={`${winner.hashrate.toFixed(0)} H/s`}

          />

          <StatCard

            title="Attempts"

            value={winner.attempts.toLocaleString()}

          />

          <StatCard

            title="Time"

            value={`${winner.time.toFixed(4)} s`}

          />

        </div>

      }

      <PerformanceChart results={results} />

      <BenchmarkTable results={results} />

      {/* History */}

      <div className="mx-12 mb-16">

        <h2 className="text-3xl font-bold mb-6">

          Benchmark History

        </h2>

        {

          history.length === 0

            ?

            <div className="bg-slate-800 rounded-xl p-6 text-slate-400">

              No benchmark history yet.

            </div>

            :

            history.map((run, index) => {

              const best = run.results.reduce(

                (a, b) =>

                  a.hashrate > b.hashrate

                    ? a

                    : b

              );

              return (

                <div

                  key={index}

                  className="bg-slate-800 rounded-xl p-5 mb-4"

                >

                  <div className="flex justify-between">

                    <strong>

                      Run #{history.length - index}

                    </strong>

                    <span>

                      {run.timestamp}

                    </span>

                  </div>

                  <p>

                    Difficulty: {run.difficulty}

                  </p>

                  <p>

                    Threads: {run.threads}

                  </p>

                  <p>

                    Processes: {run.processes}

                  </p>

                  <p className="text-green-400">

                    Winner: {best.strategy}

                  </p>

                </div>

              );

            })

        }

      </div>

      <Footer />

    </div>

  );

}