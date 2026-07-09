import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  BarChart3,
  Bell,
  Command,
  History,
  LayoutDashboard,
  Menu,
  Moon,
  Search,
  Sun,
  User,
  X,
  Zap,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { Badge } from "./ui/Badge";

const PAGE_TITLES = {
  "/": { label: "Dashboard", sub: "Benchmark command center" },
  "/history": { label: "Benchmark History", sub: "Searchable execution records" },
  "/analytics": { label: "Analytics", sub: "Performance trends and strategy insights" },
};

const COMMANDS = [
  { label: "Open Dashboard", path: "/", icon: LayoutDashboard },
  { label: "Open History", path: "/history", icon: History },
  { label: "Open Analytics", path: "/analytics", icon: BarChart3 },
];

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");
  const page = PAGE_TITLES[location.pathname] ?? { label: "HashPilot", sub: "" };

  const filteredCommands = useMemo(
    () => COMMANDS.filter((item) => item.label.toLowerCase().includes(query.toLowerCase())),
    [query]
  );

  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setPaletteOpen(true);
      }
      if (event.key === "Escape") {
        setPaletteOpen(false);
        setMobileOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const openCommand = (path) => {
    navigate(path);
    setPaletteOpen(false);
    setMobileOpen(false);
    setQuery("");
  };

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="sticky top-0 z-30 flex min-h-[72px] shrink-0 items-center justify-between border-b border-slate-200/70 bg-white/75 px-4 backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/45 md:px-6"
      >
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 lg:hidden dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300"
          >
            <Menu size={18} />
          </button>
          <div className="min-w-0">
            <h2 className="m-0 truncate text-base font-black tracking-tight text-slate-950 dark:text-white">
              {page.label}
            </h2>
            {page.sub && <p className="m-0 mt-0.5 truncate text-xs text-slate-500">{page.sub}</p>}
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <Badge variant="success" dot className="hidden border-emerald-400/25 bg-emerald-400/10 shadow-[0_0_18px_rgba(52,211,153,0.12)] md:inline-flex">
            Backend Online
          </Badge>

          <button
            type="button"
            onClick={() => setPaletteOpen(true)}
            className="hidden h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white/70 px-3 text-sm text-slate-500 transition hover:border-slate-300 hover:text-slate-900 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-400 dark:hover:border-cyan-400/30 dark:hover:text-white sm:flex"
          >
            <Search size={15} />
            <span className="hidden md:inline">Quick actions</span>
            <kbd className="rounded-md border border-slate-200 bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold dark:border-white/10 dark:bg-white/10">
              Ctrl K
            </kbd>
          </button>

          <motion.button
            onClick={toggleTheme}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white/70 text-slate-500 transition hover:text-cyan-500 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-400 dark:hover:text-cyan-300"
            title="Toggle theme"
          >
            <AnimatePresence mode="wait">
              {theme === "dark" ? (
                <motion.div key="moon" initial={{ y: -18, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 18, opacity: 0 }}>
                  <Moon size={16} />
                </motion.div>
              ) : (
                <motion.div key="sun" initial={{ y: -18, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 18, opacity: 0 }}>
                  <Sun size={16} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>

          <button className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white/70 text-slate-500 transition hover:text-slate-900 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-400 dark:hover:text-white">
            <Bell size={16} />
            <span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.9)]" />
          </button>

          <div className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-white/70 p-1 pr-3 dark:border-white/10 dark:bg-white/[0.04] sm:flex">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-indigo-500 text-white">
              <User size={14} />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-950 dark:text-white">Admin</div>
              <div className="text-[10px] text-slate-500">HashPilot</div>
            </div>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {paletteOpen && (
          <motion.div className="fixed inset-0 z-50 flex items-start justify-center bg-slate-950/60 px-4 pt-24 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div
              initial={{ opacity: 0, y: 18, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              className="w-full max-w-xl overflow-hidden rounded-2xl border border-white/10 bg-slate-950/95 shadow-[0_30px_100px_rgba(0,0,0,0.55)]"
            >
              <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
                <Command size={18} className="text-cyan-300" />
                <input
                  autoFocus
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search commands..."
                  className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
                />
                <button type="button" onClick={() => setPaletteOpen(false)} className="rounded-lg p-1 text-slate-500 transition hover:bg-white/10 hover:text-white">
                  <X size={16} />
                </button>
              </div>
              <div className="p-2">
                {filteredCommands.map(({ label, path, icon: Icon }) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => openCommand(path)}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold text-slate-300 transition hover:bg-cyan-400/10 hover:text-white"
                  >
                    <Icon size={17} className="text-cyan-300" />
                    {label}
                  </button>
                ))}
                {filteredCommands.length === 0 && <div className="px-3 py-8 text-center text-sm text-slate-500">No matching actions.</div>}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div className="fixed inset-0 z-50 bg-slate-950/65 backdrop-blur-sm lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }} className="h-full w-[280px] border-r border-white/10 bg-slate-950 p-5">
              <div className="mb-8 flex items-center justify-between">
                <div className="flex items-center gap-3 text-white">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-indigo-500">
                    <Zap size={20} />
                  </div>
                  <span className="font-black">HashPilot</span>
                </div>
                <button type="button" onClick={() => setMobileOpen(false)} className="rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white">
                  <X size={18} />
                </button>
              </div>
              <div className="space-y-2">
                {COMMANDS.map(({ label, path, icon: Icon }) => (
                  <Link
                    key={label}
                    to={path}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-slate-300 hover:bg-white/10 hover:text-white"
                  >
                    <Icon size={17} />
                    {label.replace("Open ", "")}
                  </Link>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Navbar;
