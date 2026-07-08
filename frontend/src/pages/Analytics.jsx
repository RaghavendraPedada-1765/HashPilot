import { useEffect, useState } from "react";

import api from "../api/api";

import Layout from "../components/Layout";
import StatCard from "../components/StatCard";

import {
  FaChartLine,
  FaBolt,
  FaTrophy,
  FaMedal,
} from "react-icons/fa";

import {
  Bar
} from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

export default function Analytics() {

  const [analytics, setAnalytics] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    loadAnalytics();

  }, []);

  async function loadAnalytics() {

    try {

      const response = await api.get("/analytics");

      setAnalytics(response.data);

    }

    catch (err) {

      console.error(err);

      alert("Failed to load analytics.");

    }

    finally {

      setLoading(false);

    }

  }

  if (loading) {

    return (

      <Layout>

        <h2>Loading Analytics...</h2>

      </Layout>

    );

  }

  const chartData = {

    labels: analytics.strategies.map(item =>
      item.strategy.replace("Strategy", "")
    ),

    datasets: [

      {

        label: "Average Hash Rate",

        data: analytics.strategies.map(item =>
          item.average_hashrate
        ),

        backgroundColor: "#06b6d4",

        borderRadius: 8,

      }

    ]

  };

  return (

    <Layout>

      <h1
        style={{
          fontSize: "42px",
          marginBottom: "35px",
        }}
      >
        📊 Analytics Dashboard
      </h1>

      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
      >

        <StatCard
          title="Total Runs"
          value={analytics.total_runs}
          icon={<FaChartLine />}
          color="#1E3A8A"
        />

        <StatCard
          title="Winning Runs"
          value={analytics.total_winners}
          icon={<FaMedal />}
          color="#166534"
        />

        <StatCard
          title="Average Hash Rate"
          value={`${Math.round(
            analytics.average_hashrate
          ).toLocaleString()} H/s`}
          icon={<FaBolt />}
          color="#7C2D12"
        />

        <StatCard
          title="Best Strategy"
          value={analytics.best_strategy}
          icon={<FaTrophy />}
          color="#4338CA"
        />

      </div>

      <div
        className="bg-slate-800 rounded-xl p-8 shadow-xl"
      >

        <Bar
          data={chartData}
        />

      </div>

    </Layout>

  );

}