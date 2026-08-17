import React, { useState } from "react";

export const Toggle = React.forwardRef(({ className = "", pressed, onPressedChange, defaultPressed = false, ...props }, ref) => {
  const [isPressed, setIsPressed] = useState(defaultPressed);
  const state = pressed !== undefined ? pressed : isPressed;
  const toggle = () => {
    if (onPressedChange) onPressedChange(!state);
    else setIsPressed(!state);
  };

  return (
    <button
      type="button"
      ref={ref}
      aria-pressed={state}
      onClick={toggle}
      className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-slate-800 px-3 py-2 ${
        state ? "bg-slate-800 text-white" : "bg-transparent text-slate-400"
      } ${className}`}
      {...props}
    />
  );
});
Toggle.displayName = "Toggle";
export const toggleVariants = () => "";
export default Toggle;
