import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Clock, Download, FileJson, Hash, Search, Trophy, Zap } from "lucide-react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Card } from "./ui/Card";
import { Badge } from "./ui/Badge";
import { Button } from "./ui/Button";

function downloadBlob(content, filename, type) {
  const blob = new Blob([content], { type });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

function toCsv(results) {
  const headers = ["strategy", "nonce", "hashrate", "attempts", "time", "winner"];
  const rows = results.map((result) =>
    headers
      .map((key) => {
        const value = key === "time" ? result.time ?? result.runtime ?? "" : result[key] ?? "";
        return `"${String(value).replaceAll('"', '""')}"`;
      })
      .join(",")
  );
  return [headers.join(","), ...rows].join("\n");
}

export default function BenchmarkTable({ results }) {
  const [searchTerm, setSearchTerm] = useState("");

  const winner = useMemo(
    () => (results?.length ? results.reduce((a, b) => (a.hashrate > b.hashrate ? a : b), results[0]) : null),
    [results]
  );

  const filteredResults = useMemo(
    () => (results || []).filter((r) => r.strategy.toLowerCase().includes(searchTerm.toLowerCase())),
    [results, searchTerm]
  );

  if (!results || results.length === 0) return null;

  const exportCsv = () => {
    downloadBlob(toCsv(filteredResults), `hashpilot_results_${Date.now()}.csv`, "text/csv;charset=utf-8");
    toast.success("CSV export downloaded.");
  };

  const exportJson = () => {
    downloadBlob(JSON.stringify(filteredResults, null, 2), `hashpilot_results_${Date.now()}.json`, "application/json");
    toast.success("JSON export downloaded.");
  };

  return (
    <Card className="overflow-hidden" animate>
      <div className="border-b border-slate-200/80 bg-slate-50/70 p-6 dark:border-white/10 dark:bg-white/[0.03]">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h3 className="m-0 text-lg font-black text-slate-950 dark:text-white">Benchmark Results</h3>
            <p className="m-0 mt-1 text-sm text-slate-500">Raw telemetry, winners, and exportable execution records</p>
          </div>

          <div className="flex w-full flex-col gap-3 sm:flex-row xl:w-auto">
            <div className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-slate-300 bg-white/70 px-3 py-2 text-slate-500 transition focus-within:border-cyan-400 focus-within:ring-2 focus-within:ring-cyan-400/15 dark:border-white/10 dark:bg-slate-950/50 dark:text-slate-400 xl:w-72">
              <Search size={16} />
              <input
                type="text"
                placeholder="Filter strategy..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-slate-200 dark:placeholder:text-slate-500"
              />
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={exportCsv} className="flex-1 sm:flex-none">
                <Download size={16} />
                CSV
              </Button>
              <Button variant="outline" onClick={exportJson} className="flex-1 sm:flex-none">
                <FileJson size={16} />
                JSON
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-100/80 text-xs font-bold uppercase tracking-[0.14em] text-slate-500 dark:border-white/10 dark:bg-white/[0.04]">
              <th className="px-6 py-4">Strategy</th>
              <th className="px-6 py-4">Nonce</th>
              <th className="px-6 py-4">Hash Rate</th>
              <th className="px-6 py-4">Attempts</th>
              <th className="px-6 py-4 text-right">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-white/10">
            {filteredResults.map((result, index) => {
              const isWinner = result.winner !== undefined ? result.winner : winner && winner.strategy === result.strategy;
              const displayTime = result.time ?? result.runtime;

              return (
                <motion.tr
                  key={result.id || `${result.strategy}-${index}`}
                  initial={isWinner ? { backgroundColor: "rgba(34,211,238,0.12)" } : false}
                  animate={{ backgroundColor: isWinner ? "rgba(34,211,238,0.055)" : "rgba(0,0,0,0)" }}
                  className="transition hover:bg-slate-50 dark:hover:bg-white/[0.04]"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${isWinner ? "bg-emerald-400/15 text-emerald-400" : "bg-slate-100 text-slate-400 dark:bg-white/[0.06]"}`}>
                        {isWinner ? <Trophy size={15} /> : <Hash size={14} />}
                      </div>
                      <div>
                        <div className={`font-black ${isWinner ? "text-cyan-500 dark:text-cyan-300" : "text-slate-950 dark:text-white"}`}>
                          {result.strategy}
                        </div>
                        {isWinner && <div className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-500">Best strategy</div>}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-sm text-slate-700 dark:text-slate-300">
                    {result.nonce?.toLocaleString() ?? "-"}
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={isWinner ? "success" : "accent"} className="font-mono">
                      <Zap size={10} />
                      {Math.round(result.hashrate).toLocaleString()} H/s
                    </Badge>
                  </td>
                  <td className="px-6 py-4 font-mono text-sm text-slate-700 dark:text-slate-300">
                    {result.attempts?.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Badge variant="indigo" className="font-mono">
                      <Clock size={10} />
                      {displayTime?.toFixed(4)} s
                    </Badge>
                  </td>
                </motion.tr>
              );
            })}

            {filteredResults.length === 0 && (
              <tr>
                <td colSpan="5" className="py-14 text-center text-slate-500">
                  No strategies match your filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50/70 p-4 text-sm dark:border-white/10 dark:bg-white/[0.03]">
        <div className="text-slate-500">
          Showing <span className="font-bold text-slate-950 dark:text-white">{filteredResults.length}</span> of{" "}
          <span className="font-bold text-slate-950 dark:text-white">{results.length}</span> entries
        </div>
        <div className="flex gap-2">
          <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-300 text-slate-500 transition hover:bg-slate-200 dark:border-white/10 dark:hover:bg-white/10">
            <ChevronLeft size={16} />
          </button>
          <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-300 text-slate-500 transition hover:bg-slate-200 dark:border-white/10 dark:hover:bg-white/10">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </Card>
  );
}
