import React from "react";
export const Select = ({ children, ...props }) => <div className="relative inline-block w-full" {...props}>{children}</div>;
export const SelectTrigger = ({ className = "", children, ...props }) => <div className={`flex h-10 w-full items-center justify-between rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 ${className}`} {...props}>{children}</div>;
export const SelectValue = ({ placeholder, children, ...props }) => <span>{children || placeholder}</span>;
export const SelectContent = ({ className = "", children, ...props }) => <div className={`relative z-50 min-w-[8rem] overflow-hidden rounded-md border border-slate-800 bg-slate-900 text-slate-100 shadow-md ${className}`} {...props}>{children}</div>;
export const SelectItem = ({ value, children, className = "", ...props }) => <div className={`relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 px-3 text-sm outline-none hover:bg-slate-800 ${className}`} {...props}>{children}</div>;
export default Select;
