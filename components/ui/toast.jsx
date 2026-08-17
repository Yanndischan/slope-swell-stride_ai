import React from "react";
export const Toast = ({ children, className = "", ...props }) => <div className={`fixed bottom-4 right-4 z-50 rounded-md bg-slate-800 p-4 text-white shadow-lg ${className}`} {...props}>{children}</div>;
export default Toast;
