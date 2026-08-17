import React from "react";
export const Table = React.forwardRef(({ className = "", ...props }, ref) => <div className="relative w-full overflow-auto"><table ref={ref} className={`w-full caption-bottom text-sm ${className}`} {...props} /></div>);
export const TableHeader = React.forwardRef(({ className = "", ...props }, ref) => <thead ref={ref} className={`[&_tr]:border-b border-slate-800 ${className}`} {...props} />);
export const TableBody = React.forwardRef(({ className = "", ...props }, ref) => <tbody ref={ref} className={`[&_tr:last-child]:border-0 ${className}`} {...props} />);
export const TableRow = React.forwardRef(({ className = "", ...props }, ref) => <tr ref={ref} className={`border-b border-slate-800 transition-colors hover:bg-slate-800/50 ${className}`} {...props} />);
export const TableHead = React.forwardRef(({ className = "", ...props }, ref) => <th ref={ref} className={`h-12 px-4 text-left align-middle font-medium text-slate-400 ${className}`} {...props} />);
export const TableCell = React.forwardRef(({ className = "", ...props }, ref) => <td ref={ref} className={`p-4 align-middle text-slate-200 ${className}`} {...props} />);
export default Table;
