import React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/lib/themeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle dark mode"
      className="flex items-center justify-center w-9 h-9 rounded-full border transition-all duration-300 border-stone-200/60 dark:border-stone-700/60 bg-white/50 dark:bg-stone-800/50 hover:bg-white/80 dark:hover:bg-stone-800 text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100"
    >
      {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
    </button>
  );
}