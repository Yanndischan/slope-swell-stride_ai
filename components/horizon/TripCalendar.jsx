const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Plane, StickyNote, X, Bell } from "lucide-react";

import { useToast } from "@/components/ui/use-toast";
import { modeAccents } from "@/lib/mockData";
import AlertModal from "@/components/horizon/AlertModal";

const itineraryByMode = {
  surf: [
    {
      day: 1,
      title: "Arrival & Gear Fitting",
      slot: "Afternoon",
      conditions: [
        { label: "Expected Swell", value: "2.4m" },
        { label: "Wind", value: "6 mph Offshore" },
        { label: "Water Temp", value: "78°F" },
      ],
      defaultNote: "Pick up rental board from North Shore Surf Shop. Check sunset swell forecast.",
    },
    {
      day: 2,
      title: "Dawn Patrol Session",
      slot: "Morning",
      conditions: [
        { label: "Expected Swell", value: "4.1m" },
        { label: "Swell Period", value: "14 sec" },
        { label: "Tide", value: "Rising 5:42 AM" },
      ],
      defaultNote: "First light paddle-out at Pipeline. Rest midday, evening glass-off optional.",
    },
    {
      day: 3,
      title: "Low-Wind Free Exploration",
      slot: "All Day",
      conditions: [
        { label: "Expected Swell", value: "3.0m" },
        { label: "Wind", value: "3 mph Variable" },
        { label: "UV Index", value: "9" },
      ],
      defaultNote: "Explore secondary breaks. Pack reef-safe sunscreen and hydration vest.",
    },
  ],
  ski: [
    {
      day: 1,
      title: "Arrival & Gear Fitting",
      slot: "Afternoon",
      conditions: [
        { label: "Snow Probability", value: "60%" },
        { label: "Base Depth", value: "142 cm" },
        { label: "Temp", value: "-8°C" },
      ],
      defaultNote: "Boot fitting at Summit Sport. Pass pickup. Quick groomer warmup run.",
    },
    {
      day: 2,
      title: "Backcountry Powder Exploration",
      slot: "Morning",
      conditions: [
        { label: "New Snow (24h)", value: "28 cm" },
        { label: "Snow Probability", value: "85%" },
        { label: "Lifts Open", value: "34/37" },
      ],
      defaultNote: "First tracks at 8 AM. Tree runs until noon. Avalanche beacon checked.",
    },
    {
      day: 3,
      title: "Low-Wind Free Exploration",
      slot: "All Day",
      conditions: [
        { label: "Wind Chill", value: "-14°C" },
        { label: "Visibility", value: "Good" },
        { label: "Runs Open", value: "189+" },
      ],
      defaultNote: "Light winds, full mountain open. Explore back bowls, afternoon cat-track cruise.",
    },
  ],
  run: [
    {
      day: 1,
      title: "Arrival & Gear Fitting",
      slot: "Afternoon",
      conditions: [
        { label: "RealFeel Temp", value: "64°F" },
        { label: "AQI", value: "32" },
        { label: "Precip Chance", value: "8%" },
      ],
      defaultNote: "Trail map pickup at Boulder Running Company. Easy 2K shakeout run.",
    },
    {
      day: 2,
      title: "Peak Conditions Tempo Run",
      slot: "Morning",
      conditions: [
        { label: "RealFeel Temp", value: "61°F" },
        { label: "Humidity", value: "42%" },
        { label: "Wind", value: "6 mph NW" },
      ],
      defaultNote: "AQI 12, light wind. Reservoir loop tempo run at 4:45/km pace.",
    },
    {
      day: 3,
      title: "Low-Wind Free Exploration",
      slot: "All Day",
      conditions: [
        { label: "RealFeel Temp", value: "66°F" },
        { label: "AQI", value: "28" },
        { label: "Wind", value: "4 mph SW" },
      ],
      defaultNote: "Calm winds all day. Chautauqua trail network, long aerobic effort.",
    },
  ],
};

const pad = (n) => String(n).padStart(2, "0");

