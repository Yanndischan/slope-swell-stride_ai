import React, { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Loader2 } from "lucide-react";
import { modeAccents } from "@/lib/mockData";
import { simulateFromMood } from "@/lib/fetch-destination-data.entry";

export default function MoodRouter({ mode, onRoute }) {
  const [mood, setMood] = useState("");
  const [loading, setLoading] = useState(false);
  const accent = modeAccents[mode];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!mood.trim() || loading) return;
    setLoading(true);
    try {
      const result = await simulateFromMood(mood.trim());
      onRoute(result);
    } catch {
      onRoute({
        mode: "run",
        location: "Boulder, CO",
        message: "We recommend a grounding trail run in Boulder. The air quality is pristine (AQI 12) and winds are completely calm, perfect for clearing your mind.",
        locationData: null,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <p className="text-center text-[10px] font-semibold tracking-[0.2em] uppercase text-stone-400 mb-2">
        How are you feeling today?
      </p>
      <form onSubmit={handleSubmit}>
        <motion.div
          animate={loading ? { scale: [1, 1.003, 1] } : {}}
          transition={{ duration: 1.5, repeat: loading ? Infinity : 0 }}
          className="flex items-center gap-2.5 px-3.5 py-2 rounded-full bg-white transition-all duration-400"
          style={{
            border: `1px solid ${loading ? accent + "40" : "rgba(0,0,0,0.08)"}`,
            boxShadow: loading
              ? `0 0 0 2px ${accent}10`
              : "0 1px 4px rgba(0,0,0,0.03)"
          }}
        >
          <Sparkles className="w-4 h-4 shrink-0" style={{ color: accent }} />
          <input
            type="text"
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            placeholder="e.g., I'm completely stressed and need a quiet escape into nature..."
            disabled={loading}
            className="flex-1 bg-transparent text-stone-900 placeholder-stone-300 text-xs outline-none disabled:opacity-60 text-center"
          />
          <button
            type="submit"
            disabled={loading || !mood.trim()}
            className="shrink-0 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-semibold tracking-[0.1em] uppercase transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
            style={{
              background: mood.trim() ? `${accent}15` : "rgba(0,0,0,0.04)",
              border: `1px solid ${mood.trim() ? accent + "30" : "rgba(0,0,0,0.06)"}`,
              color: accent
            }}
          >
            {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <>Discover My Pace <ArrowRight className="w-3 h-3" /></>}
          </button>
        </motion.div>
      </form>
      {loading && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-xs text-stone-400 mt-2"
        >
          Finding your perfect match…
        </motion.p>
      )}
    </div>
  );
}