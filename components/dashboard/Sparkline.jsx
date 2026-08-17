import React from "react";

export default function Sparkline({ data, color, width = 56, height = 18 }) {
  if (!data || data.length < 2) return null;

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const stepX = width / (data.length - 1);

  const coords = data.map((v, i) => ({
    x: i * stepX,
    y: height - ((v - min) / range) * (height - 4) - 2,
  }));

  const linePath = `M ${coords.map((c) => `${c.x},${c.y}`).join(" L ")}`;
  const areaPath = `${linePath} L ${width},${height} L 0,${height} Z`;
  const last = coords[coords.length - 1];

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
      <path d={areaPath} fill={color} opacity="0.06" />
      <path
        d={linePath}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.65"
      />
      <circle cx={last.x} cy={last.y} r="1.5" fill={color} />
    </svg>
  );
}