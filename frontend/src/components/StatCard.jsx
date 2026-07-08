import { motion } from "framer-motion";

export default function StatCard({
  title,
  value,
  icon,
  color = "#6366f1",
  delay = 0,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
      whileHover={{ y: -6, boxShadow: `0 20px 50px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.09)` }}
      style={{
        background: "var(--bg-glass)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderRadius: "18px",
        padding: "24px",
        border: "1px solid var(--border)",
        boxShadow: "var(--shadow-md)",
        overflow: "hidden",
        position: "relative",
        cursor: "default",
        transition: "border-color 0.2s",
      }}
    >
      {/* Top glow orb */}
      <div
        style={{
          position: "absolute",
          right: "-20px",
          top: "-20px",
          width: "100px",
          height: "100px",
          borderRadius: "50%",
          background: color,
          opacity: 0.12,
          filter: "blur(28px)",
          pointerEvents: "none",
        }}
      />

      {/* Bottom left subtle glow */}
      <div
        style={{
          position: "absolute",
          left: "-10px",
          bottom: "-10px",
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          background: color,
          opacity: 0.06,
          filter: "blur(18px)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Text */}
        <div style={{ flex: 1, minWidth: 0, paddingRight: "12px" }}>
          <p
            style={{
              color: "var(--text-muted)",
              margin: 0,
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.9px",
              textTransform: "uppercase",
            }}
          >
            {title}
          </p>

          <h2
            style={{
              marginTop: "10px",
              marginBottom: 0,
              fontSize: String(value).length > 14 ? "15px" : "26px",
              fontWeight: 800,
              color: "var(--text-heading)",
              letterSpacing: String(value).length > 14 ? "-0.2px" : "-0.5px",
              lineHeight: 1.25,
              wordBreak: "break-word",
            }}
          >
            {value}
          </h2>
        </div>

        {/* Icon box */}
        {icon && (
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "13px",
              background: `${color}22`,
              border: `1px solid ${color}44`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "22px",
              color: color,
              flexShrink: 0,
              boxShadow: `0 4px 16px ${color}30`,
            }}
          >
            {icon}
          </div>
        )}
      </div>
    </motion.div>
  );
}