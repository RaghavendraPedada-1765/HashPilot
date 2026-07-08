import { useEffect, useState } from "react";
import api from "../api/api";
import Layout from "../components/Layout";
import BenchmarkTable from "../components/BenchmarkTable";

export default function History() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  async function loadHistory() {
    try {
      const response = await api.get("/history");
      setResults(response.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load benchmark history.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout>
      <h1
        style={{
          fontSize: "40px",
          marginBottom: "20px",
        }}
      >
        📜 Benchmark History
      </h1>

      <p
        style={{
          color: "#94a3b8",
          marginBottom: "30px",
        }}
      >
        Previous benchmark executions stored in the database.
      </p>

      {loading ? (
        <h2>Loading...</h2>
      ) : (
        <BenchmarkTable results={results} />
      )}
    </Layout>
  );
}