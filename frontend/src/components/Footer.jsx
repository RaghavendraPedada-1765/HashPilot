import { ExternalLink, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-12 border-t border-slate-200/70 bg-white/50 px-6 py-5 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/40">
      <div className="mx-auto flex max-w-[1440px] flex-col items-center justify-between gap-4 sm:flex-row">
        {/* Status indicator */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <span className="h-1.5 w-1.5 animate-dot-pulse rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
          All systems operational
        </div>

        {/* Brand + links */}
        <div className="flex items-center gap-4 text-xs text-slate-500">
          <span>
            Built with{" "}
            <Heart
              size={11}
              className="inline-block text-red-400"
              fill="currentColor"
            />{" "}
            by HashPilot
          </span>
          <span className="hidden sm:inline text-slate-300 dark:text-slate-700">|</span>
          <span className="hidden sm:inline">v1.0.0</span>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white/70 px-2 py-1 transition hover:border-slate-300 hover:text-slate-900 dark:border-white/10 dark:bg-white/[0.04] dark:hover:text-white"
          >
            <ExternalLink size={13} />
            GitHub
          </a>
        </div>

        {/* Copyright */}
        <p className="text-xs text-slate-400">
          © {new Date().getFullYear()} HashPilot · AI Benchmark Platform
        </p>
      </div>
    </footer>
  );
}