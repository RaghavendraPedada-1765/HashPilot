import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  Title
);

export default function PerformanceChart({ results }) {
  if (!results || results.length === 0) {
    return (
      <div
        style={{
          background: "#111827",
          borderRadius: "20px",
          padding: "60px",
          textAlign: "center",
          color: "#94a3b8",
          boxShadow: "0 12px 30px rgba(0,0,0,.35)",
        }}
      >
        <h2>No chart data available.</h2>
      </div>
    );
  }

  const winner = results.reduce((a, b) =>
    a.hashrate > b.hashrate ? a : b
  );

  const colors = results.map((item) =>
    item.strategy === winner.strategy
      ? "#22c55e"
      : "#3b82f6"
  );

  const data = {
    labels: results.map((item) =>
      item.strategy.replace("Strategy", "")
    ),

    datasets: [
      {
        label: "Hash Rate (H/s)",

        data: results.map((item) => item.hashrate),

        backgroundColor: colors,

        borderRadius: 12,

        borderSkipped: false,
      },
    ],
  };

  const options = {
    responsive: true,

    maintainAspectRatio: false,

    plugins: {
      legend: {
        display: false,
      },

      title: {
        display: true,

        text: "Performance Comparison",

        color: "white",

        font: {
          size: 24,
          weight: "bold",
        },
      },

      tooltip: {
        backgroundColor: "#111827",

        titleColor: "#ffffff",

        bodyColor: "#ffffff",

        padding: 12,

        callbacks: {
          label: function (context) {
            return (
              context.raw.toLocaleString() + " H/s"
            );
          },
        },
      },
    },

    scales: {
      x: {
        ticks: {
          color: "#cbd5e1",
          font: {
            size: 14,
          },
        },

        grid: {
          display: false,
        },
      },

      y: {
        ticks: {
          color: "#cbd5e1",

          callback: function (value) {
            return (
              Math.round(value / 1000) + "k"
            );
          },
        },

        grid: {
          color: "#334155",
        },
      },
    },

    animation: {
      duration: 1500,
    },
  };

  return (
    <div
      style={{
        background: "#111827",
        borderRadius: "20px",
        padding: "30px",
        boxShadow: "0 15px 40px rgba(0,0,0,.35)",
        height: "500px",
      }}
    >
      <Bar
        data={data}
        options={options}
      />
    </div>
  );
}