import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  History,
  BarChart3,
  Zap,
  Activity,
} from "lucide-react";

const navItems = [
  { to: "/",          label: "Dashboard", icon: LayoutDashboard },
  { to: "/history",   label: "History",   icon: History },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
];

const sidebarVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const itemVariants = {
  hidden:  { opacity: 0, x: -16 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

export default function Sidebar() {
  const location = useLocation();

  return (
    <motion.aside
      initial="hidden"
      animate="visible"
      variants={sidebarVariants}
      style={{
        width: "260px",
        minWidth: "260px",
        background: "var(--bg-glass)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderRight: "1px solid var(--border)",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        padding: "28px 16px",
        position: "sticky",
        top: 0,
        height: "100vh",
        overflowY: "auto",
        zIndex: 40,
      }}
    >
      {/* ── Logo ── */}
      <motion.div variants={itemVariants} style={{ marginBottom: "36px", padding: "0 8px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: "38px",
              height: "38px",
              borderRadius: "10px",
              background: "var(--grad-primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 16px rgba(99,102,241,0.45)",
              flexShrink: 0,
            }}
          >
            <Zap size={20} color="white" strokeWidth={2.5} />
          </div>

          <div>
            <div
              style={{
                color: "var(--text-heading)",
                fontWeight: 800,
                fontSize: "17px",
                letterSpacing: "-0.4px",
                lineHeight: 1.1,
              }}
            >
              HashPilot
            </div>
            <div
              style={{
                fontSize: "11px",
                color: "var(--text-muted)",
                fontWeight: 500,
                marginTop: "2px",
              }}
            >
              AI Benchmark Platform
            </div>
          </div>
        </div>

        {/* Version badge */}
        <div
          style={{
            marginTop: "14px",
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            background: "rgba(99,102,241,0.12)",
            border: "1px solid rgba(99,102,241,0.25)",
            borderRadius: "999px",
            padding: "3px 10px",
          }}
        >
          <span
            className="dot-pulse"
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: "#10b981",
              display: "inline-block",
              flexShrink: 0,
            }}
          />
          <span style={{ fontSize: "11px", color: "#818cf8", fontWeight: 600 }}>
            v1.0 · Live
          </span>
        </div>
      </motion.div>

      {/* ── Section label ── */}
      <motion.div
        variants={itemVariants}
        style={{
          fontSize: "10px",
          fontWeight: 700,
          color: "var(--text-muted)",
          letterSpacing: "1.2px",
          textTransform: "uppercase",
          padding: "0 12px",
          marginBottom: "8px",
        }}
      >
        Navigation
      </motion.div>

      {/* ── Nav Links ── */}
      <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: "2px" }}>
        {navItems.map(({ to, label, icon: Icon }) => {
          const isActive =
            to === "/"
              ? location.pathname === "/"
              : location.pathname.startsWith(to);

          return (
            <motion.div key={to} variants={itemVariants}>
              <NavLink
                to={to}
                style={{ textDecoration: "none" }}
              >
                <motion.div
                  whileHover={{ x: 3 }}
                  transition={{ duration: 0.15 }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "11px",
                    padding: "10px 12px",
                    borderRadius: "10px",
                    fontWeight: isActive ? 600 : 500,
                    fontSize: "14px",
                    color: isActive ? "white" : "var(--text-body)",
                    background: isActive
                      ? "linear-gradient(135deg, rgba(99,102,241,0.28), rgba(139,92,246,0.18))"
                      : "transparent",
                    border: isActive
                      ? "1px solid rgba(99,102,241,0.35)"
                      : "1px solid transparent",
                    boxShadow: isActive
                      ? "0 2px 12px rgba(99,102,241,0.18)"
                      : "none",
                    transition: "all 0.18s ease",
                    position: "relative",
                  }}
                >
                  {/* Active left bar */}
                  {isActive && (
                    <div
                      style={{
                        position: "absolute",
                        left: 0,
                        top: "20%",
                        height: "60%",
                        width: "3px",
                        borderRadius: "0 3px 3px 0",
                        background: "var(--grad-primary)",
                      }}
                    />
                  )}

                  <Icon
                    size={16}
                    style={{
                      color: isActive ? "#a5b4fc" : "var(--text-muted)",
                      transition: "color 0.18s",
                      flexShrink: 0,
                    }}
                  />
                  {label}
                </motion.div>
              </NavLink>
            </motion.div>
          );
        })}
      </nav>

      {/* ── Bottom status ── */}
      <motion.div
        variants={itemVariants}
        style={{
          marginTop: "auto",
          padding: "14px 12px",
          background: "rgba(16,185,129,0.07)",
          border: "1px solid rgba(16,185,129,0.15)",
          borderRadius: "12px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Activity size={13} color="#10b981" />
          <span style={{ fontSize: "12px", color: "#6ee7b7", fontWeight: 600 }}>
            System Online
          </span>
        </div>
        <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px" }}>
          API connected · ready
        </div>
      </motion.div>
    </motion.aside>
  );
}