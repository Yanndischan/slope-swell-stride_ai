import React, { useState } from 'react';

// Structured realistic mock datasets for each sport & timeframe
const dataset = {
  Swell: { // Wave heights in meters
    '7 Days': [1.8, 2.1, 1.5, 3.2, 4.1, 2.8, 3.5],
    '14 Days': [1.8, 2.1, 1.5, 3.2, 4.1, 2.8, 3.5, 3.0, 2.4, 1.9, 2.2, 3.8, 4.5, 3.9],
    '30 Days': [1.8, 2.1, 1.5, 3.2, 4.1, 2.8, 3.5, 3.0, 2.4, 1.9, 2.2, 3.8, 4.5, 3.9, 3.2, 2.7, 2.1, 1.8, 2.5, 3.1, 3.6, 4.0, 4.2, 3.5, 2.9, 2.3, 2.0, 2.6, 3.3, 3.8]
  },
  Slope: { // Snow depth accumulation in inches
    '7 Days': [42, 44, 43, 48, 52, 51, 55],
    '14 Days': [42, 44, 43, 48, 52, 51, 55, 54, 53, 56, 58, 62, 60, 64],
    '30 Days': [42, 44, 43, 48, 52, 51, 55, 54, 53, 56, 58, 62, 60, 64, 63, 62, 65, 68, 70, 69, 68, 72, 75, 74, 73, 76, 79, 82, 80, 85]
  },
  Stride: { // Pace performance tracking in min/mile
    '7 Days': [7.5, 7.3, 7.8, 7.1, 6.9, 7.2, 6.8],
    '14 Days': [7.5, 7.3, 7.8, 7.1, 6.9, 7.2, 6.8, 7.0, 7.4, 7.2, 6.7, 6.5, 6.9, 6.6],
    '30 Days': [7.5, 7.3, 7.8, 7.1, 6.9, 7.2, 6.8, 7.0, 7.4, 7.2, 6.7, 6.5, 6.9, 6.6, 6.8, 7.1, 7.3, 7.0, 6.5, 6.3, 6.4, 6.2, 6.6, 6.5, 6.1, 5.9, 6.2, 6.0, 5.8, 5.7]
  }
};

