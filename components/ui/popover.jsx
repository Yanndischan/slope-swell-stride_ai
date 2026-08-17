import React from "react";
export const Popover = ({ children }) => <div className="relative inline-block">{children}</div>;
export const PopoverTrigger = ({ children, ...props }) => <div {...props}>{children}</div>;
export const PopoverContent = ({ children, className = "", ...props }) => <div className={`absolute z-50 mt-2 rounded-md border border-slate-800 bg-slate-900 p-4 shadow-md ${className}`} {...props}>{children}</div>;
export default Popover;
