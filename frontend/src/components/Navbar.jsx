import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Bell, User } from "lucide-react";

const PAGE_TITLES = {
  "/":          { label: "Dashboard",         sub: "Overview & Benchmark Control" },
  "/history":   { label: "Benchmark History", sub: "Previous execution records"   },
  "/analytics": { label: "Analytics",         sub: "Performance insights & trends" },
};

function Navbar() {
  const location = useLocation();
  const page = PAGE_TITLES[location.pathname] ?? { label: "HashPilot", sub: "" };

  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        height: "66px",
        background: "rgba(5, 8, 15, 0.80)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid var(--border)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 28px",
        position: "sticky",
        top: 0,
        zIndex: 30,
        flexShrink: 0,
      }}
    >
      {/* ── Left: Page title ── */}
      <div>
        <h2
          style={{
            margin: 0,
            color: "var(--text-heading)",
            fontSize: "16px",
            fontWeight: 700,
            letterSpacing: "-0.3px",
          }}
        >
          {page.label}
        </h2>
        {page.sub && (
          <p style={{ margin: 0, fontSize: "12px", color: "var(--text-muted)", marginTop: "1px" }}>
            {page.sub}
          </p>
        )}
      </div>

      {/* ── Right: Controls ── */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>

        {/* Search */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            background: "var(--bg-elevated)",
            border: "1px solid var(--border)",
            padding: "7px 14px",
            borderRadius: "10px",
            gap: "8px",
            color: "var(--text-muted)",
            transition: "border-color 0.2s",
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = "var(--border-hover)"}
          onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
        >
          <Search size={13} />
          <input
            type="text"
            placeholder="Search..."
            style={{
              background: "transparent",
              border: "none",
              color: "var(--text-body)",
              outline: "none",
              width: "150px",
              fontSize: "13px",
              fontFamily: "inherit",
            }}
          />
          <kbd
            style={{
              fontSize: "10px",
              color: "var(--text-muted)",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid var(--border)",
              borderRadius: "5px",
              padding: "1px 5px",
              fontFamily: "inherit",
            }}
          >
            ⌘K
          </kbd>
        </div>

        {/* Notification Bell */}
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "10px",
            background: "var(--bg-elevated)",
            border: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "var(--text-muted)",
            position: "relative",
            transition: "border-color 0.2s",
          }}
        >
          <Bell size={15} />
          {/* Badge */}
          <span
            style={{
              position: "absolute",
              top: "7px",
              right: "7px",
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: "var(--indigo)",
              border: "1.5px solid var(--bg-base)",
            }}
          />
        </motion.button>

        {/* User pill */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "9px",
            background: "var(--bg-elevated)",
            border: "1px solid var(--border)",
            borderRadius: "12px",
            padding: "6px 14px 6px 8px",
            cursor: "pointer",
            transition: "border-color 0.2s",
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = "var(--border-hover)"}
          onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
        >
          {/* Avatar */}
          <div
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "8px",
              background: "var(--grad-primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <User size={14} color="white" />
          </div>

          <div>
            <div style={{ fontWeight: 600, fontSize: "13px", color: "var(--text-heading)", lineHeight: 1.2 }}>
              Raghavendra
            </div>
            <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
              Administrator
            </div>
          </div>
        </motion.div>

      </div>
    </motion.header>
  );
}

export default Navbar;