import { Code, Cpu, HardDrive, Layers, MemoryStick, Monitor, Server, Terminal } from "lucide-react";
import { motion } from "framer-motion";
import { Card } from "./ui/Card";

function InfoBlock({ icon: Icon, label, value, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4 transition hover:-translate-y-0.5 hover:border-cyan-400/30 hover:shadow-[0_14px_34px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-white/[0.03] dark:hover:shadow-[0_14px_34px_rgba(0,0,0,0.25)]"
    >
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-indigo-400/20 bg-indigo-400/10 text-indigo-300">
        <Icon size={18} />
      </div>
      <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">{label}</div>
      <div className="mt-1 truncate text-sm font-black text-slate-950 dark:text-white" title={value?.toString()}>
        {value || "Unknown"}
      </div>
    </motion.div>
  );
}

export default function SystemInfo({ info }) {
  if (!info) {
    return (
      <Card className="mb-8 p-6">
        <div className="animate-pulse">
          <div className="mb-6 h-6 w-52 rounded bg-slate-200 dark:bg-white/10" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-28 rounded-2xl bg-slate-200 dark:bg-white/10" />
            ))}
          </div>
        </div>
      </Card>
    );
  }

  const items = [
    { icon: Cpu, label: "CPU", value: info.cpu },
    { icon: MemoryStick, label: "RAM", value: `${info.ram_gb} GB` },
    { icon: Layers, label: "Threads", value: info.logical_threads },
    { icon: HardDrive, label: "Architecture", value: info.architecture },
    { icon: Terminal, label: "OS", value: info.os },
    { icon: Server, label: "Hostname", value: info.hostname },
    { icon: Monitor, label: "Physical Cores", value: info.physical_cores },
    { icon: Code, label: "Python", value: info.python },
  ];

  return (
    <Card className="mb-8 overflow-hidden" animate>
      <div className="border-b border-slate-200/80 p-6 dark:border-white/10">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-300">
            <Server size={21} />
          </div>
          <div>
            <h3 className="m-0 text-lg font-black text-slate-950 dark:text-white">System Info</h3>
            <p className="m-0 mt-1 text-sm text-slate-500">Hardware and runtime environment profile</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item, index) => (
          <InfoBlock key={item.label} {...item} delay={0.05 + index * 0.04} />
        ))}
      </div>
    </Card>
  );
}
