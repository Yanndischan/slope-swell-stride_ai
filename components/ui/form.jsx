import React, { createContext, useContext } from "react";

const FormFieldContext = createContext({});
const FormItemContext = createContext({});

export const Form = ({ children, ...props }) => <form {...props}>{children}</form>;

export const FormField = ({ name, control, render }) => {
  return (
    <FormFieldContext.Provider value={{ name }}>
      {render({ field: { name, onChange: () => {}, onBlur: () => {}, value: "" }, fieldState: {}, formState: {} })}
    </FormFieldContext.Provider>
  );
};

export const useFormField = () => {
  const fieldContext = useContext(FormFieldContext);
  const itemContext = useContext(FormItemContext);
  return { ...fieldContext, ...itemContext, id: itemContext?.id || "form-item" };
};

export const FormItem = React.forwardRef(({ className = "", ...props }, ref) => {
  const id = React.useId();
  return (
    <FormItemContext.Provider value={{ id }}>
      <div ref={ref} className={`space-y-2 ${className}`} {...props} />
    </FormItemContext.Provider>
  );
});
FormItem.displayName = "FormItem";

export const FormLabel = React.forwardRef(({ className = "", ...props }, ref) => (
  <label ref={ref} className={`text-sm font-medium leading-none text-slate-200 ${className}`} {...props} />
));
FormLabel.displayName = "FormLabel";

export const FormControl = React.forwardRef(({ ...props }, ref) => (
  <div ref={ref} className="mt-2" {...props} />
));
FormControl.displayName = "FormControl";

export const FormDescription = React.forwardRef(({ className = "", ...props }, ref) => (
  <p ref={ref} className={`text-xs text-slate-400 ${className}`} {...props} />
));
FormDescription.displayName = "FormDescription";

export const FormMessage = React.forwardRef(({ className = "", children, ...props }, ref) => (
  <p ref={ref} className={`text-xs font-medium text-red-500 ${className}`} {...props}>{children}</p>
));
FormMessage.displayName = "FormMessage";

export default Form;
