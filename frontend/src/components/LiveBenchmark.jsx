import { useEffect, useState } from "react";

const STRATEGIES = [
  "SequentialStrategy",
  "RandomStrategy",
  "MultiThreadStrategy",
  "MultiProcessStrategy",
];

export default function LiveBenchmark({ onEvent }) {
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
    const socket = new WebSocket("ws://127.0.0.1:8000/ws/benchmark");

    socket.onopen = () => {
      console.log("✅ WebSocket Connected");
      socket.send("connect");
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      console.log("WS:", data);
      if (onEvent) onEvent(data);

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

    socket.onclose = () => {
      console.log("❌ WebSocket Closed");
    };

    return () => socket.close();
  }, []);

  return (
    <div
      style={{
        background: "#111827",
        padding: "25px",
        borderRadius: "15px",
        marginBottom: "30px",
      }}
    >
      <h2 style={{ marginBottom: "20px" }}>
        ⚡ Live Benchmark Monitor
      </h2>

      {/* Progress Bar */}
      <div
        style={{
          width: "100%",
          height: "18px",
          background: "#1e293b",
          borderRadius: "10px",
          overflow: "hidden",
          marginBottom: "25px",
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            height: "100%",
            background: "#06b6d4",
            transition: "0.4s",
          }}
        />
      </div>

      {STRATEGIES.map((strategy) => (
        <div
          key={strategy}
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "12px 0",
            borderBottom: "1px solid #334155",
          }}
        >
          <strong>{strategy.replace("Strategy", "")}</strong>

          <span>
            {status[strategy] === "Completed"
              ? "🟢 Completed"
              : status[strategy] === "Running"
                ? "🟡 Running"
                : "⚪ Waiting"}
          </span>
        </div>
      ))}

      <div
        style={{
          marginTop: "25px",
          background: "#0f172a",
          padding: "20px",
          borderRadius: "10px",
        }}
      >
        <h3>📊 Live Statistics</h3>

        <p>
          <strong>Current Strategy:</strong>{" "}
          {liveData.strategy || "-"}
        </p>

        <p>
          <strong>Attempts:</strong>{" "}
          {liveData.attempts.toLocaleString()}
        </p>

        <p>
          <strong>Current Nonce:</strong>{" "}
          {liveData.nonce.toLocaleString()}
        </p>

        <p>
          <strong>Hash Rate:</strong>{" "}
          {Math.round(liveData.hashrate).toLocaleString()} H/s
        </p>

        <p>
          <strong>Elapsed:</strong>{" "}
          {liveData.elapsed} s
        </p>
      </div>
    </div>
  );
}