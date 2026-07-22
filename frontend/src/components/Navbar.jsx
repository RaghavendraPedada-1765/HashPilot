import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { BarChart3, Command, History, LayoutDashboard, Moon, Search, Sun, X } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const PAGE_TITLES = {
  "/":          { label: "Dashboard",        sub: "Benchmark command center" },
  "/history":   { label: "History",          sub: "Benchmark execution records" },
  "/analytics": { label: "Analytics",        sub: "Performance trends & strategy insights" },
};

const COMMANDS = [
  { label: "Open Dashboard", path: "/",          icon: LayoutDashboard },
  { label: "Open History",   path: "/history",   icon: History },
  { label: "Open Analytics", path: "/analytics", icon: BarChart3 },
];

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [query, setQuery] = useState("");

  const page = PAGE_TITLES[location.pathname] ?? { label: "HashPilot", sub: "" };

  const filteredCommands = useMemo(
    () => COMMANDS.filter((item) => item.label.toLowerCase().includes(query.toLowerCase())),
    [query]
  );

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen(true);
      }
      if (e.key === "Escape") setPaletteOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const openCommand = (path) => {
    navigate(path);
    setPaletteOpen(false);
    setQuery("");
  };

  return (
    <>
      <header
        className="sticky top-0 z-30 flex h-12 shrink-0 items-center justify-between px-5"
        style={{
          background: "var(--bg-surface)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        {/* Page title */}
        <div>
          <h2
            className="m-0 text-sm font-semibold leading-tight"
            style={{ color: "var(--text-primary)" }}
          >
            {page.label}
          </h2>
          {page.sub && (
            <p className="m-0 text-[11px]" style={{ color: "var(--text-muted)" }}>
              {page.sub}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Ctrl+K quick launcher */}
          <button
            type="button"
            onClick={() => setPaletteOpen(true)}
            className="hidden sm:flex h-8 items-center gap-2 rounded-[var(--radius-sm)] px-3 text-xs transition-colors duration-150"
            style={{
              background: "var(--bg-base)",
              border: "1px solid var(--border)",
              color: "var(--text-muted)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--border-strong)")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
          >
            <Search size={12} />
            <span>Quick open</span>
            <kbd
              className="rounded px-1.5 py-0.5 text-[10px] font-medium"
              style={{ background: "var(--bg-overlay)", color: "var(--text-muted)" }}
            >
              Ctrl K
            </kbd>
          </button>

          {/* Theme toggle */}
          <motion.button
            onClick={toggleTheme}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.93 }}
            className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-sm)] transition-colors duration-150"
            style={{ border: "1px solid var(--border)", background: "var(--bg-base)", color: "var(--text-muted)" }}
            title="Toggle theme"
          >
            <AnimatePresence mode="wait">
              {theme === "dark" ? (
                <motion.div key="moon" initial={{ y: -12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 12, opacity: 0 }}>
                  <Moon size={14} />
                </motion.div>
              ) : (
                <motion.div key="sun" initial={{ y: -12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 12, opacity: 0 }}>
                  <Sun size={14} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </header>

      {/* Command palette */}
      <AnimatePresence>
        {paletteOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-20"
            style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPaletteOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.97 }}
              transition={{ duration: 0.18 }}
              className="w-full max-w-md overflow-hidden rounded-[var(--radius-xl)] shadow-[var(--shadow-panel)]"
              style={{ background: "var(--bg-overlay)", border: "1px solid var(--border-strong)" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="flex items-center gap-3 px-4 py-3"
                style={{ borderBottom: "1px solid var(--border)" }}
              >
                <Command size={15} style={{ color: "var(--accent)" }} />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search commands..."
                  className="flex-1 bg-transparent text-sm outline-none"
                  style={{ color: "var(--text-primary)" }}
                />
                <button
                  type="button"
                  onClick={() => setPaletteOpen(false)}
                  className="rounded p-1 transition-colors"
                  style={{ color: "var(--text-muted)" }}
                >
                  <X size={14} />
                </button>
              </div>
              <div className="p-2">
                {filteredCommands.map(({ label, path, icon: Icon }) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => openCommand(path)}
                    className="flex w-full items-center gap-3 rounded-[var(--radius-md)] px-3 py-2.5 text-left text-sm font-medium transition-colors duration-100"
                    style={{ color: "var(--text-secondary)" }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "var(--bg-elevated)"; e.currentTarget.style.color = "var(--text-primary)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-secondary)"; }}
                  >
                    <Icon size={15} style={{ color: "var(--accent)" }} />
                    {label}
                  </button>
                ))}
                {filteredCommands.length === 0 && (
                  <div className="px-3 py-6 text-center text-sm" style={{ color: "var(--text-muted)" }}>
                    No matching commands.
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Navbar;
