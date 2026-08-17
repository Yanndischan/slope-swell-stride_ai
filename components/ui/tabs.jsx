import React, { useState, createContext, useContext } from "react";
const TabsContext = createContext({ activeTab: "", setActiveTab: () => {} });
export const Tabs = ({ defaultValue, value, onValueChange, children, className = "", ...props }) => {
  const [tab, setTab] = useState(defaultValue || "");
  const activeTab = value !== undefined ? value : tab;
  const setActiveTab = onValueChange || setTab;
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={`space-y-4 ${className}`} {...props}>{children}</div>
    </TabsContext.Provider>
  );
};
export const TabsList = ({ className = "", ...props }) => <div className={`inline-flex h-10 items-center justify-center rounded-md bg-slate-800 p-1 text-slate-400 ${className}`} {...props} />;
export const TabsTrigger = ({ value, className = "", children, ...props }) => {
  const { activeTab, setActiveTab } = useContext(TabsContext);
  const isActive = activeTab === value;
  return (
    <button type="button" onClick={() => setActiveTab(value)} className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all ${isActive ? "bg-slate-900 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"} ${className}`} {...props}>
      {children}
    </button>
  );
};
export const TabsContent = ({ value, className = "", children, ...props }) => {
  const { activeTab } = useContext(TabsContext);
  if (activeTab !== value) return null;
  return <div className={`mt-2 ${className}`} {...props}>{children}</div>;
};
export default Tabs;
