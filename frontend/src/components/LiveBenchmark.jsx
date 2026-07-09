import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  CheckCircle2,
  Clock,
  Clock4,
  Gauge,
  Hash,
  PlayCircle,
  Radio,
  Signal,
  Zap,
} from "lucide-react";
import { Card } from "./ui/Card";
import { Badge } from "./ui/Badge";

const STRATEGIES = [
  "SequentialStrategy",
  "RandomStrategy",
  "MultiThreadStrategy",
  "MultiProcessStrategy",
];

export default function LiveBenchmark({ onEvent }) {
  const callbackRef = useRef(onEvent);
  const [connectionState, setConnectionState] = useState("connecting");
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

  useEffect(() => {
    callbackRef.current = onEvent;
  }, [onEvent]);

  useEffect(() => {
    const socket = new WebSocket("ws://127.0.0.1:8000/ws/benchmark");

    socket.onopen = () => setConnectionState("connected");

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (callbackRef.current) {
        callbackRef.current(data);
      }

      switch (data.event) {
        case "strategy_started":
          setStatus((prev) => ({ ...prev, [data.strategy]: "Running" }));
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
          setStatus((prev) => ({ ...prev, [data.strategy]: "Completed" }));
          setProgress(data.progress);
          break;

        default:
          break;
      }
    };

    socket.onerror = () => setConnectionState("degraded");
    socket.onclose = () => setConnectionState("offline");

    return () => {
      if (socket.readyState === WebSocket.CONNECTING) {
        socket.onopen = () => socket.close();
      } else if (socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, []);

  const activeStrategy = liveData.strategy ? liveData.strategy.replace("Strategy", "") : "Standby";

  return (
    <Card className="h-full overflow-hidden" animate>
      <div className="relative overflow-hidden border-b border-slate-200/80 p-6 dark:border-white/10">
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(34,211,238,0.10),transparent_42%,rgba(99,102,241,0.10))]" />
        <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/25 bg-cyan-400/10 text-cyan-300">
              <Activity size={22} />
            </div>
            <div>
              <h2 className="m-0 text-lg font-black text-slate-950 dark:text-white">Live Benchmark Monitor</h2>
              <p className="m-0 mt-1 text-xs text-slate-500">Grafana-style solver telemetry</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ConnectionBadge state={connectionState} />
            <div className="text-right">
              <div className="text-3xl font-black tabular-nums text-slate-950 dark:text-white">{progress}%</div>
              <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">Progress</div>
            </div>
          </div>
        </div>
      </div>

      <div className="h-1.5 w-full bg-slate-200 dark:bg-white/10">
        <motion.div
          className="h-full rounded-r-full bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-400"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>

      <div className="grid grid-cols-1 gap-5 p-6 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4 dark:border-white/10 dark:bg-white/[0.03]">
          <div className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
            <Radio size={14} />
            Strategy Timeline
          </div>
          <div className="space-y-3">
            {STRATEGIES.map((strategy, index) => {
              const state = status[strategy];
              return (
                <div key={strategy} className="relative flex items-center gap-3">
                  {index < STRATEGIES.length - 1 && <div className="absolute left-[15px] top-8 h-7 w-px bg-slate-200 dark:bg-white/10" />}
                  <StatusIcon state={state} />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-bold text-slate-950 dark:text-white">
                      {strategy.replace("Strategy", "")}
                    </div>
                    <StatusText state={state} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Metric icon={Gauge} title="Current Strategy" value={activeStrategy} />
          <Metric icon={Zap} title="Hash Rate" value={`${Math.round(liveData.hashrate).toLocaleString()} H/s`} accent />
          <Metric icon={Hash} title="Attempts" value={liveData.attempts.toLocaleString()} />
          <Metric icon={Hash} title="Nonce" value={liveData.nonce.toLocaleString()} />
          <Metric icon={Clock} title="Elapsed Time" value={`${liveData.elapsed.toFixed(2)} sec`} />
        </div>
      </div>
    </Card>
  );
}

function ConnectionBadge({ state }) {
  const config = {
    connected: { label: "Connected", variant: "success" },
    connecting: { label: "Connecting", variant: "warning" },
    degraded: { label: "Degraded", variant: "warning" },
    offline: { label: "Offline", variant: "danger" },
  }[state];

  return (
    <Badge variant={config.variant} dot className="capitalize">
      <Signal size={12} />
      {config.label}
    </Badge>
  );
}

function StatusIcon({ state }) {
  if (state === "Completed") {
    return (
      <div className="z-10 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-400/15 text-emerald-400">
        <CheckCircle2 size={17} />
      </div>
    );
  }

  if (state === "Running") {
    return (
      <motion.div
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 1.2, repeat: Infinity }}
        className="z-10 flex h-8 w-8 items-center justify-center rounded-full bg-cyan-400/15 text-cyan-300 shadow-[0_0_22px_rgba(34,211,238,0.25)]"
      >
        <PlayCircle size={17} />
      </motion.div>
    );
  }

  return (
    <div className="z-10 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-white/[0.06] dark:text-slate-500">
      <Clock4 size={16} />
    </div>
  );
}

function StatusText({ state }) {
  const className =
    state === "Completed"
      ? "text-emerald-500"
      : state === "Running"
        ? "text-cyan-400"
        : "text-slate-500";

  return <div className={`text-xs font-semibold ${className}`}>{state}</div>;
}

function Metric({ icon: Icon, title, value, accent = false }) {
  return (
    <motion.div
      layout
      className={`rounded-2xl border p-4 transition ${
        accent
          ? "border-cyan-400/25 bg-cyan-400/10"
          : "border-slate-200/80 bg-slate-50/70 dark:border-white/10 dark:bg-white/[0.03]"
      }`}
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">{title}</span>
        <Icon size={15} className={accent ? "text-cyan-300" : "text-slate-400"} />
      </div>
      <div className="truncate text-xl font-black tabular-nums text-slate-950 dark:text-white" title={value}>
        {value}
      </div>
    </motion.div>
  );
}
