import { Brain, Target, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

export default function AIPredictionCard({ prediction }) {
  if (!prediction) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mb-6"
    >
      <div className="bg-white dark:bg-slate-900 border border-cyan-200 dark:border-cyan-500/20 rounded-2xl p-6 shadow-xl">

        <div className="flex items-center gap-3 mb-5">
          <Brain className="text-cyan-600 dark:text-cyan-400" size={28} />
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            AI Prediction
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-5">

          <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-transparent">

            <div className="flex items-center gap-2 mb-2">
              <Target className="text-emerald-500 dark:text-green-400" />
              <span className="text-slate-500 dark:text-slate-300">
                Recommended Strategy
              </span>
            </div>

            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              {prediction.recommended_strategy}
            </h3>

          </div>

          <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-transparent">

            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="text-cyan-600 dark:text-cyan-400" />
              <span className="text-slate-500 dark:text-slate-300">
                Confidence
              </span>
            </div>

            <h3 className="text-xl font-bold text-cyan-600 dark:text-cyan-400">
              {prediction.confidence}%
            </h3>

          </div>

        </div>

      </div>
    </motion.div>
  );
}