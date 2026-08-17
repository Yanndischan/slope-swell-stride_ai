import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Compass, ArrowLeft, MapPin, Telescope } from "lucide-react";
import { locations, modeAccents, modeLabels } from "@/lib/mockData";
import ConditionsPanel from "@/components/dashboard/ConditionsPanel";
import ShopsPanel from "@/components/dashboard/ShopsPanel";
import MoodMessageCard from "@/components/dashboard/MoodMessageCard";

export default function Dashboard() {
  const navigate = useNavigate();
  const routerLocation = useLocation();
  const urlParams = new URLSearchParams(window.location.search);
  const locationName = urlParams.get("location") || "";

  // Use simulated locationData from router state if available, else fall back to mockData
  const simulatedData = routerLocation.state?.locationData;
  const locationData = simulatedData || locations[locationName];
  const [moodMessage, setMoodMessage] = useState(routerLocation.state?.moodMessage);

  if (!locationData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-stone-500 text-sm">Location not found</p>
        <button
          onClick={() => navigate("/")}
          className="text-sm text-blue-600 hover:text-blue-500 transition-colors"
        >
          ← Back to search
        </button>
      </div>
    );
  }

  const accent = modeAccents[locationData.mode];

  return (
    <div className="min-h-screen relative">
      <div className="fixed inset-0 pointer-events-none">
        <div
          className="absolute top-0 right-0 w-[700px] h-[500px] rounded-full blur-[200px] opacity-[0.08]"
          style={{ background: `radial-gradient(circle, ${accent}, transparent 70%)` }}
        />
        <div
          className="absolute bottom-0 left-0 w-[500px] h-[400px] rounded-full blur-[160px] opacity-[0.05]"
          style={{ background: `radial-gradient(circle, ${accent}, transparent 70%)` }}
        />
      </div>

      {/* Header */}
      <header
        className="sticky top-0 z-20 border-b border-stone-200"
        style={{ background: "rgba(248,249,251,0.8)", backdropFilter: "blur(24px) saturate(180%)" }}
      >
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-stone-400 hover:text-stone-800 transition-colors text-sm group"
            >
              <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
              <span className="hidden sm:inline">Back</span>
            </button>
            <div className="w-px h-5 bg-stone-200" />
            <div className="flex items-center gap-2.5">
              <Compass className="w-4 h-4" style={{ color: accent }} />
              <span className="text-xs font-bold tracking-[0.22em] uppercase text-stone-600 font-heading">
                Slope, Swell & Stride AI
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span
              className="text-[10px] font-semibold tracking-[0.18em] uppercase px-3.5 py-1.5 rounded-full"
              style={{ color: accent, background: `${accent}10`, border: `1px solid ${accent}25` }}
            >
              {modeLabels[locationData.mode]}
            </span>
            <button
              onClick={() => navigate("/my-horizon")}
              className="flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-semibold tracking-[0.18em] uppercase text-stone-500 hover:text-stone-900 transition-all duration-300 group"
              style={{
                border: "1px solid rgba(0,0,0,0.06)",
                background: "rgba(255,255,255,0.5)",
              }}
            >
              <Telescope className="w-3.5 h-3.5 transition-transform duration-300 group-hover:rotate-12" />
              <span className="hidden sm:inline">My Horizon</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mood message card */}
      {moodMessage && (
        <div className="max-w-7xl mx-auto px-8 pt-8">
          <MoodMessageCard
            message={moodMessage}
            mode={locationData.mode}
            onDismiss={() => setMoodMessage(null)}
          />
        </div>
      )}

      {/* Location title */}
      <div className={`max-w-7xl mx-auto px-8 pb-2 ${moodMessage ? "pt-6" : "pt-10"}`}>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2.5 mb-2"
        >
          <MapPin className="w-4 h-4" style={{ color: accent }} />
          <span className="text-xs font-semibold tracking-[0.18em] uppercase text-stone-400">
            {locationData.tagline}
          </span>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="text-4xl md:text-5xl font-medium tracking-[-0.02em] text-stone-900 font-heading"
        >
          {locationName}
        </motion.h1>
      </div>

      {/* Dual panel */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ConditionsPanel locationData={locationData} />
          <ShopsPanel locationData={locationData} destinationName={locationName} />
        </div>
      </div>
    </div>
  );
}