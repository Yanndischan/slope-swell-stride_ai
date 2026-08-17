import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { modeAccents } from "@/lib/mockData";

const WINDOWS = [
  { label: "7 Days", days: 7 },
  { label: "14 Days", days: 14 },
  { label: "30 Days", days: 30 },
];

const metricsByMode = {
  surf: { key: "waveHeight", label: "Wave Height (m)", color: "#2563eb", baseline: 1.8 },
  ski: { key: "snowDepth", label: "Snow Depth (cm)", color: "#16a34a", baseline: 120 },
  run: { key: "temperature", label: "Temperature (°C)", color: "#E28743", baseline: 12 },
};

const generateDataset = (days, metricKey, baseline) => {
  const data = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const seed = date.getTime() / 86400000;

    let value;
    if (metricKey === "waveHeight") {
      // Rising storm swell peaking at ~4.5m for 30d, scaled for shorter windows
      const swell = 1.2 + Math.abs(Math.sin(seed * 0.6)) * 3.3;
      value = Math.round(swell * 10) / 10;
    } else if (metricKey === "snowDepth") {
      // Gradual accumulation with fluctuations
      const accumulation = baseline + (days - i) * 1.8 + Math.sin(seed * 0.4) * 15;
      value = Math.round(accumulation);
    } else {
      // Dropping temperature trend
      const temp = baseline - (days - i) * 0.3 + Math.sin(seed * 0.5) * 4;
      value = Math.round(temp * 10) / 10;
    }

    data.push({
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      [metricKey]: value,
    });
  }
  return data;
};

export default function PulseTrendChart({ mode }) {
  const [window, setWindow] = useState(7);
  const accent = modeAccents[mode];
  const metric = metricsByMode[mode] || metricsByMode.run;

  const data = useMemo(
    () => generateDataset(window, metric.key, metric.baseline),
    [window, metric.key, metric.baseline]
  );

  return (
    <div className="bg-white rounded-2xl border border-stone-200/60 p-6" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <h3 className="text-sm font-semibold tracking-[0.15em] uppercase text-stone-500">
            The Pulse
          </h3>
          <p className="text-[10px] tracking-[0.1em] uppercase text-stone-300 mt-1">
            {metric.label} · {WINDOWS.find((w) => w.days === window).label}
          </p>
        </div>
        <div className="flex items-center gap-1 p-0.5 rounded-full bg-stone-100">
          {WINDOWS.map((w) => (
            <button
              key={w.days}
              onClick={() => setWindow(w.days)}
              className={`px-4 py-1.5 rounded-full text-[10px] font-semibold tracking-[0.1em] uppercase transition-all duration-300 ${
                window === w.days
                  ? "bg-white text-stone-800 shadow-sm"
                  : "text-stone-400 hover:text-stone-600"
              }`}
            >
              {w.label}
            </button>
          ))}
        </div>
      </div>

      <motion.div
        key={`${mode}-${window}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        style={{ width: "100%", height: 280 }}
      >
        <ResponsiveContainer>
          <LineChart data={data} margin={{ top: 5, right: 10, left: -18, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10, fill: "#a8a29e" }}
              tickLine={false}
              axisLine={false}
              interval={window > 14 ? 4 : window > 7 ? 1 : 0}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "#a8a29e" }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                background: "rgba(255,255,255,0.95)",
                border: "1px solid rgba(0,0,0,0.08)",
                borderRadius: "12px",
                fontSize: "11px",
                boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
              }}
              labelStyle={{ color: "#78716c", fontWeight: 600 }}
            />
            <Line
              type="monotone"
              dataKey={metric.key}
              stroke={metric.color}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: metric.color }}
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
}