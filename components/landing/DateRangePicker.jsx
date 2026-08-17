import React, { useState } from "react";

export function DateRangePicker({ date, setDate, className = "" }) {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  const handleStartChange = (e) => {
    const val = e.target.value;
    setStart(val);
    if (setDate) setDate({ from: val ? new Date(val) : undefined, to: end ? new Date(end) : undefined });
  };

  const handleEndChange = (e) => {
    const val = e.target.value;
    setEnd(val);
    if (setDate) setDate({ from: start ? new Date(start) : undefined, to: val ? new Date(val) : undefined });
  };

  return (
    <div className={`flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 ${className}`}>
      <input
        type="date"
        value={start}
        onChange={handleStartChange}
        className="bg-transparent text-slate-100 text-xs md:text-sm focus:outline-none cursor-pointer"
        aria-label="Start date"
      />
      <span className="text-slate-500 font-medium">to</span>
      <input
        type="date"
        value={end}
        onChange={handleEndChange}
        className="bg-transparent text-slate-100 text-xs md:text-sm focus:outline-none cursor-pointer"
        aria-label="End date"
      />
    </div>
  );
}

export default DateRangePicker;
