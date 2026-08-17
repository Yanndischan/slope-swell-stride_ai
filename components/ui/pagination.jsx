import React from "react";

export const Pagination = ({ className = "", ...props }) => <nav role="navigation" aria-label="pagination" className={`mx-auto flex w-full justify-center ${className}`} {...props} />;
export const PaginationContent = React.forwardRef(({ className = "", ...props }, ref) => <ul ref={ref} className={`flex flex-row items-center gap-1 ${className}`} {...props} />);
PaginationContent.displayName = "PaginationContent";
export const PaginationItem = React.forwardRef(({ className = "", ...props }, ref) => <li ref={ref} className={className} {...props} />);
PaginationItem.displayName = "PaginationItem";
export const PaginationLink = ({ className = "", isActive, ...props }) => (
  <a aria-current={isActive ? "page" : undefined} className={`inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium ${isActive ? "bg-slate-800 text-white" : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"} ${className}`} {...props} />
);
export const PaginationPrevious = ({ className = "", ...props }) => <PaginationLink aria-label="Go to previous page" className={`gap-1 pl-2.5 ${className}`} {...props}><span>Previous</span></PaginationLink>;
export const PaginationNext = ({ className = "", ...props }) => <PaginationLink aria-label="Go to next page" className={`gap-1 pr-2.5 ${className}`} {...props}><span>Next</span></PaginationLink>;
export const PaginationEllipsis = ({ className = "", ...props }) => <span aria-hidden className={`flex h-9 w-9 items-center justify-center text-slate-400 ${className}`} {...props}>...</span>;
export default Pagination;
