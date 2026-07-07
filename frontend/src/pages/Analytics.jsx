import { useEffect, useState } from "react";

import api from "../api/api";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import StatCard from "../components/StatCard";
import PerformanceChart from "../components/PerformanceChart";

export default function Analytics() {

  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {

    loadAnalytics();

  }, []);

  async function loadAnalytics() {

    try {

      const response = await api.get("/analytics/");

      setAnalytics(response.data);

    }

    catch (error) {

      console.error(error);

    }

  }

  if (!analytics) {

    return (

      <div className="min-h-screen bg-slate-900 text-white">

        <Navbar />

        <div className="text-center mt-20 text-xl">

          Loading Analytics...

        </div>

      </div>

    );

  }

  return (

    <div className="min-h-screen bg-slate-900 text-white">

      <Navbar />

      <div className="mx-12 mt-10">

        <h1 className="text-4xl font-bold mb-8">

          Analytics

        </h1>

        <div className="grid md:grid-cols-3 gap-6 mb-10">

          <StatCard

            title="Total Runs"

            value={analytics.total_runs}

          />

          <StatCard

            title="Best Strategy"

            value={analytics.best_strategy}

            color="bg-green-700"

          />

          <StatCard

            title="Average Hash Rate"

            value={`${Math.round(
              analytics.average_hashrate
            ).toLocaleString()} H/s`}

          />

        </div>

        <PerformanceChart

          results={analytics.strategies.map(strategy => ({

            strategy: strategy.strategy,

            hashrate: strategy.average_hashrate,

          }))}

        />

      </div>

      <Footer />

    </div>

  );

}