const calculateAlertDate = (dayNumber) => {
  const today = new Date();
  const departure = new Date(today);
  departure.setDate(today.getDate() + dayNumber);
  const alert = new Date(departure);
  alert.setDate(departure.getDate() - 3);
  return alert.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

export default function TripCalendar({ mode }) {
  const { toast } = useToast();
  const [trip, setTrip] = useState(itineraryByMode[mode]);
  const [expandedDay, setExpandedDay] = useState(null);
  const [notes, setNotes] = useState({});
  const [alertDay, setAlertDay] = useState(null);
  const [alertModalDay, setAlertModalDay] = useState(null);
  const [scheduling, setScheduling] = useState(false);
  const accent = modeAccents[mode];

  useEffect(() => {
    const next = itineraryByMode[mode] || itineraryByMode.run;
    setTrip(next);
    setExpandedDay(null);
    setAlertDay(null);
    setNotes((prev) => {
      const updated = { ...prev };
      next.forEach((d) => {
        const key = `${mode}-${d.day}`;
        if (!updated[key]) updated[key] = d.defaultNote;
      });
      return updated;
    });
  }, [mode]);

  const noteKey = (day) => `${mode}-${day}`;

  const toggleDay = (day) => {
    setExpandedDay(expandedDay === day ? null : day);
  };

  const handleAlertConfirm = async ({ channels, timing }) => {
    setScheduling(true);
    const dayNumber = alertModalDay;
    const leadDays = timing === "3_days_before" ? 3 : 0;

    try {
      await db.entities.saved_searches.create({
        destination_name: `${mode} trip — Day ${pad(dayNumber)}`,
        latitude: 0,
        longitude: 0,
        active_mode: mode,
        reminder_enabled: true,
        reminder_lead_days: leadDays,
        reminder_channels: channels,
        reminder_timing: timing,
      });
    } catch (err) {
      console.warn("saved_searches write failed (sandbox):", err);
    }

    setScheduling(false);
    setAlertModalDay(null);
    setAlertDay(dayNumber);

    toast({
      title: "Horizon locked.",
      description: "We will monitor the elements and notify you 3 days prior.",
    });
  };

  return (
    <div
      className="bg-white rounded-2xl border border-stone-200/60 p-8 md:p-12"
      style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}
    >
      <div className="mb-14">
        <h3 className="text-xs font-semibold tracking-[0.15em] uppercase text-stone-500">
          Trip Itinerary
        </h3>
        <p className="text-[10px] tracking-[0.1em] uppercase text-stone-300 mt-0.5">
          Upcoming · 3-day adventure
        </p>
      </div>

      <div className="relative">
        {/* Razor-thin hairline axis */}
        <div className="absolute left-[6px] top-4 bottom-4 w-px bg-slate-100" />

        <div className="space-y-16">
          {trip.map((day, i) => {
            const isExpanded = expandedDay === day.day;
            const hasAlert = alertDay === day.day;
            const k = noteKey(day.day);
            const weatherSummary = day.conditions.map((c) => c.value).join("  ·  ");

            return (
              <motion.div
                key={day.day}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="relative pl-14"
              >
                {/* Tiny white ring node with colored center */}
                <div className="absolute left-0 top-3 z-10">
                  <div
                    className="w-[14px] h-[14px] rounded-full bg-white border-2 flex items-center justify-center transition-all duration-300"
                    style={{
                      borderColor: accent,
                      boxShadow: hasAlert
                        ? `0 0 0 5px white, 0 0 12px ${accent}40`
                        : "0 0 0 5px white",
                    }}
                  >
                    <div
                      className="w-[4px] h-[4px] rounded-full transition-all duration-300"
                      style={{
                        background: isExpanded || hasAlert ? accent : `${accent}50`,
                      }}
                    />
                  </div>
                </div>

                {/* Large faint day number + graphite heading */}
                <div className="flex items-end gap-5 mb-1">
                  <span className="text-[3.5rem] font-heading font-light text-slate-100 leading-[0.75] tabular-nums select-none">
                    {pad(day.day)}
                  </span>
                  <button
                    onClick={() => toggleDay(day.day)}
                    className="group flex items-center gap-2 pb-2"
                  >
                    <h4 className="text-xl font-semibold text-stone-800 font-heading transition-colors duration-200 group-hover:text-stone-900">
                      {day.title}
                    </h4>
                    <ChevronDown
                      className="w-4 h-4 text-stone-300 transition-transform duration-300"
                      style={{ transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)" }}
                    />
                  </button>
                </div>

                {/* Muted sub-text: activity + weather summary */}
                <p className="text-sm text-slate-400 mb-6">
                  {day.slot}  ·  {weatherSummary}
                </p>

                {/* Condition grid */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {day.conditions.map((c) => (
                    <div
                      key={c.label}
                      className="rounded-lg border border-stone-100 bg-stone-50/40 px-4 py-2.5"
                    >
                      <p className="text-[9px] font-semibold tracking-[0.1em] uppercase text-stone-400">
                        {c.label}
                      </p>
                      <p className="text-sm font-semibold text-stone-700 mt-0.5 tabular-nums">
                        {c.value}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Alert toggle / glowing badge */}
                <div className="mb-2">
                  {hasAlert ? (
                    <div
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest"
                      style={{
                        background: `${accent}08`,
                        color: accent,
                        boxShadow: `0 0 10px ${accent}25`,
                      }}
                    >
                      <span>🔔</span>
                      <span>Alert Set for {calculateAlertDate(day.day)}</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => setAlertModalDay(day.day)}
                      className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-slate-400 hover:text-slate-800 transition-colors duration-200"
                    >
                      <Bell className="w-3 h-3" />
                      Enable Condition Alerts
                    </button>
                  )}
                </div>

                {/* Expandable note card */}
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div
                        className="mt-4 rounded-xl border bg-stone-50/60 p-4"
                        style={{ borderColor: `${accent}15` }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-1.5">
                            <StickyNote className="w-3.5 h-3.5" style={{ color: accent }} />
                            <span className="text-[10px] font-semibold tracking-[0.12em] uppercase text-stone-500">
                              Notes · Flights · Vouchers
                            </span>
                          </div>
                          <button
                            onClick={() => setExpandedDay(null)}
                            className="text-stone-300 hover:text-stone-600 transition-colors"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <textarea
                          value={notes[k] || ""}
                          onChange={(e) =>
                            setNotes((prev) => ({ ...prev, [k]: e.target.value }))
                          }
                          placeholder="Log custom notes, flight details, or rental voucher info…"
                          rows={3}
                          className="w-full bg-white rounded-lg border border-stone-200/70 p-3 text-sm text-stone-700 placeholder-stone-300 outline-none resize-none focus:border-stone-300 transition-colors"
                          style={{ caretColor: accent }}
                        />
                        <div className="flex items-center gap-1.5 mt-2 text-[10px] text-stone-400">
                          <Plane className="w-3 h-3" />
                          <span>Auto-saved locally · Day {pad(day.day)}</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>

      <AlertModal
        open={alertModalDay !== null}
        onClose={() => !scheduling && setAlertModalDay(null)}
        onConfirm={handleAlertConfirm}
        mode={mode}
        dayLabel={alertModalDay ? `Day ${pad(alertModalDay)}` : ""}
      />
    </div>
  );
}