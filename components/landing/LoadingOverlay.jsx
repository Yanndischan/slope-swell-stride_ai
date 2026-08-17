import React from "react";
import { motion } from "framer-motion";
import { Compass } from "lucide-react";
import { modeAccents } from "@/lib/mockData";

export default function LoadingOverlay({ mode, label }) {
  const accent = modeAccents[mode] || modeAccents.surf;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      style={{ background: "rgba(248,249,251,0.92)", backdropFilter: "blur(20px) saturate(180%)" }}
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      >
        <Compass className="w-8 h-8" style={{ color: accent }} />
      </motion.div>
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-5 text-[10px] font-semibold tracking-[0.2em] uppercase text-stone-400"
      >
        {label || "Routing your adventure…"}
      </motion.p>
    </motion.div>
  );
}