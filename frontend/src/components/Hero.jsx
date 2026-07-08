import { motion } from "framer-motion";
import { FaRocket } from "react-icons/fa";

export default function Hero() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      style={{
        background:
          "linear-gradient(135deg,#2563EB,#1E3A8A,#0F172A)",
        borderRadius: "20px",
        padding: "50px",
        marginBottom: "40px",
        color: "white",
        boxShadow: "0 15px 35px rgba(0,0,0,.35)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "15px",
          marginBottom: "20px",
        }}
      >
        <FaRocket size={42} color="#38bdf8" />

        <h1
          style={{
            margin: 0,
            fontSize: "48px",
            fontWeight: "700",
          }}
        >
          HashPilot
        </h1>
      </div>

      <h2
        style={{
          fontSize: "30px",
          marginBottom: "15px",
        }}
      >
        AI-Powered Benchmark Platform
      </h2>

      <p
        style={{
          fontSize: "18px",
          color: "#dbeafe",
          lineHeight: "1.7",
          maxWidth: "850px",
        }}
      >
        Benchmark computational strategies, compare hash performance,
        visualize execution metrics, and analyze historical benchmark
        data through a modern analytics dashboard.
      </p>
    </motion.div>
  );
}