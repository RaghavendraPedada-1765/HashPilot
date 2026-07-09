import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Card } from "./ui/Card";

function useCountUp(endValue, duration = 1000) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // If it's not a number (e.g., string like "SequentialStrategy"), just return it
    if (typeof endValue === "string" && isNaN(Number(endValue))) {
      setCount(endValue);
      return;
    }

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
  }, [endValue, duration]);

  return count;
}

export default function StatCard({ title, value, icon, color, delay = 0 }) {
  const animatedValue = useCountUp(value, 1000);
  
  // Try formatting if it's a number, otherwise just string it
  const formattedValue = typeof animatedValue === "number" && !title.includes("Runtime") 
    ? animatedValue.toLocaleString() 
    : animatedValue;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      whileHover={{ y: -4 }}
      className="h-full"
    >
      <Card className="h-full p-6 relative overflow-hidden group">
        {/* Animated Gradient Border (simulated with before/after) */}
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: `radial-gradient(circle at top right, ${color}30 0%, transparent 50%)`,
          }}
        />
        
        {/* Top edge colored border */}
        <div 
          className="absolute top-0 left-0 right-0 h-1"
          style={{ backgroundColor: color }}
        />

        <div className="flex justify-between items-start mb-4">
          <div className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{title}</div>
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-lg"
            style={{ backgroundColor: `${color}15`, color: color, border: `1px solid ${color}30` }}
          >
            {icon}
          </div>
        </div>

        <div className="flex items-baseline gap-2">
          <div className="text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight break-all">
            {formattedValue}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}