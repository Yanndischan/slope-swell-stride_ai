import React from "react";
import { useTheme } from "../../lib/themeContext";

export function ModeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-md border border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700 transition"
      aria-label="Toggle Theme"
      type="button"
    >
      {theme === "light" ? "??" : "??"}
    </button>
  );
}

export default ModeToggle;
