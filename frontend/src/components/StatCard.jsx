import { motion } from "framer-motion";

export default function StatCard({
  title,
  value,
  icon,
  color = "#2563eb",
}) {
  return (
    <motion.div
      whileHover={{
        y: -8,
        scale: 1.03,
      }}
      transition={{
        duration: 0.25,
      }}
      style={{
        background: "linear-gradient(145deg,#1e293b,#0f172a)",
        borderRadius: "18px",
        padding: "28px",
        border: "1px solid #334155",
        boxShadow: "0 15px 35px rgba(0,0,0,.30)",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Decorative Glow */}
      <div
        style={{
          position: "absolute",
          right: "-30px",
          top: "-30px",
          width: "90px",
          height: "90px",
          borderRadius: "50%",
          background: color,
          opacity: 0.18,
          filter: "blur(20px)",
        }}
      />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <p
            style={{
              color: "#94a3b8",
              margin: 0,
              fontSize: "14px",
              letterSpacing: "1px",
              textTransform: "uppercase",
            }}
          >
            {title}
          </p>

          <h2
            style={{
              marginTop: "14px",
              marginBottom: 0,
              fontSize: "30px",
              color: "white",
              wordBreak: "break-word",
            }}
          >
            {value}
          </h2>
        </div>

        {icon && (
          <div
            style={{
              width: "70px",
              height: "70px",
              borderRadius: "18px",
              background: color,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "30px",
              color: "white",
              boxShadow: `0 10px 25px ${color}55`,
            }}
          >
            {icon}
          </div>
        )}
      </div>
    </motion.div>
  );
}