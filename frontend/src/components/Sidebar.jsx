import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BarChart3,
  History,
  LayoutDashboard,
  Signal,
  Zap,
} from "lucide-react";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/history", label: "History", icon: History },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside
      style={{ width: 220, background: "var(--bg-surface)", borderRight: "1px solid var(--border)" }}
      className="relative z-20 hidden min-h-screen shrink-0 flex-col py-5 px-3 lg:flex"
    >
      {/* Logo */}
      <div className="mb-8 flex items-center gap-3 px-2">
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
          style={{ background: "var(--accent)" }}
        >
          <Zap size={18} className="text-white" strokeWidth={2.5} />
        </div>
        <div>
          <div className="text-sm font-bold leading-tight" style={{ color: "var(--text-primary)" }}>
            HashPilot
          </div>
          <div className="text-[10px] font-medium" style={{ color: "var(--text-muted)" }}>
            v1.0.0
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-0.5">
        {navItems.map(({ to, label, icon: Icon }) => {
          const isActive = to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);

          return (
            <NavLink key={to} to={to} className="outline-none">
              <motion.div
                whileHover={{ x: 2 }}
                transition={{ duration: 0.15 }}
                className="relative flex h-9 items-center gap-2.5 rounded-[var(--radius-md)] px-3 text-sm font-medium transition-colors duration-150"
                style={{
                  background: isActive ? "var(--accent-dim)" : "transparent",
                  color: isActive ? "var(--accent-hover)" : "var(--text-secondary)",
                  border: isActive ? "1px solid rgba(59,130,246,0.25)" : "1px solid transparent",
                }}
              >
                <Icon size={16} strokeWidth={isActive ? 2.5 : 2} />
                <span>{label}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeNavPill"
                    className="absolute left-0 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full"
                    style={{ background: "var(--accent)" }}
                  />
                )}
              </motion.div>
            </NavLink>
          );
        })}
      </nav>

      {/* Engine status */}
      <div
        className="mt-4 rounded-[var(--radius-md)] p-3"
        style={{ background: "var(--bg-base)", border: "1px solid var(--border)" }}
      >
        <div className="flex items-center gap-2.5">
          <div className="relative flex h-7 w-7 items-center justify-center rounded-md" style={{ background: "var(--success-dim)" }}>
            <Signal size={14} style={{ color: "var(--success)" }} />
            <span
              className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full animate-[dot-pulse_1.8s_ease-in-out_infinite]"
              style={{ background: "var(--success)" }}
            />
          </div>
          <div>
            <div className="text-[11px] font-semibold" style={{ color: "var(--success)" }}>
              Engine Ready
            </div>
            <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>
              WebSocket connected
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
