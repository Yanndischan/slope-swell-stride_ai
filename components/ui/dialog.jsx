import React from "react";
export const Dialog = ({ children, open }) => open !== false ? <>{children}</> : null;
export const DialogTrigger = ({ children, asChild, ...props }) => <div {...props}>{children}</div>;
export const DialogContent = ({ children, className = "", ...props }) => (
  <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 ${className}`} {...props}>
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 max-w-lg w-full text-slate-100">{children}</div>
  </div>
);
export const DialogHeader = ({ className = "", ...props }) => <div className={`flex flex-col space-y-1.5 text-center sm:text-left ${className}`} {...props} />;
export const DialogFooter = ({ className = "", ...props }) => <div className={`flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 ${className}`} {...props} />;
export const DialogTitle = ({ className = "", ...props }) => <h2 className={`text-lg font-semibold leading-none tracking-tight text-white ${className}`} {...props} />;
export const DialogDescription = ({ className = "", ...props }) => <p className={`text-sm text-slate-400 ${className}`} {...props} />;
export default Dialog;
