import React from "react";

export const Slider = React.forwardRef(({ className = "", min = 0, max = 100, step = 1, value, defaultValue, onValueChange, ...props }, ref) => {
  const val = Array.isArray(value) ? value[0] : (Array.isArray(defaultValue) ? defaultValue[0] : (value || defaultValue || 0));
  return (
    <input
      type="range"
      ref={ref}
      min={min}
      max={max}
      step={step}
      value={val}
      onChange={(e) => onValueChange && onValueChange([Number(e.target.value)])}
      className={`w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600 ${className}`}
      {...props}
    />
  );
});
Slider.displayName = "Slider";
export default Slider;
