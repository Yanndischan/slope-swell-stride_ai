import React from "react";
export const Switch = ({ checked, onCheckedChange, className = "", ...props }) => (
  <button type="button" role="switch" aria-checked={checked} onClick={() => onCheckedChange && onCheckedChange(!checked)} className={`inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors ${checked ? "bg-blue-600" : "bg-slate-700"} ${className}`} {...props}>
    <span className={`pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg transition-transform ${checked ? "translate-x-5" : "translate-x-0"}`} />
  </button>
);
export default Switch;
