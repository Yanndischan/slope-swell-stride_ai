import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Loader2, Check } from "lucide-react";
import { modeAccents } from "@/lib/mockData";

const CHANNELS = [
  { key: "in_app", label: "In-App Push Feed", desc: "Real-time alerts within the workspace" },
  { key: "email", label: "Premium Email Digest", desc: "Curated conditions summary to your inbox" },
];

const TIMINGS = [
  { key: "3_days_before", label: "3 Days Before Departure" },
  { key: "morning_of", label: "Morning of Trip" },
];

export default function AlertModal({ open, onClose, onConfirm, mode, dayLabel }) {
  const accent = modeAccents[mode] || modeAccents.run;
  const [channels, setChannels] = useState(["in_app"]);
  const [timing, setTiming] = useState("3_days_before");
  const [scheduling, setScheduling] = useState(false);

  const toggleChannel = (key) => {
    setChannels((prev) =>
      prev.includes(key) ? prev.filter((c) => c !== key) : [...prev, key]
    );
  };

  const handleConfirm = () => {
    setScheduling(true);
    setTimeout(() => {
      setScheduling(false);
      onConfirm({ channels, timing });
    }, 1000);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-stone-900/30 backdrop-blur-sm"
            onClick={scheduling ? undefined : onClose}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-md bg-white rounded-2xl border border-stone-200/70 p-7 pointer-events-auto"
              style={{ boxShadow: "0 24px 64px rgba(0,0,0,0.12)" }}
            >
              <div className="flex items-center gap-3 mb-1">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: `${accent}10` }}
                >
                  <Bell className="w-5 h-5" style={{ color: accent }} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-stone-900 font-heading">
                    Alert Horizon
                  </h3>
                  <p className="text-[10px] tracking-[0.1em] uppercase text-stone-400">
                    {dayLabel || "Trip itinerary"}
                  </p>
                </div>
              </div>

              <p className="text-sm text-stone-500 leading-relaxed mb-6">
                Receive automated alerts if environmental elements hit peak metrics before your departure.
              </p>

              {/* Channels */}
              <div className="mb-6">
                <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2">
                  Notification Channels
                </p>
                <div className="space-y-2">
                  {CHANNELS.map((ch) => {
                    const active = channels.includes(ch.key);
                    return (
                      <button
                        key={ch.key}
                        onClick={() => toggleChannel(ch.key)}
                        className="w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all duration-200"
                        style={{
                          borderColor: active ? `${accent}40` : "rgba(0,0,0,0.06)",
                          background: active ? `${accent}06` : "white",
                        }}
                      >
                        <div
                          className="w-5 h-5 rounded-md border flex items-center justify-center transition-all duration-200"
                          style={{
                            borderColor: active ? accent : "rgba(0,0,0,0.15)",
                            background: active ? accent : "white",
                          }}
                        >
                          {active && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-stone-800">{ch.label}</p>
                          <p className="text-xs text-stone-400">{ch.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Timing */}
              <div className="mb-7">
                <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2">
                  Alert Timing
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {TIMINGS.map((t) => {
                    const active = timing === t.key;
                    return (
                      <button
                        key={t.key}
                        onClick={() => setTiming(t.key)}
                        className="p-3 rounded-xl border text-center text-xs font-semibold transition-all duration-200"
                        style={{
                          borderColor: active ? `${accent}40` : "rgba(0,0,0,0.06)",
                          background: active ? `${accent}06` : "white",
                          color: active ? accent : "#78716c",
                        }}
                      >
                        {t.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Action button */}
              <button
                onClick={handleConfirm}
                disabled={scheduling || channels.length === 0}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest text-white transition-all duration-300 disabled:opacity-50"
                style={{
                  background: accent,
                  boxShadow: `0 8px 24px ${accent}30`,
                }}
              >
                {scheduling ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Scheduling…
                  </>
                ) : (
                  <>
                    <Bell className="w-4 h-4" />
                    Schedule Alert Horizon
                  </>
                )}
              </button>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}