import React from "react";
export const Sheet = ({ children, open }) => open ? <>{children}</> : null;
export const SheetTrigger = ({ children, ...props }) => <div {...props}>{children}</div>;
export const SheetContent = ({ children, className = "", ...props }) => <div className={`fixed inset-y-0 right-0 z-50 w-3/4 max-w-sm bg-slate-900 border-l border-slate-800 p-6 ${className}`} {...props}>{children}</div>;
export const SheetHeader = ({ className = "", ...props }) => <div className={`flex flex-col space-y-2 text-center sm:text-left ${className}`} {...props} />;
export const SheetTitle = ({ className = "", ...props }) => <h2 className={`text-lg font-semibold text-white ${className}`} {...props} />;
export default Sheet;
