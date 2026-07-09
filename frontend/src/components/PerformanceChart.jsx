import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { BarChart3 } from "lucide-react";
import { Card } from "./ui/Card";
import { useTheme } from "../context/ThemeContext";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function PerformanceChart({ results }) {
  const { theme } = useTheme();

  if (!results || results.length === 0) return null;

  const isDark = theme === "dark";
  const strategies = results.map((r) => r.strategy.replace("Strategy", ""));
  const hashrates = results.map((r) => r.hashrate);

  const data = {
    labels: strategies,
    datasets: [
      {
        label: "Hash Rate (H/s)",
        data: hashrates,
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 360);
          gradient.addColorStop(0, "rgba(34, 211, 238, 0.92)");
          gradient.addColorStop(0.52, "rgba(59, 130, 246, 0.62)");
          gradient.addColorStop(1, "rgba(129, 140, 248, 0.18)");
          return gradient;
        },
        borderColor: "rgba(34, 211, 238, 0.9)",
        borderWidth: 1,
        borderRadius: 10,
        borderSkipped: false,
        barPercentage: 0.58,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 1000, easing: "easeOutQuart" },
    plugins: {
      legend: {
        display: true,
        position: "top",
        align: "end",
        labels: {
          color: isDark ? "#cbd5e1" : "#475569",
          usePointStyle: true,
          boxWidth: 8,
          boxHeight: 8,
          font: { size: 12, weight: "700" },
        },
      },
      title: { display: false },
      tooltip: {
        backgroundColor: isDark ? "rgba(2, 6, 23, 0.95)" : "rgba(255, 255, 255, 0.96)",
        titleColor: isDark ? "#e2e8f0" : "#0f172a",
        bodyColor: isDark ? "#94a3b8" : "#475569",
        borderColor: isDark ? "rgba(34, 211, 238, 0.22)" : "rgba(14, 165, 233, 0.18)",
        borderWidth: 1,
        padding: 14,
        cornerRadius: 12,
        displayColors: false,
        callbacks: {
          label: (context) => `Hash Rate: ${new Intl.NumberFormat("en-US").format(Math.round(context.parsed.y))} H/s`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        border: { display: false },
        grid: { color: isDark ? "rgba(148, 163, 184, 0.08)" : "rgba(15, 23, 42, 0.06)" },
        ticks: {
          color: isDark ? "#64748b" : "#64748b",
          font: { size: 11, weight: "600" },
          callback: (value) => `${Math.round(value / 1000)}k`,
        },
      },
      x: {
        border: { display: false },
        grid: { display: false },
        ticks: {
          color: isDark ? "#cbd5e1" : "#475569",
          font: { size: 12, weight: "700" },
        },
      },
    },
  };

  return (
    <Card className="overflow-hidden p-6" animate>
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-300">
            <BarChart3 size={21} />
          </div>
          <div>
            <h3 className="m-0 text-lg font-black text-slate-950 dark:text-white">Performance Chart</h3>
            <p className="m-0 mt-1 text-sm text-slate-500">Hash rate comparison across active strategies</p>
          </div>
        </div>
      </div>
      <div className="h-[330px] w-full md:h-[380px]">
        <Bar data={data} options={options} />
      </div>
    </Card>
  );
}
