import React from "react";
export const Progress = ({ value = 0, className = "", ...props }) => (
  <div className={`relative h-2 w-full overflow-hidden rounded-full bg-slate-800 ${className}`} {...props}>
    <div className="h-full bg-blue-600 transition-all" style={{ width: `${value}%` }} />
  </div>
);
export default Progress;
