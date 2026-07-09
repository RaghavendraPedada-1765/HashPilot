import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { Card } from "./ui/Card";
import { useTheme } from "../context/ThemeContext";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function PerformanceChart({ results }) {
  const { theme } = useTheme();

  if (!results || results.length === 0) return null;

  const strategies = results.map((r) => r.strategy.replace("Strategy", ""));
  const hashrates = results.map((r) => r.hashrate);

  const isDark = theme === "dark";

  const data = {
    labels: strategies,
    datasets: [
      {
        label: "Hash Rate (H/s)",
        data: hashrates,
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 400);
          gradient.addColorStop(0, "rgba(6, 182, 212, 0.9)");
          gradient.addColorStop(1, "rgba(99, 102, 241, 0.2)");
          return gradient;
        },
        borderColor: "rgba(6, 182, 212, 1)",
        borderWidth: 1,
        borderRadius: 6,
        barPercentage: 0.6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1000,
      easing: "easeOutQuart",
    },
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: isDark ? "rgba(15, 23, 42, 0.95)" : "rgba(255, 255, 255, 0.95)",
        titleColor: isDark ? "#94a3b8" : "#475569",
        bodyColor: isDark ? "#f8fafc" : "#0f172a",
        borderColor: isDark ? "rgba(30, 41, 59, 1)" : "rgba(226, 232, 240, 1)",
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('en-US').format(Math.round(context.parsed.y));
            }
            return label;
          }
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)",
          drawBorder: false,
        },
        ticks: {
          color: isDark ? "#64748b" : "#94a3b8",
          font: {
            family: "'Inter', sans-serif",
            size: 11,
          },
        },
      },
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          color: isDark ? "#94a3b8" : "#64748b",
          font: {
            family: "'Inter', sans-serif",
            size: 12,
            weight: 500,
          },
        },
      },
    },
  };

  return (
    <Card className="p-6" animate>
      <div className="mb-6">
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 m-0">Performance Comparison</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 m-0 mt-1">Live execution hashrate across all active strategies</p>
      </div>
      <div className="w-full h-[350px]">
        <Bar data={data} options={options} />
      </div>
    </Card>
  );
}