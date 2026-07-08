import { motion } from "framer-motion";
import {
  FaSlidersH,
  FaMicrochip,
  FaLayerGroup,
  FaPlay,
} from "react-icons/fa";

export default function ControlPanel({
  difficulty,
  setDifficulty,
  threads,
  setThreads,
  processes,
  setProcesses,
  onRun,
  loading,
}) {
  return (
    <div
      style={{
        background: "#111827",
        borderRadius: "20px",
        padding: "30px",
        marginBottom: "35px",
        boxShadow: "0 15px 35px rgba(0,0,0,.35)",
        border: "1px solid #334155",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "25px",
        }}
      >
        <FaSlidersH color="#38bdf8" size={26} />

        <h2
          style={{
            margin: 0,
            color: "white",
          }}
        >
          Benchmark Configuration
        </h2>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
          gap: "20px",
        }}
      >
        {/* Difficulty */}

        <div>
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "10px",
              color: "#cbd5e1",
              fontWeight: 600,
            }}
          >
            <FaLayerGroup color="#06b6d4" />
            Difficulty
          </label>

          <select
            value={difficulty}
            onChange={(e) =>
              setDifficulty(Number(e.target.value))
            }
            style={selectStyle}
          >
            {[1, 2, 3, 4, 5, 6, 7].map((v) => (
              <option key={v}>{v}</option>
            ))}
          </select>
        </div>

        {/* Threads */}

        <div>
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "10px",
              color: "#cbd5e1",
              fontWeight: 600,
            }}
          >
            <FaMicrochip color="#22c55e" />
            Threads
          </label>

          <select
            value={threads}
            onChange={(e) =>
              setThreads(Number(e.target.value))
            }
            style={selectStyle}
          >
            {[1, 2, 4, 8, 12, 16].map((v) => (
              <option key={v}>{v}</option>
            ))}
          </select>
        </div>

        {/* Processes */}

        <div>
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "10px",
              color: "#cbd5e1",
              fontWeight: 600,
            }}
          >
            <FaMicrochip color="#f97316" />
            Processes
          </label>

          <select
            value={processes}
            onChange={(e) =>
              setProcesses(Number(e.target.value))
            }
            style={selectStyle}
          >
            {[1, 2, 4, 8].map((v) => (
              <option key={v}>{v}</option>
            ))}
          </select>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "35px",
        }}
      >
        <motion.button
          whileHover={{
            scale: 1.05,
          }}
          whileTap={{
            scale: 0.95,
          }}
          disabled={loading}
          onClick={onRun}
          style={{
            background: loading
              ? "#475569"
              : "linear-gradient(90deg,#2563eb,#06b6d4)",
            color: "white",
            border: "none",
            borderRadius: "14px",
            padding: "16px 40px",
            fontSize: "18px",
            fontWeight: "bold",
            cursor: loading ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            boxShadow: "0 10px 25px rgba(37,99,235,.4)",
          }}
        >
          <FaPlay />

          {loading ? "Running Benchmark..." : "Run Benchmark"}
        </motion.button>
      </div>
    </div>
  );
}

const selectStyle = {
  width: "100%",
  padding: "14px",
  borderRadius: "12px",
  border: "1px solid #334155",
  background: "#1e293b",
  color: "white",
  fontSize: "16px",
  outline: "none",
};