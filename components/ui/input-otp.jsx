import React from "react";

export const InputOTP = React.forwardRef(({ className = "", maxLength = 6, children, ...props }, ref) => (
  <div ref={ref} className={`flex items-center gap-2 ${className}`} {...props}>
    {children}
  </div>
));
InputOTP.displayName = "InputOTP";

export const InputOTPGroup = React.forwardRef(({ className = "", ...props }, ref) => (
  <div ref={ref} className={`flex items-center ${className}`} {...props} />
));
InputOTPGroup.displayName = "InputOTPGroup";

export const InputOTPSlot = React.forwardRef(({ index, char, hasFakeCaret, isActive, className = "", ...props }, ref) => (
  <div
    ref={ref}
    className={`relative flex h-10 w-10 items-center justify-center border-y border-r first:border-l first:rounded-l-md last:rounded-r-md border-slate-700 bg-slate-900 text-sm text-slate-100 transition-all ${
      isActive ? "z-10 ring-2 ring-blue-500" : ""
    } ${className}`}
    {...props}
  >
    {char}
    {hasFakeCaret && (
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-4 w-px animate-caret-blink bg-slate-100 duration-1000" />
      </div>
    )}
  </div>
));
InputOTPSlot.displayName = "InputOTPSlot";

export const InputOTPSeparator = React.forwardRef(({ ...props }, ref) => (
  <div ref={ref} role="separator" {...props}>
    -
  </div>
));
InputOTPSeparator.displayName = "InputOTPSeparator";

export default InputOTP;
