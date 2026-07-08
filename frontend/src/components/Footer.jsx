export default function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid var(--border)",
        padding: "20px 36px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "10px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <span
          style={{
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            background: "#10b981",
            display: "inline-block",
          }}
          className="dot-pulse"
        />
        <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
          All systems operational
        </span>
      </div>
      <span style={{ fontSize: "12px", color: "var(--text-faint)" }}>
        © 2026 HashPilot · AI Benchmark Platform · v1.0.0
      </span>
    </footer>
  );
}