export default function TrendChart({ activeMode = 'Swell' }) {
  const [timeframe, setTimeframe] = useState('14 Days');
  const [hoveredPoint, setHoveredPoint] = useState(null);

  const data = dataset[activeMode][timeframe];
  
  // Dimensions for the SVG viewBox coordinate workspace
  const width = 600;
  const height = 220;
  const padding = 30;

  const maxVal = Math.max(...data) * 1.1;
  const minVal = Math.min(...data) * 0.9;
  const valRange = maxVal - minVal;

  // Compute absolute SVG pixel coordinates for every data point mapping
  const points = data.map((val, index) => {
    const x = padding + (index / (data.length - 1)) * (width - padding * 2);
    const y = height - padding - ((val - minVal) / valRange) * (height - padding * 2);
    return { x, y, val, index };
  });

  // Compile the SVG Path string line connection commands
  const linePath = points.reduce((acc, p, i) => {
    return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, '');

  // Compile closed bounding loop path string to project the color shading area below the line
  const areaPath = points.length > 0 
    ? `${linePath} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z` 
    : '';

  // Get specific accent highlights bound to the current active activity mode profile
  const getAccentClass = () => {
    if (activeMode === 'Swell') return { stroke: '#2563eb', fill: 'url(#gradient-swell)', text: 'text-blue-600', bg: 'bg-blue-600' };
    if (activeMode === 'Slope') return { stroke: '#16a34a', fill: 'url(#gradient-slope)', text: 'text-green-600', bg: 'bg-green-600' };
    return { stroke: '#e28743', fill: 'url(#gradient-stride)', text: 'text-amber-600', bg: 'bg-amber-500' };
  };

  const accent = getAccentClass();

  return (
    <div className="w-full bg-white border border-slate-100 rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.015)] backdrop-blur-sm transition-all duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Condition Trends</h3>
          <p className="text-lg font-medium text-slate-800 mt-0.5">Historical Weather Window</p>
        </div>
        
        {/* Modern Compact Timeframe Selector pills */}
        <div className="inline-flex bg-slate-50 p-1 rounded-xl border border-slate-100 self-start sm:self-auto">
          {['7 Days', '14 Days', '30 Days'].map((t) => (
            <button
              key={t}
              onClick={() => { setTimeframe(t); setHoveredPoint(null); }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg tracking-wide transition-all duration-200 ${
                timeframe === t 
                  ? 'bg-white text-slate-800 shadow-sm border border-slate-100/50' 
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Canvas Workspace */}
      <div className="relative w-full overflow-visible">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
          <defs>
            {/* Ambient Linear Shading Gradients mapped dynamically per activity */}
            <linearGradient id="gradient-swell" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2563eb" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#2563eb" stopOpacity="0.00" />
            </linearGradient>
            <linearGradient id="gradient-slope" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#16a34a" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#16a34a" stopOpacity="0.00" />
            </linearGradient>
            <linearGradient id="gradient-stride" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#e28743" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#e28743" stopOpacity="0.00" />
            </linearGradient>
          </defs>

          {/* Minimalist Background Grid Rules */}
          <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="#f1f5f9" strokeDasharray="4 4" />
          <line x1={padding} y1={(height) / 2} x2={width - padding} y2={(height) / 2} stroke="#f1f5f9" strokeDasharray="4 4" />
          <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#e2e8f0" strokeWidth="1" />

          {/* Animated Ambient Shading Area Underneath Path Line */}
          <path d={areaPath} fill={accent.fill} className="transition-all duration-500 ease-in-out" />

          {/* Core Dynamic Vector Chart Path Line */}
          <path
            d={linePath}
            fill="none"
            stroke={accent.stroke}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-all duration-500 ease-in-out"
          />

          {/* Dynamic Interactive Hotspot Interaction Circles */}
          {points.map((p) => (
            <g key={p.index} className="cursor-pointer">
              {/* Invisible large outer circle to catch finger/mouse interactions easily */}
              <circle
                cx={p.x}
                cy={p.y}
                r="12"
                fill="transparent"
                onMouseEnter={() => setHoveredPoint(p)}
                onMouseLeave={() => setHoveredPoint(null)}
              />
              {/* Visible clean vector anchor dot */}
              <circle
                cx={p.x}
                cy={p.y}
                r={hoveredPoint?.index === p.index ? "5" : "2"}
                fill={hoveredPoint?.index === p.index ? "#ffffff" : accent.stroke}
                stroke={accent.stroke}
                strokeWidth={hoveredPoint?.index === p.index ? "3" : "0"}
                className="transition-all duration-200"
              />
            </g>
          ))}
        </svg>

        {/* Floating Minimal HUD Micro-Tooltip Overlay */}
        {hoveredPoint && (
          <div
            className="absolute z-10 bg-slate-900 text-white text-[10px] font-mono font-bold tracking-wider px-2 py-1 rounded-md shadow-md pointer-events-none -translate-x-1/2 -translate-y-8 transition-all duration-150"
            style={{
              left: `${(hoveredPoint.x / width) * 100}%`,
              top: `${(hoveredPoint.y / height) * 100}%`,
            }}
          >
            {hoveredPoint.val.toFixed(1)}
            {activeMode === 'Swell' ? 'm' : activeMode === 'Slope' ? '"' : ' min/m'}
          </div>
        )}
      </div>

      {/* Dynamic Summary Meta Info Block */}
      <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-50 text-slate-500">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest block text-slate-400">Peak Recording</span>
          <span className="text-sm font-semibold text-slate-700 font-mono">
            {maxVal.toFixed(1)}{activeMode === 'Swell' ? 'm Swell' : activeMode === 'Slope' ? '" Base' : ' min/m Pace'}
          </span>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-bold uppercase tracking-widest block text-slate-400">Horizon Outlook</span>
          <span className={`text-xs font-bold ${accent.text}`}>
            {activeMode === 'Swell' ? '📈 Rising Forecast' : activeMode === 'Slope' ? '❄️ Stable Pack' : '🏃 Ideal Window'}
          </span>
        </div>
      </div>
    </div>
  );
}