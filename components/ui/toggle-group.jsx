import React, { createContext, useContext, useState } from "react";

const ToggleGroupContext = createContext({});

export const ToggleGroup = React.forwardRef(({ className = "", type = "single", value, onValueChange, defaultValue, children, ...props }, ref) => {
  const [val, setVal] = useState(defaultValue || (type === "multiple" ? [] : ""));
  const currentValue = value !== undefined ? value : val;
  const handleChange = (itemVal) => {
    if (type === "single") {
      const next = currentValue === itemVal ? "" : itemVal;
      if (onValueChange) onValueChange(next);
      else setVal(next);
    } else {
      const arr = Array.isArray(currentValue) ? currentValue : [];
      const next = arr.includes(itemVal) ? arr.filter((v) => v !== itemVal) : [...arr, itemVal];
      if (onValueChange) onValueChange(next);
      else setVal(next);
    }
  };

  return (
    <ToggleGroupContext.Provider value={{ value: currentValue, type, handleChange }}>
      <div ref={ref} className={`inline-flex items-center justify-center gap-1 rounded-md bg-slate-900 p-1 ${className}`} {...props}>
        {children}
      </div>
    </ToggleGroupContext.Provider>
  );
});
ToggleGroup.displayName = "ToggleGroup";

export const ToggleGroupItem = React.forwardRef(({ className = "", value, children, ...props }, ref) => {
  const context = useContext(ToggleGroupContext);
  const isSelected = context.type === "multiple" 
    ? (Array.isArray(context.value) && context.value.includes(value))
    : context.value === value;

  return (
    <button
      type="button"
      ref={ref}
      onClick={() => context.handleChange(value)}
      className={`inline-flex items-center justify-center rounded-sm px-3 py-1.5 text-sm font-medium transition-all ${
        isSelected ? "bg-slate-800 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
});
ToggleGroupItem.displayName = "ToggleGroupItem";
export default ToggleGroup;
