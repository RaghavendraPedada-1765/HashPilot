import { motion } from "framer-motion";
import { Bot, CheckCircle2, BrainCircuit, Sparkles } from "lucide-react";

export default function AIRecommendation({ analysis }) {
  if (!analysis) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        position: "relative",
        background: "linear-gradient(135deg, rgba(30,27,75,0.7) 0%, rgba(13,17,23,0.8) 100%)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        padding: "28px",
        borderRadius: "20px",
        marginBottom: "28px",
        border: "1px solid rgba(99,102,241,0.3)",
        boxShadow: "0 15px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(139,92,246,0.1) inset",
        overflow: "hidden",
      }}
    >
      {/* Background glow */}
      <div
        style={{
          position: "absolute",
          right: "-40px",
          top: "-40px",
          width: "200px",
          height: "200px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Header row */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px", position: "relative" }}>
        {/* AI icon with pulse ring */}
        <div style={{ position: "relative" }}>
          <div
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "12px",
              background: "var(--grad-primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 6px 20px rgba(99,102,241,0.5)",
            }}
          >
            <Bot size={20} color="white" />
          </div>
          {/* Pulse ring */}
          <motion.div
            animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            style={{
              position: "absolute",
              inset: "-4px",
              borderRadius: "16px",
              border: "2px solid rgba(99,102,241,0.4)",
              pointerEvents: "none",
            }}
          />
        </div>

        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
            <h2 style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-heading)", margin: 0 }}>
              AI Recommendation
            </h2>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                fontSize: "10px",
                fontWeight: 700,
                color: "#a5b4fc",
                background: "rgba(99,102,241,0.15)",
                border: "1px solid rgba(99,102,241,0.3)",
                borderRadius: "999px",
                padding: "2px 8px",
              }}
            >
              <Sparkles size={9} />
              AI
            </span>
          </div>
          <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: 0, marginTop: "2px" }}>
            Optimal strategy based on benchmark results
          </p>
        </div>
      </div>

      {/* Recommended strategy name */}
      <div style={{ marginBottom: "18px", position: "relative" }}>
        <p style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 700, letterSpacing: "0.9px", textTransform: "uppercase", marginBottom: "6px" }}>
          Recommended Strategy
        </p>
        <h1
          style={{
            fontSize: "28px",
            fontWeight: 800,
            letterSpacing: "-0.6px",
            background: "linear-gradient(135deg, #6ee7b7, #34d399)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            WebkitTextFillColor: "transparent",
            lineHeight: 1.15,
          }}
        >
          {analysis.recommended_strategy}
        </h1>
      </div>

      {/* Confidence */}
      <div style={{ marginBottom: "22px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
          <BrainCircuit size={13} color="#a5b4fc" />
          <span style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: 600 }}>Confidence</span>
          <span
            style={{
              marginLeft: "auto",
              fontSize: "13px",
              fontWeight: 800,
              color: "#a5b4fc",
            }}
          >
            {analysis.confidence}%
          </span>
        </div>

        {/* Progress bar */}
        <div
          style={{
            height: "6px",
            background: "rgba(255,255,255,0.06)",
            borderRadius: "999px",
            overflow: "hidden",
          }}
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${analysis.confidence}%` }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            style={{
              height: "100%",
              background: "linear-gradient(90deg, #6366f1, #8b5cf6)",
              borderRadius: "999px",
            }}
          />
        </div>
      </div>

      {/* Reasons */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", position: "relative" }}>
        {analysis.reasons.map((reason, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 + index * 0.08, duration: 0.3 }}
            style={{
              display: "flex",
              gap: "10px",
              alignItems: "flex-start",
              background: "rgba(16,185,129,0.06)",
              border: "1px solid rgba(16,185,129,0.15)",
              borderRadius: "10px",
              padding: "10px 14px",
            }}
          >
            <CheckCircle2 size={14} color="#10b981" style={{ flexShrink: 0, marginTop: "1px" }} />
            <span style={{ fontSize: "13px", color: "var(--text-body)", lineHeight: "1.5" }}>{reason}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}