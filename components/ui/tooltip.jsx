import React from "react";
export const TooltipProvider = ({ children }) => <>{children}</>;
export const Tooltip = ({ children }) => <div className="relative inline-block">{children}</div>;
export const TooltipTrigger = ({ children, ...props }) => <div {...props}>{children}</div>;
export const TooltipContent = ({ children, className = "", ...props }) => <div className={`absolute z-50 rounded-md bg-slate-800 px-3 py-1.5 text-xs text-white shadow-md ${className}`} {...props}>{children}</div>;
export default Tooltip;
