import { motion } from "framer-motion";
import { Cpu, Hash, Layers, Play, SlidersHorizontal } from "lucide-react";
import { Card } from "./ui/Card";
import { Button } from "./ui/Button";

function SliderInput({ label, icon: Icon, value, min, max, onChange, disabled }) {
  const fill = ((value - min) / (max - min)) * 100;

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4 transition hover:border-cyan-400/30 dark:border-white/10 dark:bg-white/[0.03]">
      <div className="mb-4 flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-200">
          <Icon size={16} className="text-cyan-400" />
          {label}
        </label>
        <div className="rounded-lg border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-sm font-black tabular-nums text-cyan-500">
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
        style={{ "--track-fill": `${fill}%` }}
        className="range-premium w-full cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
      />
      <div className="mt-2 flex justify-between text-[10px] font-semibold text-slate-500">
        <span>{min}</span>
        <span>{max}</span>
      </div>
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
    <Card className="mb-8 overflow-hidden" animate>
      <div className="border-b border-slate-200/80 p-6 dark:border-white/10">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-400/10 text-indigo-300">
              <SlidersHorizontal size={21} />
            </div>
            <div>
              <h2 className="m-0 text-lg font-black text-slate-950 dark:text-white">Control Panel</h2>
              <p className="m-0 mt-1 text-xs text-slate-500">Tune workload parameters and launch a benchmark run.</p>
            </div>
          </div>

          <Button
            variant="primary"
            onClick={onRun}
            disabled={loading}
            className="h-12 w-full px-7 text-base lg:w-auto"
          >
            {loading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="h-5 w-5 rounded-full border-2 border-slate-950 border-t-transparent"
                />
                Running Benchmark
              </>
            ) : (
              <>
                <Play size={19} fill="currentColor" />
                Run Benchmark
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 p-6 md:grid-cols-3">
        <SliderInput label="Difficulty" icon={Hash} value={difficulty} min={1} max={7} onChange={setDifficulty} disabled={loading} />
        <SliderInput label="Threads" icon={Layers} value={threads} min={1} max={16} onChange={setThreads} disabled={loading} />
        <SliderInput label="Processes" icon={Cpu} value={processes} min={1} max={16} onChange={setProcesses} disabled={loading} />
      </div>
    </Card>
  );
}
