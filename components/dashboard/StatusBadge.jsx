import React from "react";
import { motion } from "framer-motion";
import { modeAccents } from "@/lib/mockData";

export default function StatusBadge({ label, emoji, mode }) {
  const accent = modeAccents[mode];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold tracking-[0.1em] uppercase"
      style={{
        background: `${accent}10`,
        border: `1px solid ${accent}30`,
        color: accent,
        boxShadow: `0 2px 12px ${accent}10`,
      }}
    >
      <span className="text-sm">{emoji}</span>
      <span>{label}</span>
    </motion.div>
  );
}