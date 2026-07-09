import { useTheme } from "../context/ThemeContext";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Bell, User, Moon, Sun } from "lucide-react";
import { Badge } from "./ui/Badge";

const PAGE_TITLES = {
  "/":          { label: "Dashboard",         sub: "Overview & Benchmark Control" },
  "/history":   { label: "Benchmark History", sub: "Previous execution records"   },
  "/analytics": { label: "Analytics",         sub: "Performance insights & trends" },
};

function Navbar() {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const page = PAGE_TITLES[location.pathname] ?? { label: "HashPilot", sub: "" };

  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="h-[66px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 flex justify-between items-center px-6 sticky top-0 z-30 shrink-0"
    >
      {/* ── Left: Page title ── */}
      <div>
        <h2 className="m-0 text-slate-900 dark:text-slate-100 text-base font-bold tracking-tight">
          {page.label}
        </h2>
        {page.sub && (
          <p className="m-0 text-xs text-slate-500 dark:text-slate-400 mt-[1px]">
            {page.sub}
          </p>
        )}
      </div>

      {/* ── Right: Controls ── */}
      <div className="flex items-center gap-4">
        
        {/* Live Status */}
        <div className="hidden md:flex items-center gap-3 mr-2">
          <Badge variant="success" dot={true} className="shadow-[0_0_10px_rgba(16,185,129,0.2)]">
            Backend Online
          </Badge>
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/50 px-2.5 py-1 rounded-full border border-slate-200 dark:border-slate-700/50">
            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>

        {/* Search */}
        <div className="flex items-center bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-600 transition-colors px-3 py-1.5 rounded-lg gap-2 text-slate-500 dark:text-slate-400 group focus-within:border-cyan-500/50 focus-within:ring-1 focus-within:ring-cyan-500/20">
          <Search size={14} className="group-focus-within:text-cyan-500 dark:group-focus-within:text-cyan-400 transition-colors" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent border-none text-slate-900 dark:text-slate-200 outline-none w-32 md:w-40 text-sm placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
          <kbd className="text-[10px] text-slate-500 dark:text-slate-400 bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded px-1.5 py-0.5 font-mono">
            ⌘K
          </kbd>
        </div>

        {/* Dark Mode Toggle */}
        <motion.button
          onClick={toggleTheme}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-9 h-9 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-cyan-500 dark:hover:text-cyan-400 cursor-pointer overflow-hidden relative"
        >
          <AnimatePresence mode="wait">
            {theme === "dark" ? (
              <motion.div
                key="moon"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Moon size={16} />
              </motion.div>
            ) : (
              <motion.div
                key="sun"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Sun size={16} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Notification Bell */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-9 h-9 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer relative"
        >
          <Bell size={16} />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
        </motion.button>

        {/* User pill */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="flex items-center gap-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-colors rounded-xl p-1 pr-3 cursor-pointer"
        >
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center shrink-0 shadow-inner">
            <User size={14} className="text-white" />
          </div>
          <div className="hidden sm:block">
            <div className="font-semibold text-xs text-slate-900 dark:text-slate-200 leading-tight">Admin</div>
            <div className="text-[10px] text-slate-500">HashPilot</div>
          </div>
        </motion.div>
      </div>
    </motion.header>
  );
}

export default Navbar;