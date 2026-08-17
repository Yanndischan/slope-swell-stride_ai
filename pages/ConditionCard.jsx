import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";
import { modeAccents } from "@/lib/mockData";
import Sparkline from "@/components/dashboard/Sparkline";

const generateTrend = (label) => {
  let hash = 0;
  for (let i = 0; i < label.length; i++) hash = (hash * 31 + label.charCodeAt(i)) | 0;
  const trendUp = hash % 3 !== 0;
  const points = 8;
  const data = [];
  let v = 45;
  for (let i = 0; i < points; i++) {
    const noise = Math.sin(i * 1.3 + hash * 0.01) * 7;
    v += (trendUp ? 3.5 : -3.5) + noise * 0.25;
    data.push(Math.max(10, Math.min(90, v)));
  }
  return { data, trendUp };
};

export default function ConditionCard({ label, value, unit, index, mode }) {
  const accent = modeAccents[mode];
  const { data: trendData, trendUp } = generateTrend(label);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="relative group rounded-2xl p-5 transition-all duration-400 overflow-hidden bg-white border border-stone-200/60"
      style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}
      whileHover={{ y: -2 }}
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: `radial-gradient(circle at 50% 0%, ${accent}0a, transparent 70%)` }}
      />
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
      />

      <div className="relative">
        <div className="flex items-start justify-between mb-2">
          <p className="text-[10px] font-semibold tracking-[0.15em] uppercase text-stone-400">
            {label}
          </p>
          {trendUp ? (
            <TrendingUp className="w-3 h-3 text-stone-300" />
          ) : (
            <TrendingDown className="w-3 h-3 text-stone-300" />
          )}
        </div>
        <div className="flex items-end justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold tracking-tight tabular-nums" style={{ color: accent }}>
              {value}
            </span>
            {unit && <span className="text-sm font-medium text-stone-400">{unit}</span>}
          </div>
          <div className="opacity-60 group-hover:opacity-100 transition-opacity duration-500">
            <Sparkline data={trendData} color={accent} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}