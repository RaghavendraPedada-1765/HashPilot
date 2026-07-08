import { motion } from "framer-motion";
import { Zap, TrendingUp } from "lucide-react";

export default function Hero() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className="mesh-bg"
      style={{
        background: "linear-gradient(135deg, #1e1b4b 0%, #0d1117 55%, #0c1a2e 100%)",
        borderRadius: "20px",
        padding: "48px 52px",
        marginBottom: "32px",
        border: "1px solid rgba(99,102,241,0.2)",
        boxShadow: "0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative blobs */}
      <div
        style={{
          position: "absolute",
          right: "-60px",
          top: "-60px",
          width: "280px",
          height: "280px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "30%",
          bottom: "-40px",
          width: "200px",
          height: "200px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(6,182,212,0.10) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Content above the mesh */}
      <div style={{ position: "relative", zIndex: 1 }}>
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "7px",
            background: "rgba(99,102,241,0.15)",
            border: "1px solid rgba(99,102,241,0.35)",
            borderRadius: "999px",
            padding: "5px 14px",
            marginBottom: "24px",
          }}
        >
          <TrendingUp size={12} color="#a5b4fc" />
          <span style={{ fontSize: "12px", color: "#a5b4fc", fontWeight: 600, letterSpacing: "0.3px" }}>
            AI-Powered Benchmark Analysis
          </span>
        </motion.div>

        {/* Title row */}
        <div style={{ display: "flex", alignItems: "center", gap: "18px", marginBottom: "16px" }}>
          <motion.div
            className="float-anim"
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "16px",
              background: "var(--grad-primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 8px 24px rgba(99,102,241,0.45)",
              flexShrink: 0,
            }}
          >
            <Zap size={28} color="white" strokeWidth={2.5} />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            style={{
              fontSize: "48px",
              fontWeight: 900,
              letterSpacing: "-2px",
              lineHeight: 1,
              background: "linear-gradient(135deg, #e2e8f0, #c7d2fe, #a5b4fc)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            HashPilot
          </motion.h1>
        </div>

        {/* Subtitle */}
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          style={{
            fontSize: "22px",
            fontWeight: 600,
            color: "#c7d2fe",
            marginBottom: "14px",
            letterSpacing: "-0.3px",
          }}
        >
          AI-Powered Benchmark Platform
        </motion.h2>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          style={{
            fontSize: "15px",
            color: "#94a3b8",
            lineHeight: "1.75",
            maxWidth: "680px",
          }}
        >
          Benchmark computational strategies, compare hash performance,
          visualize execution metrics, and analyze historical benchmark
          data through a modern analytics dashboard.
        </motion.p>

        {/* Stats strip */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.45 }}
          style={{
            marginTop: "28px",
            display: "flex",
            gap: "28px",
          }}
        >
          {[
            { label: "Strategies", value: "4" },
            { label: "Real-time Progress", value: "✓" },
            { label: "AI Analysis", value: "✓" },
            { label: "History Tracking", value: "✓" },
          ].map(({ label, value }) => (
            <div key={label} style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              <span style={{ fontSize: "16px", fontWeight: 700, color: "#a5b4fc" }}>{value}</span>
              <span style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 500 }}>{label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}