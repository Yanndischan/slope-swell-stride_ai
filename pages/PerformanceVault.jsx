import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Gauge, Mountain, Clock, Sparkles } from "lucide-react";
import { modeAccents } from "@/lib/mockData";

const coachingByMode = {
  surf: [
    "Choppy cross-winds predicted for tomorrow morning. Shorten your board length or wait for the evening glass-off.",
    "Your last 3 sessions show wave count improving by 15%. Consider a larger board for tomorrow's 6ft swell.",
    "Tide is dropping through your planned session window. Expect steeper, faster waves — focus on late drops.",
  ],
  ski: [
    "38cm overnight snowfall with 5 mph winds — first tracks are primed for 8 AM. Prioritize groomer warmup before venturing into the trees.",
    "Your sustained descent speed has increased 8% this week. Consider a shorter turn radius to maintain control in fresh snow.",
    "Wind chill hits -12°C mid-mountain today. Layer up and take shorter laps between warming-hut stops.",
  ],
  run: [
    "Your pace dropped 12% during high relative humidity. Focus on heart-rate zoning rather than raw speed today.",
    "AQI is a pristine 12 right now — ideal window for an easy aerobic 5K along the reservoir loop.",
    "Your 7-day average cadence is up 3 spm. Try a tempo block at 4:45/km tomorrow to lock in the gains.",
  ],
};

const metricsByMode = {
  surf: {
    bestEffort: { value: "8.0 ft", sub: "Largest wave ridden · Oahu, HI" },
    toughestPace: { value: "3.2 hrs", sub: "Longest paddle endurance · Bali" },
    avgDuration: { value: "94 min", sub: "Average session length" },
  },
  ski: {
    bestEffort: { value: "3,287 m", sub: "Max vertical descent · Whistler" },
    toughestPace: { value: "−6°C / 18 mph", sub: "Coldest sustained run · Niseko" },
    avgDuration: { value: "5.2 hrs", sub: "Average time on mountain" },
  },
  run: {
    bestEffort: { value: "22:14", sub: "Fastest 5K · Boulder, CO" },
    toughestPace: { value: "4:52 / km", sub: "Best effort at 7,000ft · Flagstaff" },
    avgDuration: { value: "48 min", sub: "Average run length" },
  },
};

export default function PerformanceVault({ mode }) {
  const accent = modeAccents[mode];
  const metrics = metricsByMode[mode];
  const coaching = useMemo(() => {
    const pool = coachingByMode[mode] || coachingByMode.run;
    return pool[Math.floor(Math.random() * pool.length)];
  }, [mode]);

  const cards = [
    { icon: Gauge, ...metrics.bestEffort, label: "Best Effort" },
    { icon: Mountain, ...metrics.toughestPace, label: "Toughest Conditions Pace" },
    { icon: Clock, ...metrics.avgDuration, label: "Average Duration" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {cards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07, duration: 0.4 }}
            className="bg-white rounded-2xl border border-stone-200/60 p-6"
            style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}
          >
            <div className="flex items-center gap-2 mb-4">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: `${accent}10` }}
              >
                <card.icon className="w-4 h-4" style={{ color: accent }} />
              </div>
              <span className="text-[10px] font-semibold tracking-[0.15em] uppercase text-stone-400">
                {card.label}
              </span>
            </div>
            <p className="text-3xl font-bold tracking-tight text-stone-900 tabular-nums font-heading">
              {card.value}
            </p>
            <p className="text-xs text-stone-400 mt-1.5">{card.sub}</p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.4 }}
        className="bg-white rounded-2xl border border-stone-200/60 p-6"
        style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}
      >
        <div className="flex items-center gap-2.5 mb-4">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: `${accent}12` }}
          >
            <Sparkles className="w-4 h-4" style={{ color: accent }} />
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-[0.15em] uppercase text-stone-500">
              AI Micro-Coaching
            </h3>
            <p className="text-[10px] tracking-[0.1em] uppercase text-stone-300 mt-0.5">
              Personalized for {mode === "surf" ? "Swell" : mode === "ski" ? "Slope" : "Stride"} mode
            </p>
          </div>
        </div>
        <p className="text-sm text-stone-700 leading-relaxed">{coaching}</p>
      </motion.div>
    </div>
  );
}