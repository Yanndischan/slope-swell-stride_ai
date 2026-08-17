import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Compass, Telescope, ChevronLeft } from "lucide-react";
import ModeToggle from "@/components/landing/ModeToggle";
import PerformanceVault from "@/components/horizon/PerformanceVault";
import TrendChart from "@/components/horizon/TrendChart";
import TripCalendar from "@/components/horizon/TripCalendar";
import BookingsLedger from "@/components/horizon/BookingsLedger";
import PastItineraries from "@/components/horizon/PastItineraries";
import { modeAccents, heroText } from "@/lib/mockData";

// Maps internal mode keys to the labels expected by TrendChart's activeMode prop
const trendModeLabel = { surf: 'Swell', ski: 'Slope', run: 'Stride' };

const sectionTitle = {
  surf: { vault: "Swell Logbook", pulse: "Swell Pulse", calendar: "Surf Trip", bookings: "Surf Bookings", past: "Past Surf Trips" },
  ski: { vault: "Slope Logbook", pulse: "Slope Pulse", calendar: "Ski Trip", bookings: "Ski Bookings", past: "Past Ski Trips" },
  run: { vault: "Stride Logbook", pulse: "Stride Pulse", calendar: "Trail Trip", bookings: "Trail Bookings", past: "Past Trail Trips" },
};

export default function MyHorizon() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("surf");
  const accent = modeAccents[mode];

  // Smooth scroll to top on mode change for clean transitions
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [mode]);

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
              className="flex items-center gap-1.5 text-slate-400 hover:text-slate-800 transition-colors duration-200 group"
            >
              <ChevronLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
              <span className="text-xs font-medium uppercase tracking-widest">
                Back to Explore
              </span>
            </button>
            <div className="w-px h-4 bg-stone-200" />
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4" style={{ color: accent }} />
              <span className="text-xs font-bold tracking-[0.22em] uppercase text-stone-600 font-heading">
                Slope, Swell & Stride AI
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-semibold tracking-[0.18em] uppercase text-stone-500"
            style={{ border: "1px solid rgba(0,0,0,0.06)", background: "rgba(255,255,255,0.5)" }}
          >
            <Telescope className="w-3.5 h-3.5" style={{ color: accent }} />
            My Horizon
          </div>
        </div>
      </header>

      <div className="relative max-w-7xl mx-auto px-8 py-12">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-stone-400 mb-3">
            Analytics Workspace
          </p>
          <h1 className="text-4xl md:text-5xl font-medium tracking-[-0.02em] text-stone-900 font-heading mb-6">
            Your <span className="italic" style={{ color: accent }}>Horizon</span>
          </h1>
          <div className="w-fit">
            <ModeToggle mode={mode} onToggle={setMode} />
          </div>
        </motion.div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4 }}
            className="space-y-12"
          >
            {/* Section 1: Performance Vault */}
            <section>
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: accent }} />
                <h2 className="text-xs font-semibold tracking-[0.18em] uppercase text-stone-400">
                  {sectionTitle[mode].vault}
                </h2>
              </div>
              <PerformanceVault mode={mode} />
            </section>

            {/* Section 2: Pulse Trend */}
            <section>
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: accent }} />
                <h2 className="text-xs font-semibold tracking-[0.18em] uppercase text-stone-400">
                  {sectionTitle[mode].pulse}
                </h2>
              </div>
              <TrendChart activeMode={trendModeLabel[mode]} />
            </section>

            {/* Section 3: Trip Calendar */}
            <section>
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: accent }} />
                <h2 className="text-xs font-semibold tracking-[0.18em] uppercase text-stone-400">
                  {sectionTitle[mode].calendar}
                </h2>
              </div>
              <TripCalendar mode={mode} />
            </section>

            {/* Section 4: Bookings & Commission Ledger */}
            <section>
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: accent }} />
                <h2 className="text-xs font-semibold tracking-[0.18em] uppercase text-stone-400">
                  {sectionTitle[mode].bookings}
                </h2>
              </div>
              <BookingsLedger mode={mode} />
            </section>

            {/* Section 5: Past Itineraries */}
            <section>
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: accent }} />
                <h2 className="text-xs font-semibold tracking-[0.18em] uppercase text-stone-400">
                  {sectionTitle[mode].past}
                </h2>
              </div>
              <PastItineraries mode={mode} />
            </section>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}