/**
 * AIPredictionCard
 *
 * Displays the ML model's strategy recommendation with:
 *   - Confidence dial (animated SVG)
 *   - Signal-strength bar
 *   - Model accuracy metric
 *   - Prediction timestamp
 *   - "Predicted vs Actual" comparison after a benchmark run
 *   - Retrain AI Model button
 */

import { useState } from "react";
import {
  Brain,
  CheckCircle2,
  Clock3,
  Gauge,
  RefreshCw,
  Sparkles,
  Target,
  XCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import api from "../api/api";
import { Card } from "./ui/Card";
import { Badge } from "./ui/Badge";
import { Button } from "./ui/Button";

function confidenceValue(prediction) {
  const raw = Number(prediction?.confidence ?? 0);
  return Math.max(0, Math.min(100, raw));
}

export default function AIPredictionCard({ prediction, actualWinner }) {
  const [retraining, setRetraining] = useState(false);
  const [latestAccuracy, setLatestAccuracy] = useState(null);

  const confidence = confidenceValue(prediction);
  const timestamp = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const accuracy =
    latestAccuracy ??
    prediction?.model_accuracy ??
    prediction?.accuracy ??
    null;

  // ── Predicted vs Actual logic ──────────────────────────────────────────────
  const predictedStrategy = prediction?.recommended_strategy;
  const actualStrategy = actualWinner?.strategy;

  const hasComparison = !!predictedStrategy && !!actualStrategy;
  const predictionCorrect =
    hasComparison && predictedStrategy === actualStrategy;

  // ── Retrain handler ────────────────────────────────────────────────────────
  async function handleRetrain() {
    setRetraining(true);
    const toastId = toast.loading("Retraining AI model…");
    try {
      const { data } = await api.post("/predict/retrain");
      setLatestAccuracy(data.accuracy);
      toast.success(
        `Model retrained! New accuracy: ${data.accuracy}%`,
        { id: toastId, duration: 5000 }
      );
    } catch (err) {
      const detail = err?.response?.data?.detail ?? "Retrain failed.";
      toast.error(detail, { id: toastId });
    } finally {
      setRetraining(false);
    }
  }

  return (
    <Card className="relative h-full min-h-[360px] overflow-hidden p-6" animate>
      {/* Background gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.18),transparent_35%),linear-gradient(135deg,rgba(99,102,241,0.12),transparent_45%)]" />
      <div className="absolute -inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/70 to-transparent" />

      <div className="relative z-10 flex h-full flex-col">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-300/25 bg-cyan-400/10 text-cyan-300 shadow-[0_0_32px_rgba(34,211,238,0.22)]">
              <Brain size={25} />
              <span className="absolute inset-0 rounded-2xl animate-glow-pulse" />
            </div>
            <div>
              <h2 className="m-0 text-lg font-black text-slate-950 dark:text-white">
                AI Prediction
              </h2>
              <p className="m-0 mt-1 text-xs text-slate-500">
                Adaptive strategy forecast
              </p>
            </div>
          </div>
          <Badge variant="accent" dot className="bg-cyan-400/10">
            Live
          </Badge>
        </div>

        {prediction ? (
          <>
            {/* Recommended Strategy */}
            <div className="mb-4 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4">
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-emerald-500">
                <Target size={16} />
                Recommendation
              </div>
              <div className="text-2xl font-black text-slate-950 dark:text-white">
                {predictedStrategy}
              </div>
            </div>

            {/* Confidence dial + metrics */}
            <div className="mb-4 grid grid-cols-[130px_1fr] items-center gap-5">
              <div className="relative h-[130px] w-[130px]">
                <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    fill="none"
                    stroke="rgba(148,163,184,0.18)"
                    strokeWidth="10"
                  />
                  <motion.circle
                    cx="60"
                    cy="60"
                    r="50"
                    fill="none"
                    stroke="url(#confidenceGradient)"
                    strokeWidth="10"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: confidence / 100 }}
                    transition={{ duration: 1.1, ease: "easeOut" }}
                  />
                  <defs>
                    <linearGradient
                      id="confidenceGradient"
                      x1="0"
                      y1="0"
                      x2="1"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#22d3ee" />
                      <stop offset="100%" stopColor="#818cf8" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-black text-slate-950 dark:text-white">
                    {confidence}%
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                    Confidence
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                {/* Signal strength bar */}
                <div>
                  <div className="mb-2 flex items-center justify-between text-xs font-semibold text-slate-500">
                    <span>Signal Strength</span>
                    <span>{confidence}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-indigo-400"
                      initial={{ width: 0 }}
                      animate={{ width: `${confidence}%` }}
                      transition={{ duration: 0.9, ease: "easeOut" }}
                    />
                  </div>
                </div>

                {accuracy !== null && (
                  <Metric
                    icon={Gauge}
                    label="Model Accuracy"
                    value={`${accuracy}%`}
                  />
                )}
                <Metric icon={Clock3} label="Updated" value={timestamp} />
              </div>
            </div>

            {/* ── Predicted vs Actual comparison ─────────────────────────── */}
            <AnimatePresence>
              {hasComparison && (
                <motion.div
                  key="comparison"
                  initial={{ opacity: 0, y: 8, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -8, height: 0 }}
                  transition={{ duration: 0.35 }}
                  className="mb-4 overflow-hidden"
                >
                  <div
                    className={`rounded-2xl border p-4 ${
                      predictionCorrect
                        ? "border-emerald-400/30 bg-emerald-400/10"
                        : "border-red-400/30 bg-red-400/10"
                    }`}
                  >
                    <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                      {predictionCorrect ? (
                        <CheckCircle2 size={14} className="text-emerald-500" />
                      ) : (
                        <XCircle size={14} className="text-red-500" />
                      )}
                      Predicted vs Actual
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                          Predicted
                        </div>
                        <div className="font-black text-slate-950 dark:text-white">
                          {predictedStrategy?.replace("Strategy", "")}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                          Actual Winner
                        </div>
                        <div
                          className={`font-black ${
                            predictionCorrect
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-red-600 dark:text-red-400"
                          }`}
                        >
                          {actualStrategy?.replace("Strategy", "")}
                        </div>
                      </div>
                    </div>
                    <div className="mt-2">
                      <Badge
                        variant={predictionCorrect ? "success" : "danger"}
                        className="text-xs"
                      >
                        {predictionCorrect ? "✓ Correct" : "✗ Incorrect"}
                      </Badge>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Retrain button ──────────────────────────────────────────── */}
            <div className="mt-auto pt-2">
              <Button
                variant="outline"
                onClick={handleRetrain}
                disabled={retraining}
                className="w-full text-sm"
              >
                {retraining ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                      className="h-4 w-4"
                    >
                      <RefreshCw size={16} />
                    </motion.div>
                    Retraining…
                  </>
                ) : (
                  <>
                    <Brain size={16} />
                    Retrain AI Model
                  </>
                )}
              </Button>
            </div>
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 p-8 text-center dark:border-white/10">
            <Sparkles size={28} className="mb-3 text-cyan-300" />
            <div className="font-bold text-slate-950 dark:text-white">
              Awaiting prediction
            </div>
            <div className="mt-1 text-sm text-slate-500">
              Tune benchmark inputs to refresh the AI forecast.
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

function Metric({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/70 p-3 dark:border-white/10 dark:bg-white/[0.04]">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-400/10 text-indigo-300">
        <Icon size={16} />
      </div>
      <div>
        <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
          {label}
        </div>
        <div className="text-sm font-bold text-slate-950 dark:text-white">
          {value}
        </div>
      </div>
    </div>
  );
}
