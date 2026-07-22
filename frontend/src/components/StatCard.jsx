import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Card } from "./ui/Card";

function useCountUp(endValue, duration = 1000) {
  const [count, setCount] = useState(0);
  const isPlainString = typeof endValue === "string" && isNaN(Number(endValue));

  useEffect(() => {
    if (isPlainString) return;

    let startValue = 0;
    const end = parseFloat(endValue) || 0;
    const isFloat = endValue.toString().includes(".");
    
    let startTime = null;
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);
      
      const current = startValue + (end - startValue) * percentage;
      
      if (isFloat) {
        setCount(current.toFixed(4));
      } else {
        setCount(Math.floor(current));
      }

      if (progress < duration) {
        requestAnimationFrame(animate);
      } else {
        setCount(endValue);
      }
    };
    
    requestAnimationFrame(animate);
  }, [endValue, duration, isPlainString]);

  return isPlainString ? endValue : count;
}

export default function StatCard({ title, value, icon, color, delay = 0 }) {
  const animatedValue = useCountUp(value, 900);
  const formattedValue =
    typeof animatedValue === "number" && !title.includes("Runtime")
      ? animatedValue.toLocaleString()
      : animatedValue;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay, ease: "easeOut" }}
      className="h-full"
    >
      <Card className="h-full p-4 relative overflow-hidden">
        {/* Top accent bar */}
        <div
          className="absolute top-0 left-0 right-0 h-0.5 rounded-t-[var(--radius-lg)]"
          style={{ backgroundColor: color }}
        />

        <div className="flex justify-between items-start mb-3 mt-1">
          <div
            className="text-[11px] font-semibold uppercase tracking-widest"
            style={{ color: "var(--text-muted)" }}
          >
            {title}
          </div>
          <div
            className="w-8 h-8 rounded-[var(--radius-sm)] flex items-center justify-center shrink-0"
            style={{ backgroundColor: `${color}18`, color }}
          >
            {icon}
          </div>
        </div>

        <div
          className="text-2xl font-bold tracking-tight mono break-all"
          style={{ color: "var(--text-primary)" }}
        >
          {formattedValue}
        </div>
      </Card>
    </motion.div>
  );
}
