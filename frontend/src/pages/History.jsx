import { useEffect, useMemo, useState } from "react";

import api from "../api/api";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import StatCard from "../components/StatCard";

export default function History() {

  const [history, setHistory] = useState([]);

  const [search, setSearch] = useState("");

  const [difficulty, setDifficulty] = useState("All");

  const [winnerOnly, setWinnerOnly] = useState(false);

  useEffect(() => {

    loadHistory();

  }, []);

  async function loadHistory() {

    try {

      const response = await api.get("/history/");

      setHistory(response.data);

    }

    catch (error) {

      console.error(error);

    }

  }

  const filtered = useMemo(() => {

    return history.filter(item => {

      const strategyMatch =
        item.strategy.toLowerCase().includes(search.toLowerCase());

      const difficultyMatch =
        difficulty === "All"
          ? true
          : item.difficulty === Number(difficulty);

      const winnerMatch =
        winnerOnly
          ? item.winner
          : true;

      return strategyMatch && difficultyMatch && winnerMatch;

    });

  }, [history, search, difficulty, winnerOnly]);

  const averageHashrate =
    filtered.length === 0
      ? 0
      : filtered.reduce((sum, item) => sum + item.hashrate, 0) / filtered.length;

  const maximumHashrate =
    filtered.length === 0
      ? 0
      : Math.max(...filtered.map(item => item.hashrate));

  return (

    <div className="min-h-screen bg-slate-900 text-white">

      <Navbar />

      <div className="mx-12 mt-10">

        <h1 className="text-4xl font-bold mb-8">

          Benchmark History

        </h1>

        <div className="grid md:grid-cols-4 gap-4 mb-8">

          <input

            type="text"

            placeholder="Search Strategy..."

            value={search}

            onChange={(e) => setSearch(e.target.value)}

            className="bg-slate-800 rounded-lg p-3"

          />

          <select

            value={difficulty}

            onChange={(e) => setDifficulty(e.target.value)}

            className="bg-slate-800 rounded-lg p-3"

          >

            <option>All</option>

            <option>1</option>
            <option>2</option>
            <option>3</option>
            <option>4</option>
            <option>5</option>
            <option>6</option>

          </select>

          <label className="flex items-center gap-3">

            <input

              type="checkbox"

              checked={winnerOnly}

              onChange={(e) => setWinnerOnly(e.target.checked)}

            />

            Winners Only

          </label>

          <button

            onClick={loadHistory}

            className="bg-cyan-500 rounded-lg"

          >

            Refresh

          </button>

        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-10">

          <StatCard

            title="Runs"

            value={filtered.length}

          />

          <StatCard

            title="Winners"

            value={filtered.filter(x => x.winner).length}

            color="bg-green-700"

          />

          <StatCard

            title="Average H/s"

            value={Math.round(averageHashrate).toLocaleString()}

          />

          <StatCard

            title="Max H/s"

            value={Math.round(maximumHashrate).toLocaleString()}

          />

        </div>

        <div className="overflow-hidden rounded-xl shadow-xl">

          <table className="w-full">

            <thead className="bg-slate-700">

              <tr>

                <th className="p-4">ID</th>

                <th>Strategy</th>

                <th>Difficulty</th>

                <th>Attempts</th>

                <th>Hash Rate</th>

                <th>Winner</th>

              </tr>

            </thead>

            <tbody>

              {

                filtered.map(item => (

                  <tr

                    key={item.id}

                    className="border-b border-slate-700 hover:bg-slate-800"

                  >

                    <td className="text-center p-4">

                      {item.id}

                    </td>

                    <td className="text-center">

                      {item.strategy}

                    </td>

                    <td className="text-center">

                      {item.difficulty}

                    </td>

                    <td className="text-center">

                      {item.attempts.toLocaleString()}

                    </td>

                    <td className="text-center">

                      {Math.round(item.hashrate).toLocaleString()}

                    </td>

                    <td className="text-center">

                      {

                        item.winner

                          ? "🏆"

                          : "-"

                      }

                    </td>

                  </tr>

                ))

              }

            </tbody>

          </table>

        </div>

      </div>

      <Footer />

    </div>

  );

}