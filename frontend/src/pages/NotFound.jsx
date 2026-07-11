import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, Zap } from "lucide-react";
import { Button } from "../components/ui/Button";

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-slate-950 px-4 text-center">
      {/* Background gradients */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(34,211,238,0.12),transparent_60%),radial-gradient(ellipse_at_bottom_right,rgba(99,102,241,0.12),transparent_50%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.04)_1px,transparent_1px)] bg-[size:40px_40px]" />

      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-300/30 bg-gradient-to-br from-cyan-400 to-indigo-500 shadow-[0_0_60px_rgba(34,211,238,0.4)]"
      >
        <Zap size={32} className="text-white" strokeWidth={2.5} />
      </motion.div>

      {/* 404 number */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-4 bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-400 bg-clip-text text-[120px] font-black leading-none tracking-tighter text-transparent md:text-[160px]"
      >
        404
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-3 text-2xl font-black text-white md:text-3xl"
      >
        Page Not Found
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mb-10 max-w-sm text-base text-slate-400"
      >
        This benchmark path doesn't exist. Head back to the dashboard to run
        your next analysis.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Link to="/">
          <Button variant="primary" className="h-12 px-8 text-base">
            <Home size={20} />
            Back to Dashboard
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}
