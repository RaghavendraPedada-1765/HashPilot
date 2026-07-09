import { Cpu, MemoryStick, Layers, Code, Terminal, Monitor, Server } from "lucide-react";
import { Card } from "./ui/Card";
import { motion } from "framer-motion";

function InfoBlock({ icon: Icon, label, value, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
    >
      <div className="w-10 h-10 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex flex-shrink-0 items-center justify-center border border-indigo-500/20 shadow-inner">
        <Icon size={18} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">{label}</div>
        <div className="text-sm font-semibold text-slate-900 dark:text-slate-200 truncate" title={value?.toString()}>{value || "Unknown"}</div>
      </div>
    </motion.div>
  );
}

export default function SystemInfo({ info }) {
  if (!info) {
    return (
      <Card className="p-8 mb-8">
        <div className="animate-pulse flex flex-col gap-4">
          <div className="h-6 w-48 bg-slate-200 dark:bg-slate-800 rounded"></div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="h-20 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-8 mb-8" animate>
      <div className="flex items-center gap-3 mb-6 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800">
          <Server size={20} className="text-cyan-600 dark:text-cyan-400" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 m-0">System Architecture</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 m-0 mt-0.5">Hardware and runtime environment details</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <InfoBlock icon={Cpu} label="Processor" value={info.cpu} delay={0.1} />
        <InfoBlock icon={Layers} label="Logical Cores" value={info.logical_threads} delay={0.15} />
        <InfoBlock icon={MemoryStick} label="Memory (RAM)" value={`${info.ram_gb} GB`} delay={0.2} />
        <InfoBlock icon={Terminal} label="Operating System" value={info.os} delay={0.25} />
        <InfoBlock icon={Monitor} label="Physical Cores" value={info.physical_cores} delay={0.3} />
        <InfoBlock icon={Server} label="Hostname" value={info.hostname} delay={0.35} />
        <InfoBlock icon={Code} label="Python Version" value={info.python} delay={0.4} />
        <InfoBlock icon={Cpu} label="Architecture" value={info.architecture} delay={0.45} />
      </div>
    </Card>
  );
}