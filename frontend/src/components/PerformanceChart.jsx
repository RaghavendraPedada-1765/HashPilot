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
      <div className="mx-12 mb-12">
        <div className="bg-slate-800 rounded-xl shadow-lg p-8 text-center text-slate-400">
          No chart data available.
        </div>
      </div>
    );

  }

  const data = {

    labels: results.map(item =>
      item.strategy.replace("Strategy", "")
    ),

    datasets: [

      {

        label: "Hash Rate",

        data: results.map(item => item.hashrate),

        backgroundColor: "#06b6d4",

        borderRadius: 10,

      }

    ]

  };

  const options = {

    responsive: true,

    plugins: {

      legend: {

        display: false

      },

      title: {

        display: true,

        text: "Average Hash Rate by Strategy",

        color: "white",

        font: {

          size: 22

        }

      }

    }

  };

  return (

    <div className="bg-slate-800 rounded-xl p-8 shadow-xl">

      <Bar

        data={data}

        options={options}

      />

    </div>

  );

}