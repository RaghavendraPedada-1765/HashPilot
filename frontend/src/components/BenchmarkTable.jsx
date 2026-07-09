import { useState } from "react";
import { Trophy, Search, Download, ChevronLeft, ChevronRight, Hash, Clock, Zap } from "lucide-react";
import { Card } from "./ui/Card";
import { Badge } from "./ui/Badge";
import { Button } from "./ui/Button";

export default function BenchmarkTable({ results }) {
  const [searchTerm, setSearchTerm] = useState("");

  if (!results || results.length === 0) return null;

  const winner = results.reduce((a, b) => (a.hashrate > b.hashrate ? a : b), results[0]);

  const filteredResults = results.filter((r) =>
    r.strategy.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="overflow-hidden" animate>
      {/* Header Controls */}
      <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-50 dark:bg-slate-900/50">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 m-0">Detailed Results</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 m-0 mt-1">Raw telemetry and execution records</p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Search */}
          <div className="flex items-center bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 transition-colors px-3 py-2 rounded-xl gap-2 text-slate-500 dark:text-slate-400 focus-within:border-cyan-500/50 focus-within:ring-1 focus-within:ring-cyan-500/20 w-full md:w-64">
            <Search size={16} />
            <input
              type="text"
              placeholder="Filter strategy..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-none text-slate-900 dark:text-slate-200 outline-none w-full text-sm placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
          </div>
          
          {/* Export Button */}
          <Button variant="outline" className="hidden sm:flex">
            <Download size={16} />
            Export
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-100 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold sticky top-0">
              <th className="py-4 px-6 font-semibold">Strategy</th>
              <th className="py-4 px-6 font-semibold">Nonce</th>
              <th className="py-4 px-6 font-semibold">Hash Rate</th>
              <th className="py-4 px-6 font-semibold">Attempts</th>
              <th className="py-4 px-6 font-semibold text-right">Time (s)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800/50">
            {filteredResults.map((result, index) => {
              const isWinner = result.winner !== undefined 
                ? result.winner 
                : (winner && winner.strategy === result.strategy);
              
              const displayTime = result.time ?? result.runtime;

              return (
                <tr
                  key={result.id || `${result.strategy}-${index}`}
                  className={`transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50 ${
                    isWinner ? "bg-cyan-500/5" : ""
                  }`}
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      {isWinner && (
                        <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                          <Trophy size={12} />
                        </div>
                      )}
                      <span className={`font-semibold ${isWinner ? "text-cyan-600 dark:text-cyan-400" : "text-slate-900 dark:text-slate-200"}`}>
                        {result.strategy}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-slate-700 dark:text-slate-300 font-mono text-sm">
                    {result.nonce?.toLocaleString() ?? "-"}
                  </td>
                  <td className="py-4 px-6">
                    <Badge variant={isWinner ? "success" : "default"} className="font-mono">
                      <Zap size={10} className="mr-0.5" />
                      {Math.round(result.hashrate).toLocaleString()} H/s
                    </Badge>
                  </td>
                  <td className="py-4 px-6 text-slate-700 dark:text-slate-300 font-mono text-sm">
                    {result.attempts?.toLocaleString()}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <Badge variant="indigo" className="font-mono">
                      <Clock size={10} className="mr-0.5" />
                      {displayTime?.toFixed(4)}
                    </Badge>
                  </td>
                </tr>
              );
            })}
            
            {filteredResults.length === 0 && (
              <tr>
                <td colSpan="5" className="py-12 text-center text-slate-500">
                  No strategies match your filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination UI */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/30 flex items-center justify-between text-sm">
        <div className="text-slate-500">
          Showing <span className="font-semibold text-slate-900 dark:text-slate-300">{filteredResults.length}</span> of <span className="font-semibold text-slate-900 dark:text-slate-300">{results.length}</span> entries
        </div>
        <div className="flex gap-2">
          <button className="w-8 h-8 rounded-lg border border-slate-300 dark:border-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors disabled:opacity-50">
            <ChevronLeft size={16} />
          </button>
          <button className="w-8 h-8 rounded-lg border border-slate-300 dark:border-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors disabled:opacity-50">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </Card>
  );
}