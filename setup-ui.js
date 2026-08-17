import fs from 'fs';
import path from 'path';

// Helper to create directory if missing
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

ensureDir('components/ui');
ensureDir('components/landing');
ensureDir('lib');
ensureDir('pages');

const files = {
  // lib/utils.js
  'lib/utils.js': `
export function cn(...inputs) {
  return inputs.flat().filter(Boolean).join(" ");
}
`,

  // input-otp
  'components/ui/input-otp.jsx': `
import React from "react";
export const InputOTP = React.forwardRef(({ className = "", maxLength = 6, children, ...props }, ref) => (
  <div ref={ref} className={\`flex items-center gap-2 \${className}\`} {...props}>{children}</div>
));
InputOTP.displayName = "InputOTP";
export const InputOTPGroup = React.forwardRef(({ className = "", ...props }, ref) => (
  <div ref={ref} className={\`flex items-center \${className}\`} {...props} />
));
InputOTPGroup.displayName = "InputOTPGroup";
export const InputOTPSlot = React.forwardRef(({ index, char, hasFakeCaret, isActive, className = "", ...props }, ref) => (
  <div ref={ref} className={\`relative flex h-10 w-10 items-center justify-center border-y border-r first:border-l first:rounded-l-md last:rounded-r-md border-slate-700 bg-slate-900 text-sm text-slate-100 \${isActive ? "ring-2 ring-blue-500" : ""} \${className}\`} {...props}>
    {char}
  </div>
));
InputOTPSlot.displayName = "InputOTPSlot";
export const InputOTPSeparator = React.forwardRef((props, ref) => <div ref={ref} role="separator" {...props}>-</div>);
InputOTPSeparator.displayName = "InputOTPSeparator";
export default InputOTP;
`,

  // form
  'components/ui/form.jsx': `
import React, { createContext, useContext } from "react";
const FormFieldContext = createContext({});
const FormItemContext = createContext({});
export const Form = ({ children, ...props }) => <form {...props}>{children}</form>;
export const FormField = ({ name, control, render }) => (
  <FormFieldContext.Provider value={{ name }}>
    {render({ field: { name, onChange: () => {}, onBlur: () => {}, value: "" }, fieldState: {}, formState: {} })}
  </FormFieldContext.Provider>
);
export const useFormField = () => useContext(FormFieldContext);
export const FormItem = React.forwardRef(({ className = "", ...props }, ref) => (
  <div ref={ref} className={\`space-y-2 \${className}\`} {...props} />
));
FormItem.displayName = "FormItem";
export const FormLabel = React.forwardRef(({ className = "", ...props }, ref) => (
  <label ref={ref} className={\`text-sm font-medium leading-none text-slate-200 \${className}\`} {...props} />
));
FormLabel.displayName = "FormLabel";
export const FormControl = React.forwardRef((props, ref) => <div ref={ref} className="mt-2" {...props} />);
FormControl.displayName = "FormControl";
export const FormDescription = React.forwardRef(({ className = "", ...props }, ref) => (
  <p ref={ref} className={\`text-xs text-slate-400 \${className}\`} {...props} />
));
FormDescription.displayName = "FormDescription";
export const FormMessage = React.forwardRef(({ className = "", children, ...props }, ref) => (
  <p ref={ref} className={\`text-xs font-medium text-red-500 \${className}\`} {...props}>{children}</p>
));
FormMessage.displayName = "FormMessage";
export default Form;
`,

  // radio-group
  'components/ui/radio-group.jsx': `
import React, { createContext, useContext, useState } from "react";
const RadioGroupContext = createContext({});
export const RadioGroup = React.forwardRef(({ className = "", value, onValueChange, defaultValue, ...props }, ref) => {
  const [val, setVal] = useState(defaultValue || "");
  const currentValue = value !== undefined ? value : val;
  return (
    <RadioGroupContext.Provider value={{ value: currentValue, onChange: onValueChange || setVal }}>
      <div ref={ref} className={\`grid gap-2 \${className}\`} {...props} />
    </RadioGroupContext.Provider>
  );
});
RadioGroup.displayName = "RadioGroup";
export const RadioGroupItem = React.forwardRef(({ className = "", value, ...props }, ref) => {
  const ctx = useContext(RadioGroupContext);
  const checked = ctx.value === value;
  return (
    <button type="button" role="radio" aria-checked={checked} ref={ref} onClick={() => ctx.onChange && ctx.onChange(value)} className={\`aspect-square h-4 w-4 rounded-full border border-slate-600 \${checked ? "bg-blue-600 border-blue-600" : "bg-slate-900"} \${className}\`} {...props} />
  );
});
RadioGroupItem.displayName = "RadioGroupItem";
export default RadioGroup;
`,

  // slider
  'components/ui/slider.jsx': `
import React from "react";
export const Slider = React.forwardRef(({ className = "", min = 0, max = 100, step = 1, value, defaultValue, onValueChange, ...props }, ref) => {
  const val = Array.isArray(value) ? value[0] : (Array.isArray(defaultValue) ? defaultValue[0] : (value || defaultValue || 0));
  return (
    <input type="range" ref={ref} min={min} max={max} step={step} value={val} onChange={(e) => onValueChange && onValueChange([Number(e.target.value)])} className={\`w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600 \${className}\`} {...props} />
  );
});
Slider.displayName = "Slider";
export default Slider;
`,

  // toggle & toggle-group
  'components/ui/toggle.jsx': `
import React from "react";
export const Toggle = React.forwardRef(({ className = "", pressed, ...props }, ref) => (
  <button type="button" ref={ref} aria-pressed={pressed} className={\`inline-flex items-center justify-center rounded-md text-sm px-3 py-2 \${pressed ? "bg-slate-800 text-white" : "bg-transparent text-slate-400"} \${className}\`} {...props} />
));
Toggle.displayName = "Toggle";
export default Toggle;
`,

  'components/ui/toggle-group.jsx': `
import React from "react";
export const ToggleGroup = ({ children, className = "", ...props }) => <div className={\`inline-flex gap-1 bg-slate-900 p-1 rounded-md \${className}\`} {...props}>{children}</div>;
export const ToggleGroupItem = ({ children, className = "", ...props }) => <button type="button" className={\`px-3 py-1.5 text-sm rounded-sm text-slate-400 hover:text-slate-100 \${className}\`} {...props}>{children}</button>;
export default ToggleGroup;
`,

  // collapsible & command
  'components/ui/collapsible.jsx': `
import React from "react";
export const Collapsible = ({ children, ...props }) => <div {...props}>{children}</div>;
export const CollapsibleTrigger = ({ children, ...props }) => <div {...props}>{children}</div>;
export const CollapsibleContent = ({ children, ...props }) => <div {...props}>{children}</div>;
export default Collapsible;
`,

  'components/ui/command.jsx': `
import React from "react";
export const Command = ({ className = "", ...props }) => <div className={\`flex h-full w-full flex-col bg-slate-900 text-slate-100 rounded-md \${className}\`} {...props} />;
export const CommandDialog = ({ children }) => <div>{children}</div>;
export const CommandInput = React.forwardRef(({ className = "", ...props }, ref) => <input ref={ref} className={\`flex h-11 w-full bg-transparent px-3 text-sm text-slate-100 outline-none placeholder:text-slate-500 \${className}\`} {...props} />);
CommandInput.displayName = "CommandInput";
export const CommandList = ({ className = "", ...props }) => <div className={\`max-h-[300px] overflow-y-auto \${className}\`} {...props} />;
export const CommandEmpty = (props) => <div className="py-6 text-center text-sm text-slate-400" {...props} />;
export const CommandGroup = ({ className = "", ...props }) => <div className={\`p-1 text-slate-100 \${className}\`} {...props} />;
export const CommandItem = ({ className = "", ...props }) => <div className={\`flex cursor-pointer items-center rounded-sm px-2 py-1.5 text-sm hover:bg-slate-800 \${className}\`} {...props} />;
export const CommandSeparator = ({ className = "", ...props }) => <div className={\`h-px bg-slate-800 \${className}\`} {...props} />;
export default Command;
`,

  // sonner / aspect-ratio / pagination
  'components/ui/sonner.jsx': `export function Toaster() { return null; } export default Toaster;`,
  'components/ui/aspect-ratio.jsx': `
import React from "react";
export const AspectRatio = ({ ratio = 16 / 9, children, style = {}, ...props }) => (
  <div style={{ position: "relative", width: "100%", paddingBottom: \`\${(1 / ratio) * 100}%\`, ...style }} {...props}>
    <div style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0 }}>{children}</div>
  </div>
);
export default AspectRatio;
`,
  'components/ui/pagination.jsx': `
import React from "react";
export const Pagination = ({ className = "", ...props }) => <nav role="navigation" aria-label="pagination" className={\`mx-auto flex w-full justify-center \${className}\`} {...props} />;
export const PaginationContent = ({ className = "", ...props }) => <ul className={\`flex flex-row items-center gap-1 \${className}\`} {...props} />;
export const PaginationItem = (props) => <li {...props} />;
export const PaginationLink = ({ className = "", isActive, ...props }) => <a className={\`px-3 py-2 text-sm rounded-md \${isActive ? "bg-slate-800 text-white" : "text-slate-400"} \${className}\`} {...props} />;
export const PaginationPrevious = (props) => <PaginationLink {...props}>Previous</PaginationLink>;
export const PaginationNext = (props) => <PaginationLink {...props}>Next</PaginationLink>;
export const PaginationEllipsis = (props) => <span className="px-2 text-slate-400" {...props}>...</span>;
export default Pagination;
`
};

for (const [filePath, content] of Object.entries(files)) {
  const fullPath = path.resolve(filePath);
  if (!fs.existsSync(fullPath)) {
    fs.writeFileSync(fullPath, content.trim());
    console.log('Created:', filePath);
  }
}

console.log('Done: All UI components are ready.');