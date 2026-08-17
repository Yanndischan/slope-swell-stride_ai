import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Compass, ArrowRight, Telescope, Sparkles } from "lucide-react";
import ModeToggle from "@/components/landing/ModeToggle";
import SearchBar from "@/components/landing/SearchBar";
import DateRangePicker from "@/components/landing/DateRangePicker";
import MoodRouter from "@/components/landing/MoodRouter";
import LoadingOverlay from "@/components/landing/LoadingOverlay";
import { modeAccents, heroText, popularByMode } from "@/lib/mockData";
import { simulateSearch } from "@/lib/fetch-destination-data.entry";
import ThemeToggle from "@/components/ThemeToggle";

export default function Home() {
  const [mode, setMode] = useState("surf");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const accent = modeAccents[mode];
  const hero = heroText[mode];

  const handleSearch = async (locationName) => {
    setLoading(true);
    const result = await simulateSearch(locationName, mode);
    setLoading(false);
    navigate(
      `/dashboard?location=${encodeURIComponent(result.destination)}`,
      { state: { moodMessage: null, locationData: result.locationData } }
    );
  };

  const handleMoodRoute = ({ mode: recommendedMode, location, message, locationData }) => {
    setMode(recommendedMode);
    setTimeout(() => {
      navigate(
        `/dashboard?location=${encodeURIComponent(location)}`,
        { state: { moodMessage: message, locationData } }
      );
    }, 900);
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      <AnimatePresence>
        {loading && <LoadingOverlay mode={mode} label="Routing your adventure…" />}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.div
          key={mode}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="fixed inset-0 pointer-events-none"
        >
          <div
            className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[900px] h-[700px] rounded-full blur-[200px] opacity-[0.1]"
            style={{ background: `radial-gradient(circle, ${accent}, transparent 70%)` }}
          />
          <div
            className="absolute bottom-[-5%] right-[-10%] w-[500px] h-[500px] rounded-full blur-[160px] opacity-[0.06]"
            style={{ background: `radial-gradient(circle, ${accent}, transparent 70%)` }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Header */}
      <div className="absolute top-0 left-0 right-0 px-8 py-6 flex items-center justify-between z-10">
        <div className="flex items-center gap-2.5">
          <Compass className="w-5 h-5 transition-colors duration-500" style={{ color: accent }} />
          <span className="text-sm font-semibold tracking-tight text-stone-700 dark:text-stone-200 font-heading">
            Slope, Swell & Stride AI
          </span>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => navigate("/gear-concierge")}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-semibold tracking-[0.18em] uppercase text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100 transition-all duration-300 group border border-stone-200/60 dark:border-stone-700/60 bg-white/50 dark:bg-stone-800/50"
          >
            <Sparkles className="w-3.5 h-3.5 transition-transform duration-300 group-hover:scale-110" style={{ color: accent }} />
            <span className="hidden sm:inline">Gear Concierge</span>
          </button>
          <button
            onClick={() => navigate("/my-horizon")}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-semibold tracking-[0.18em] uppercase text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100 transition-all duration-300 group border border-stone-200/60 dark:border-stone-700/60 bg-white/50 dark:bg-stone-800/50"
          >
            <Telescope className="w-3.5 h-3.5 transition-transform duration-300 group-hover:rotate-12" />
            <span className="hidden sm:inline">My Horizon</span>
          </button>
        </div>
      </div>

      {/* Hero */}
      <div className="relative z-10 flex flex-col items-center gap-7 px-8 max-w-2xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <h1 className="text-5xl md:text-[4.5rem] font-medium tracking-[-0.02em] text-stone-900 dark:text-stone-100 leading-[1.08] text-balance font-heading">
            <AnimatePresence mode="wait">
              <motion.span
                key={mode}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
                className="inline-block"
              >
                {hero.prefix}
              </motion.span>
            </AnimatePresence>{" "}
            <span className="italic transition-colors duration-500" style={{ color: accent }}>
              {hero.accent}
            </span>
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.6 }}
        >
          <ModeToggle mode={mode} onToggle={setMode} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.6 }}
          className="w-full"
        >
          <MoodRouter mode={mode} onRoute={handleMoodRoute} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col sm:flex-row items-center gap-3 w-full"
        >
          <SearchBar mode={mode} onSearch={handleSearch} />
          <DateRangePicker mode={mode} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex items-center gap-3 text-sm text-stone-400 dark:text-stone-500"
        >
          <span>Popular</span>
          <span className="text-stone-300 dark:text-stone-600">/</span>
          {popularByMode[mode].map((loc) => (
            <button
              key={loc}
              onClick={() => handleSearch(loc)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-stone-200 dark:border-stone-700 hover:border-stone-300 dark:hover:border-stone-600 hover:text-stone-600 dark:hover:text-stone-300 hover:bg-white/50 dark:hover:bg-stone-800/50 transition-all duration-300 bg-white/30 dark:bg-stone-800/30"
            >
              {loc}
              <ArrowRight className="w-3 h-3" />
            </button>
          ))}
        </motion.div>
      </div>
    </div>
  );
}