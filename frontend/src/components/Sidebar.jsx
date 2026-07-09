import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  History,
  BarChart3,
  Zap,
  Activity,
} from "lucide-react";
import { Badge } from "./ui/Badge";

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
      className="w-[260px] min-w-[260px] bg-white/60 dark:bg-slate-900/40 backdrop-blur-2xl border-r border-slate-200 dark:border-slate-800/60 min-h-screen flex flex-col py-8 px-4 sticky top-0 h-screen overflow-y-auto z-40"
    >
      {/* ── Logo ── */}
      <motion.div variants={itemVariants} className="mb-10 px-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center shrink-0 shadow-[0_4px_16px_rgba(6,182,212,0.4)] relative group overflow-hidden">
            <div className="absolute inset-0 bg-white/20 blur-md rounded-full transform -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
            <Zap size={22} className="text-white" strokeWidth={2.5} />
          </div>

          <div>
            <div className="text-slate-900 dark:text-slate-100 font-extrabold text-lg tracking-tight leading-tight">
              HashPilot
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5 uppercase tracking-wider">
              Benchmark Core
            </div>
          </div>
        </div>

        {/* Version badge */}
        <div className="mt-4 inline-flex">
          <Badge variant="indigo" dot={true} className="border-indigo-500/30 bg-indigo-500/5 px-3 py-1">
            <span className="text-indigo-600 dark:text-indigo-400 font-semibold tracking-wide text-[10px] uppercase">v2.0 Beta</span>
          </Badge>
        </div>
      </motion.div>

      {/* ── Section label ── */}
      <motion.div
        variants={itemVariants}
        className="text-[10px] font-bold text-slate-400 dark:text-slate-500 tracking-[1.2px] uppercase px-3 mb-2"
      >
        Platform Overview
      </motion.div>

      {/* ── Nav Links ── */}
      <nav className="flex-1 flex flex-col gap-1">
        {navItems.map(({ to, label, icon: Icon }) => {
          const isActive =
            to === "/"
              ? location.pathname === "/"
              : location.pathname.startsWith(to);

          return (
            <motion.div key={to} variants={itemVariants}>
              <NavLink to={to} className="outline-none">
                <motion.div
                  whileHover={{ x: 3 }}
                  transition={{ duration: 0.15 }}
                  className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                    isActive 
                      ? "text-slate-900 dark:text-white bg-gradient-to-r from-cyan-500/10 to-indigo-500/5 border border-cyan-500/20 shadow-[0_2px_12px_rgba(6,182,212,0.1)]" 
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50 border border-transparent"
                  }`}
                >
                  {/* Active left bar */}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute left-0 top-1/4 h-1/2 w-[3px] rounded-r-md bg-gradient-to-b from-cyan-400 to-indigo-500"
                    />
                  )}

                  <Icon
                    size={18}
                    className={`shrink-0 transition-colors duration-200 ${
                      isActive ? "text-cyan-500 dark:text-cyan-400" : "text-slate-400 dark:text-slate-500"
                    }`}
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
        className="mt-auto p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl relative overflow-hidden group"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="relative z-10 flex items-center gap-2 mb-1">
          <Activity size={14} className="text-emerald-500" />
          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold tracking-wide">
            Engine Connected
          </span>
        </div>
        <div className="relative z-10 text-[10px] text-slate-500 leading-tight">
          WebSockets synced with backend solver.
        </div>
      </motion.div>
    </motion.aside>
  );
}