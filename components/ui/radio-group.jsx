import React, { createContext, useContext } from "react";

const RadioGroupContext = createContext({});

export const RadioGroup = React.forwardRef(({ className = "", value, onValueChange, defaultValue, ...props }, ref) => {
  const [val, setVal] = React.useState(defaultValue || "");
  const currentValue = value !== undefined ? value : val;
  const handleChange = onValueChange || setVal;

  return (
    <RadioGroupContext.Provider value={{ value: currentValue, onChange: handleChange }}>
      <div ref={ref} className={`grid gap-2 ${className}`} {...props} />
    </RadioGroupContext.Provider>
  );
});
RadioGroup.displayName = "RadioGroup";

export const RadioGroupItem = React.forwardRef(({ className = "", value, ...props }, ref) => {
  const context = useContext(RadioGroupContext);
  const checked = context.value === value;

  return (
    <button
      type="button"
      role="radio"
      aria-checked={checked}
      ref={ref}
      onClick={() => context.onChange && context.onChange(value)}
      className={`aspect-square h-4 w-4 rounded-full border border-slate-600 text-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center ${
        checked ? "border-blue-600 bg-blue-600" : "bg-slate-900"
      } ${className}`}
      {...props}
    >
      {checked && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
    </button>
  );
});
RadioGroupItem.displayName = "RadioGroupItem";

export default RadioGroup;
