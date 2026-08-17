import React from "react";

export const NavigationMenu = ({ children, className = "", ...props }) => <nav className={`relative z-10 flex max-w-max flex-1 items-center justify-center ${className}`} {...props}>{children}</nav>;
export const NavigationMenuList = ({ className = "", ...props }) => <ul className={`group flex flex-1 list-none items-center justify-center space-x-1 ${className}`} {...props} />;
export const NavigationMenuItem = ({ ...props }) => <li {...props} />;
export const NavigationMenuTrigger = ({ children, className = "", ...props }) => <button type="button" className={`group inline-flex h-10 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-slate-800 hover:text-slate-100 ${className}`} {...props}>{children}</button>;
export const NavigationMenuContent = ({ className = "", ...props }) => <div className={`absolute left-0 top-0 w-full md:w-auto ${className}`} {...props} />;
export const NavigationMenuLink = ({ className = "", ...props }) => <a className={`block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-slate-800 hover:text-slate-100 ${className}`} {...props} />;
export const NavigationMenuIndicator = ({ className = "", ...props }) => <div className={`top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden ${className}`} {...props} />;
export const NavigationMenuViewport = ({ className = "", ...props }) => <div className={`relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-md border border-slate-800 bg-slate-900 text-slate-100 shadow-lg ${className}`} {...props} />;
export const navigationMenuTriggerStyle = () => "inline-flex items-center justify-center rounded-md text-sm font-medium px-4 py-2";
export default NavigationMenu;
