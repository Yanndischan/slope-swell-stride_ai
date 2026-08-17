import React, { useState } from "react";
import { Calendar } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarUI } from "@/components/ui/calendar";
import { format } from "date-fns";
import { modeAccents } from "@/lib/mockData";

export default function DateRangePicker({ mode }) {
  const [dateRange, setDateRange] = useState({ from: undefined, to: undefined });
  const accent = modeAccents[mode];

  const label = dateRange.from
    ? dateRange.to
      ? `${format(dateRange.from, "MMM d")} – ${format(dateRange.to, "MMM d, yyyy")}`
      : format(dateRange.from, "MMM d, yyyy")
    : "Select trip dates";

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="flex items-center gap-3 px-5 py-3.5 rounded-2xl transition-all duration-400 w-full max-w-[240px] bg-white"
          style={{ border: "1px solid rgba(0,0,0,0.08)", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}
        >
          <Calendar className="w-[18px] h-[18px] shrink-0" style={{ color: accent }} />
          <span className={`text-sm ${dateRange.from ? "text-stone-900" : "text-stone-400"}`}>
            {label}
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto p-0 border-stone-200"
        align="start"
        style={{ background: "rgba(255,255,255,0.97)", boxShadow: "0 16px 48px rgba(0,0,0,0.1)" }}
      >
        <CalendarUI
          mode="range"
          selected={dateRange}
          onSelect={setDateRange}
          numberOfMonths={1}
          className="text-stone-900"
        />
      </PopoverContent>
    </Popover>
  );
}