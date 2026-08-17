import React from "react";
import { motion } from "framer-motion";
import { Sparkles, X } from "lucide-react";
import { modeAccents } from "@/lib/mockData";

export default function MoodMessageCard({ message, mode, onDismiss }) {
  const accent = modeAccents[mode];

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-2xl p-6 bg-white"
      style={{ border: `1px solid ${accent}30`, boxShadow: `0 4px 24px ${accent}10` }}
    >
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ background: `linear-gradient(135deg, ${accent}, transparent 60%)` }}
      />
      <div className="relative flex items-start gap-4">
        <div
          className="shrink-0 flex items-center justify-center w-10 h-10 rounded-xl"
          style={{ background: `${accent}12` }}
        >
          <Sparkles className="w-5 h-5" style={{ color: accent }} />
        </div>
        <div className="flex-1 pt-1.5">
          <p className="text-[10px] font-semibold tracking-[0.15em] uppercase text-stone-400 mb-1.5">
            AI Mood Match
          </p>
          <p className="text-sm text-stone-700 leading-relaxed">{message}</p>
        </div>
        <button
          onClick={onDismiss}
          className="shrink-0 text-stone-300 hover:text-stone-500 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}