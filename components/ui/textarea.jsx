import React from "react";
export const Textarea = React.forwardRef(({ className = "", ...props }, ref) => (
  <textarea ref={ref} className={`flex min-h-[80px] w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 ${className}`} {...props} />
));
Textarea.displayName = "Textarea";
export default Textarea;
