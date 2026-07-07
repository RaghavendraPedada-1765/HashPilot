import { motion } from "framer-motion";

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
    <div className="bg-slate-800 rounded-xl shadow-xl mx-12 mb-10 p-8">

      <h2 className="text-2xl font-bold mb-6">
        Benchmark Configuration
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div>
          <label className="block mb-2 font-semibold">
            Difficulty
          </label>

          <select
            value={difficulty}
            onChange={(e) => setDifficulty(Number(e.target.value))}
            className="w-full rounded-lg bg-slate-700 p-3"
          >
            {[1, 2, 3, 4, 5, 6, 7].map(value => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-2 font-semibold">
            Threads
          </label>

          <select
            value={threads}
            onChange={(e) => setThreads(Number(e.target.value))}
            className="w-full rounded-lg bg-slate-700 p-3"
          >
            {[1, 2, 4, 8, 12, 16].map(value => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-2 font-semibold">
            Processes
          </label>

          <select
            value={processes}
            onChange={(e) => setProcesses(Number(e.target.value))}
            className="w-full rounded-lg bg-slate-700 p-3"
          >
            {[1, 2, 4, 8].map(value => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>

      </div>

      <div className="flex justify-center mt-8">

        <motion.button

          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}

          onClick={onRun}

          disabled={loading}

          className={`
                        px-8
                        py-4
                        rounded-xl
                        text-lg
                        font-semibold
                        transition

                        ${loading
              ? "bg-slate-600 cursor-not-allowed"
              : "bg-cyan-500 hover:bg-cyan-400"
            }
                    `}
        >

          {
            loading
              ? "⏳ Running..."
              : "▶ Run Benchmark"
          }

        </motion.button>

      </div>

    </div>
  );
}