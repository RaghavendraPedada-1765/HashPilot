import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  Clock,
  Hash,
  Zap,
  CheckCircle2,
  PlayCircle,
  Clock4,
} from "lucide-react";
import { Card } from "./ui/Card";

const STRATEGIES = [
  "SequentialStrategy",
  "RandomStrategy",
  "MultiThreadStrategy",
  "MultiProcessStrategy",
];

export default function LiveBenchmark({ onEvent }) {
  const callbackRef = useRef(onEvent);

  const [progress, setProgress] = useState(0);

  const [status, setStatus] = useState({
    SequentialStrategy: "Waiting",
    RandomStrategy: "Waiting",
    MultiThreadStrategy: "Waiting",
    MultiProcessStrategy: "Waiting",
  });

  const [liveData, setLiveData] = useState({
    strategy: "",
    attempts: 0,
    nonce: 0,
    hashrate: 0,
    elapsed: 0,
  });

  // Keep latest callback
  useEffect(() => {
    callbackRef.current = onEvent;
  }, [onEvent]);

  // Create websocket only once
  useEffect(() => {
    const socket = new WebSocket("ws://127.0.0.1:8000/ws/benchmark");

    socket.onopen = () => {
      console.log("✅ WebSocket Connected");
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (callbackRef.current) {
        callbackRef.current(data);
      }

      switch (data.event) {
        case "strategy_started":
          setStatus((prev) => ({
            ...prev,
            [data.strategy]: "Running",
          }));
          setProgress(data.progress);
          break;

        case "progress":
          setLiveData({
            strategy: data.strategy,
            attempts: data.attempts,
            nonce: data.nonce,
            hashrate: data.hashrate,
            elapsed: data.elapsed,
          });
          break;

        case "strategy_completed":
          setStatus((prev) => ({
            ...prev,
            [data.strategy]: "Completed",
          }));
          setProgress(data.progress);
          break;

        default:
          break;
      }
    };

    socket.onerror = (err) => {
      // Intentionally suppressed to keep console clean
    };

    socket.onclose = () => {
      console.log("❌ WebSocket Closed");
    };

    return () => {
      if (socket) {
        if (socket.readyState === WebSocket.CONNECTING) {
          // Wait for connection to open before closing to prevent browser warnings
          socket.onopen = () => socket.close();
        } else if (socket.readyState === WebSocket.OPEN) {
          socket.close();
        }
      }
    };
  }, []);

  const StatusIcon = ({ state }) => {
    if (state === "Completed")
      return <CheckCircle2 size={16} className="text-emerald-500" />;

    if (state === "Running")
      return (
        <PlayCircle
          size={16}
          className="text-cyan-500 animate-pulse"
        />
      );

    return <Clock4 size={16} className="text-slate-400 dark:text-slate-600" />;
  };

  const StatusText = ({ state }) => {
    if (state === "Completed")
      return (
        <span className="text-emerald-600 dark:text-emerald-400 font-medium">
          Completed
        </span>
      );

    if (state === "Running")
      return (
        <span className="text-cyan-600 dark:text-cyan-400 font-medium">
          Running
        </span>
      );

    return (
      <span className="text-slate-500 font-medium">
        Waiting
      </span>
    );
  };

  return (
    <Card className="mb-8 overflow-hidden" animate>

      {/* Header */}

      <div className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 p-6 flex items-center justify-between">

        <div className="flex items-center gap-3">

          <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center">

            <Activity size={20} className="text-cyan-600 dark:text-cyan-400" />

          </div>

          <div>

            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Live Benchmark Monitor
            </h2>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Real-time solver metrics
            </p>

          </div>

        </div>

        <div className="text-right">

          <div className="text-3xl font-black text-slate-900 dark:text-white">
            {progress}%
          </div>

          <div className="text-xs text-slate-500 uppercase">
            Overall Progress
          </div>

        </div>

      </div>

      {/* Progress */}

      <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800">

        <motion.div
          className="h-full bg-cyan-500"
          animate={{ width: `${progress}%` }}
        />

      </div>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Strategies */}

        <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-3">

          {STRATEGIES.map((strategy) => {

            const state = status[strategy];

            return (

              <div
                key={strategy}
                className="flex items-center justify-between p-3"
              >

                <div className="flex items-center gap-2">

                  <StatusIcon state={state} />

                  <span className="text-slate-900 dark:text-slate-200">

                    {strategy.replace("Strategy", "")}

                  </span>

                </div>

                <StatusText state={state} />

              </div>

            );

          })}

        </div>

        {/* Live Metrics */}

        <div className="lg:col-span-2 grid grid-cols-2 gap-4">

          <Metric
            title="Active Strategy"
            value={
              liveData.strategy
                ? liveData.strategy.replace("Strategy", "")
                : "Standby"
            }
          />

          <Metric
            title="Hash Rate"
            value={`${Math.round(
              liveData.hashrate
            ).toLocaleString()} H/s`}
          />

          <Metric
            title="Attempts"
            value={liveData.attempts.toLocaleString()}
          />

          <Metric
            title="Nonce"
            value={liveData.nonce.toLocaleString()}
          />

          <Metric
            title="Elapsed"
            value={`${liveData.elapsed.toFixed(2)} sec`}
          />

        </div>

      </div>

    </Card>
  );
}

function Metric({ title, value }) {
  return (
    <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
      <div className="text-xs uppercase text-slate-500 mb-2">
        {title}
      </div>

      <div className="text-2xl font-bold text-slate-900 dark:text-white">
        {value}
      </div>
    </div>
  );
}