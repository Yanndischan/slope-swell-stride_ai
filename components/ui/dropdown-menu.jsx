import React from "react";
export const DropdownMenu = ({ children }) => <div className="relative inline-block text-left">{children}</div>;
export const DropdownMenuTrigger = ({ children, asChild, ...props }) => <div {...props}>{children}</div>;
export const DropdownMenuContent = ({ children, className = "", ...props }) => (
  <div className={`absolute right-0 z-50 mt-2 min-w-[8rem] overflow-hidden rounded-md border border-slate-800 bg-slate-900 p-1 text-slate-200 shadow-md ${className}`} {...props}>{children}</div>
);
export const DropdownMenuItem = ({ children, className = "", ...props }) => (
  <div className={`relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-slate-800 hover:text-slate-100 ${className}`} {...props}>{children}</div>
);
export const DropdownMenuLabel = ({ children, className = "", ...props }) => <div className={`px-2 py-1.5 text-sm font-semibold text-white ${className}`} {...props}>{children}</div>;
export const DropdownMenuSeparator = ({ className = "", ...props }) => <div className={`-mx-1 my-1 h-px bg-slate-800 ${className}`} {...props} />;
export default DropdownMenu;
