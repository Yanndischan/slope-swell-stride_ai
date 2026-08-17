const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, Calendar, Clock, StickyNote, Package, Loader2 } from "lucide-react";

import { modeAccents } from "@/lib/mockData";

const slotLabels = {
  morning: "Morning",
  afternoon: "Afternoon",
  evening: "Evening",
};

const modeGear = {
  surf: ["Board", "Wetsuit", "Leash", "Wax", "Fins"],
  ski: ["Skis", "Boots", "Poles", "Helmet", "Goggles"],
  run: ["Trail Shoes", "Hydration Vest", "GPS Watch", "Layer", "Cap"],
};

const fmtDate = (d) => {
  if (!d) return "";
  try {
    return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  } catch {
    return d;
  }
};

export default function PastItineraries({ mode }) {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const accent = modeAccents[mode];

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const data = await db.entities.trip_itineraries.list("-created_date", 50);
        if (active) setTrips(data || []);
      } catch (err) {
        console.error("Failed to load itineraries:", err);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  const tripGroups = Object.values(
    trips.reduce((acc, trip) => {
      const key = trip.destination || "Unknown";
      if (!acc[key]) {
        acc[key] = { destination: key, start_date: trip.start_date, end_date: trip.end_date, days: [] };
      }
      acc[key].days.push(trip);
      if (trip.start_date && (!acc[key].start_date || trip.start_date < acc[key].start_date))
        acc[key].start_date = trip.start_date;
      if (trip.end_date && (!acc[key].end_date || trip.end_date > acc[key].end_date))
        acc[key].end_date = trip.end_date;
      return acc;
    }, {})
  );

  tripGroups.forEach((g) => g.days.sort((a, b) => (a.day_number || 0) - (b.day_number || 0)));

  if (loading) {
    return (
      <div className="rounded-2xl border border-stone-200/60 bg-white p-12 text-center">
        <Loader2 className="w-5 h-5 text-stone-300 animate-spin mx-auto" />
        <p className="text-xs text-stone-400 mt-3">Loading past trips…</p>
      </div>
    );
  }

  if (tripGroups.length === 0) {
    return (
      <div className="rounded-2xl border border-stone-200/60 bg-white p-12 text-center">
        <MapPin className="w-6 h-6 text-stone-300 mx-auto mb-3" />
        <p className="text-sm text-stone-400">No past trips recorded yet.</p>
        <p className="text-xs text-stone-300 mt-1">Your itinerary history will appear here.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {tripGroups.map((trip, i) => (
        <motion.div
          key={trip.destination + i}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08, duration: 0.4 }}
          className="rounded-2xl border border-stone-200/60 bg-white p-6 overflow-hidden"
          style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <MapPin className="w-3.5 h-3.5" style={{ color: accent }} />
                <h3 className="font-heading text-lg font-medium text-stone-800">{trip.destination}</h3>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-stone-400">
                <Calendar className="w-3 h-3" />
                <span>
                  {fmtDate(trip.start_date)} → {fmtDate(trip.end_date)}
                </span>
              </div>
            </div>
            <span
              className="text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-full"
              style={{ background: `${accent}12`, color: accent }}
            >
              {trip.days.length} day{trip.days.length > 1 ? "s" : ""}
            </span>
          </div>

          <div className="space-y-2 mb-4">
            {trip.days.map((day, di) => (
              <div key={di} className="flex items-start gap-2 text-xs">
                <span
                  className="flex items-center justify-center w-5 h-5 rounded-full text-[9px] font-bold shrink-0 mt-0.5"
                  style={{ background: `${accent}12`, color: accent }}
                >
                  {day.day_number}
                </span>
                <div className="flex-1">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3 h-3 text-stone-300" />
                    <span className="text-stone-500">{slotLabels[day.activity_slot] || day.activity_slot}</span>
                  </div>
                  {day.custom_notes && (
                    <div className="flex items-start gap-1.5 mt-1">
                      <StickyNote className="w-3 h-3 text-stone-300 shrink-0 mt-0.5" />
                      <span className="text-stone-400">{day.custom_notes}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-stone-100">
            <div className="flex items-center gap-1.5 mb-2">
              <Package className="w-3 h-3" style={{ color: accent }} />
              <span className="text-[9px] font-semibold tracking-[0.12em] uppercase text-stone-400">Gear Used</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {(modeGear[mode] || []).map((g) => (
                <span key={g} className="text-[10px] px-2 py-0.5 rounded-md text-stone-500" style={{ background: `${accent}08` }}>
                  {g}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}