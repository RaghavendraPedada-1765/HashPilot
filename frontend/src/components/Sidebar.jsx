import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BarChart3,
  ChevronLeft,
  ChevronRight,
  History,
  LayoutDashboard,
  Signal,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "./ui/Badge";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/history", label: "History", icon: History },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
];

const itemVariants = {
  hidden: { opacity: 0, x: -16 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

export default function Sidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.aside
      initial={{ opacity: 0, x: -18 }}
      animate={{ opacity: 1, x: 0, width: collapsed ? 92 : 280 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="relative z-20 hidden min-h-screen shrink-0 border-r border-slate-200/70 bg-white/75 px-4 py-6 shadow-[20px_0_80px_rgba(15,23,42,0.08)] backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/50 dark:shadow-[20px_0_80px_rgba(0,0,0,0.25)] lg:flex lg:flex-col"
    >
      <motion.div variants={itemVariants} className="mb-8 flex items-center gap-3 px-1">
        <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-cyan-300/30 bg-gradient-to-br from-cyan-400 to-indigo-500 shadow-[0_0_28px_rgba(34,211,238,0.35)]">
          <div className="absolute inset-0 animate-shimmer bg-[linear-gradient(90deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.24)_50%,rgba(255,255,255,0)_100%)] bg-[length:200%_100%]" />
          <Zap size={23} className="relative text-white" strokeWidth={2.5} />
        </div>

        {!collapsed && (
          <div className="min-w-0">
            <div className="text-lg font-black leading-tight tracking-tight text-slate-950 dark:text-white">
              HashPilot
            </div>
            <div className="mt-0.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              AI benchmark cloud
            </div>
          </div>
        )}
      </motion.div>

      {!collapsed && (
        <Badge variant="accent" dot className="mb-6 w-fit border-cyan-400/25 bg-cyan-400/10 px-3 py-1.5">
          Enterprise Console
        </Badge>
      )}

      <nav className="flex flex-1 flex-col gap-1.5">
        {navItems.map(({ to, label, icon: Icon }) => {
          const isActive = to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);

          return (
            <motion.div key={to} variants={itemVariants}>
              <NavLink to={to} className="outline-none" title={collapsed ? label : undefined}>
                <motion.div
                  whileHover={{ x: collapsed ? 0 : 3 }}
                  className={`relative flex h-11 items-center gap-3 rounded-2xl px-3 text-sm font-semibold transition-all ${
                    isActive
                      ? "border border-cyan-400/25 bg-cyan-400/10 text-slate-950 shadow-[0_0_24px_rgba(34,211,238,0.12)] dark:text-white"
                      : "border border-transparent text-slate-500 hover:border-slate-200 hover:bg-slate-100/70 hover:text-slate-900 dark:text-slate-400 dark:hover:border-white/10 dark:hover:bg-white/[0.04] dark:hover:text-slate-100"
                  } ${collapsed ? "justify-center" : ""}`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNavPill"
                      className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-400/10 to-indigo-400/10"
                    />
                  )}
                  <Icon size={18} className={`relative shrink-0 ${isActive ? "text-cyan-500" : ""}`} />
                  {!collapsed && <span className="relative">{label}</span>}
                </motion.div>
              </NavLink>
            </motion.div>
          );
        })}
      </nav>

      <div className="mt-6 rounded-2xl border border-slate-200/80 bg-slate-50/80 p-3 dark:border-white/10 dark:bg-white/[0.04]">
        <div className={`flex items-center ${collapsed ? "justify-center" : "gap-3"}`}>
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-400">
            <Signal size={17} />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.9)]" />
          </div>
          {!collapsed && (
            <div>
              <div className="text-xs font-bold text-emerald-500">Engine Connected</div>
              <div className="text-[11px] text-slate-500">WebSocket telemetry ready</div>
            </div>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={() => setCollapsed((value) => !value)}
        className="mt-4 flex h-9 items-center justify-center rounded-xl border border-slate-200 bg-white/70 text-slate-500 transition hover:text-slate-900 dark:border-white/10 dark:bg-white/[0.04] dark:hover:text-white"
        title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>
    </motion.aside>
  );
}
