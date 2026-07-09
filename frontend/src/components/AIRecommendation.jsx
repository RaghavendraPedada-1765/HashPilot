import { Sparkles, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "./ui/Card";

export default function AIRecommendation({ analysis }) {
  if (!analysis) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, height: 0, scale: 0.95 }}
        animate={{ opacity: 1, height: "auto", scale: 1 }}
        exit={{ opacity: 0, height: 0, scale: 0.95 }}
        transition={{ duration: 0.5 }}
        className="mb-8 overflow-hidden"
      >
        <Card className="relative p-6 overflow-hidden border-indigo-200 dark:border-indigo-500/30">

          <div className="absolute inset-0 bg-gradient-to-r from-indigo-50 dark:from-indigo-500/10 via-cyan-50 dark:via-cyan-500/5 to-indigo-50 dark:to-indigo-500/10" />

          <div className="relative z-10 flex gap-5">

            <div className="w-14 h-14 rounded-2xl bg-indigo-100 dark:bg-indigo-500/20 border border-indigo-200 dark:border-indigo-500/30 flex items-center justify-center">
              <Sparkles
                size={28}
                className="text-indigo-600 dark:text-indigo-400"
              />
            </div>

            <div className="flex-1">

              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                AI Recommendation
              </h3>

              <div className="space-y-3 text-slate-700 dark:text-slate-300">

                <p>
                  <strong>Recommended Strategy:</strong>{" "}
                  <span className="text-cyan-600 dark:text-cyan-400">
                    {analysis.recommended_strategy}
                  </span>
                </p>

                <p>
                  <strong>Confidence:</strong>{" "}
                  {analysis.confidence}%
                </p>

                <p>
                  <strong>Predicted Winner:</strong>{" "}
                  <span className="text-emerald-600 dark:text-emerald-400">
                    {analysis.winner?.strategy || "Unknown"}
                  </span>
                </p>

                <div>

                  <strong>Reasons</strong>

                  <ul className="mt-2 space-y-2">

                    {analysis.reasons?.map((reason, index) => (

                      <li
                        key={index}
                        className="flex items-start gap-2"
                      >

                        <CheckCircle2
                          size={16}
                          className="text-emerald-500 dark:text-green-400 mt-1 shrink-0"
                        />

                        <span>{reason}</span>

                      </li>

                    ))}

                  </ul>

                </div>

              </div>

            </div>

          </div>

        </Card>

      </motion.div>
    </AnimatePresence>
  );
}