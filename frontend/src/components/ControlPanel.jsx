import { motion } from "framer-motion";
import { Play, Hash, Cpu, Layers } from "lucide-react";
import { Card } from "./ui/Card";
import { Button } from "./ui/Button";

function SliderInput({ label, icon: Icon, value, min, max, onChange, disabled }) {
  return (
    <div className="flex flex-col gap-3 group">
      <div className="flex justify-between items-center">
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
          <Icon size={16} />
          {label}
        </label>
        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md px-3 py-1 text-sm font-bold text-cyan-600 dark:text-cyan-400 shadow-inner">
          {value}
        </div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        disabled={disabled}
        className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed accent-cyan-500 hover:accent-cyan-400 transition-all"
      />
    </div>
  );
}

export default function ControlPanel({
  difficulty,
  setDifficulty,
  threads,
  setThreads,
  processes,
  setProcesses,
  loading,
  onRun,
}) {
  return (
    <Card className="p-8 mb-8" animate>
      <div className="flex flex-col lg:flex-row gap-8 lg:items-end justify-between">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 flex-1">
          <SliderInput
            label="Difficulty"
            icon={Hash}
            value={difficulty}
            min={1}
            max={7}
            onChange={setDifficulty}
            disabled={loading}
          />
          <SliderInput
            label="Threads"
            icon={Layers}
            value={threads}
            min={1}
            max={16}
            onChange={setThreads}
            disabled={loading}
          />
          <SliderInput
            label="Processes"
            icon={Cpu}
            value={processes}
            min={1}
            max={16}
            onChange={setProcesses}
            disabled={loading}
          />
        </div>

        <div className="flex-shrink-0 flex items-center justify-center pt-4 lg:pt-0">
          <Button
            variant="primary"
            onClick={onRun}
            disabled={loading}
            className="w-full lg:w-auto px-8 py-3.5 text-lg"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                Initializing...
              </>
            ) : (
              <>
                <Play size={20} fill="currentColor" />
                Run Benchmark
              </>
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
}