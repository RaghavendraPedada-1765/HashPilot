import { motion } from "framer-motion";
import {
  FaTrophy,
  FaMedal,
  FaBolt,
  FaClock,
} from "react-icons/fa";

export default function BenchmarkTable({ results }) {
  if (!results || results.length === 0) {
    return (
      <div
        style={{
          background: "#1e293b",
          borderRadius: "18px",
          padding: "60px",
          textAlign: "center",
          color: "#94a3b8",
          marginTop: "30px",
          boxShadow: "0 10px 30px rgba(0,0,0,.25)",
        }}
      >
        <h2>No benchmark results available.</h2>
      </div>
    );
  }

  const winner = results.reduce((best, current) =>
    current.hashrate > best.hashrate ? current : best
  );

  return (
    <div
      style={{
        background: "#111827",
        borderRadius: "18px",
        overflow: "hidden",
        marginTop: "40px",
        boxShadow: "0 15px 35px rgba(0,0,0,.35)",
      }}
    >
      <div
        style={{
          padding: "24px 30px",
          borderBottom: "1px solid #334155",
          background:
            "linear-gradient(90deg,#2563eb,#0f172a)",
        }}
      >
        <h2
          style={{
            margin: 0,
            color: "white",
          }}
        >
          📊 Benchmark Results
        </h2>
      </div>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr
            style={{
              background: "#1e293b",
            }}
          >
            <th style={thStyle}>Strategy</th>
            <th style={thStyle}>Runtime</th>
            <th style={thStyle}>Attempts</th>
            <th style={thStyle}>Hash Rate</th>
            <th style={thStyle}>Status</th>
          </tr>
        </thead>

        <tbody>
          {results.map((item, index) => {
            const runtime = item.time ?? item.runtime;
            const isWinner =
              item.strategy === winner.strategy;

            return (
              <motion.tr
                key={index}
                whileHover={{
                  backgroundColor: "#1e293b",
                }}
                transition={{
                  duration: 0.2,
                }}
                style={{
                  borderBottom:
                    "1px solid #334155",
                }}
              >
                <td style={tdStyle}>
                  {item.strategy}
                </td>

                <td style={tdStyle}>
                  <FaClock
                    color="#38bdf8"
                    style={{
                      marginRight: "8px",
                    }}
                  />

                  {runtime.toFixed(4)} s
                </td>

                <td style={tdStyle}>
                  {item.attempts.toLocaleString()}
                </td>

                <td style={tdStyle}>
                  <FaBolt
                    color="#22c55e"
                    style={{
                      marginRight: "8px",
                    }}
                  />

                  {Math.round(
                    item.hashrate
                  ).toLocaleString()}{" "}
                  H/s
                </td>

                <td style={tdStyle}>
                  {isWinner ? (
                    <span
                      style={{
                        background: "#16a34a",
                        color: "white",
                        padding:
                          "8px 16px",
                        borderRadius: "999px",
                        fontWeight: 600,
                        display:
                          "inline-flex",
                        alignItems:
                          "center",
                        gap: "8px",
                      }}
                    >
                      <FaTrophy />
                      Winner
                    </span>
                  ) : (
                    <span
                      style={{
                        background:
                          "#475569",
                        color: "white",
                        padding:
                          "8px 16px",
                        borderRadius:
                          "999px",
                        display:
                          "inline-flex",
                        alignItems:
                          "center",
                        gap: "8px",
                      }}
                    >
                      <FaMedal />
                      Runner Up
                    </span>
                  )}
                </td>
              </motion.tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

const thStyle = {
  color: "#cbd5e1",
  padding: "18px",
  textAlign: "left",
  fontWeight: 700,
};

const tdStyle = {
  padding: "18px",
  color: "white",
};