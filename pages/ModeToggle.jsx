import React from "react";
import { motion } from "framer-motion";
import { Waves, Mountain, Footprints } from "lucide-react";
import { modeAccents } from "@/lib/mockData";

const modes = [
  { key: "surf", label: "Swell", icon: Waves },
  { key: "ski", label: "Slope", icon: Mountain },
  { key: "run", label: "Stride", icon: Footprints },
];

export default function ModeToggle({ mode, onToggle }) {
  return (
    <div className="relative inline-flex items-center gap-1 p-1 rounded-full bg-white/50 dark:bg-stone-800/50 border border-stone-200/60 dark:border-stone-700/60 backdrop-blur-md">
      {modes.map((m) => {
        const Icon = m.icon;
        const isActive = m.key === mode;
        const accent = modeAccents[m.key];

        return (
          <button
            key={m.key}
            onClick={() => onToggle(m.key)}
            className="relative px-5 py-2 rounded-full text-xs font-semibold tracking-[0.1em] uppercase transition-colors duration-300 z-10"
            style={{ color: isActive ? accent : "rgba(0,0,0,0.3)" }}
          >
            {isActive && (
              <motion.div
                layoutId="mode-pill"
                className="absolute inset-0 rounded-full"
                style={{ background: `${accent}12`, border: `1px solid ${accent}40` }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative flex items-center gap-1.5">
              <Icon className="w-3.5 h-3.5" />
              {m.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}