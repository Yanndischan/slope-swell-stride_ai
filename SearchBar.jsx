import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin } from "lucide-react";
import { destinationHubs, modeAccents, searchPlaceholders } from "@/lib/mockData";

export default function SearchBar({ mode, onSearch }) {
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [focused, setFocused] = useState(false);
  const wrapperRef = useRef(null);
  const accent = modeAccents[mode];

  const filtered = destinationHubs.filter(
    (hub) => hub.name.toLowerCase().includes(query.toLowerCase()) && hub.mode === mode
  );

  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowSuggestions(false);
        setFocused(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelect = (name) => {
    setQuery(name);
    setShowSuggestions(false);
    setFocused(false);
    onSearch(name);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (filtered.length > 0) handleSelect(filtered[0]);
  };

  return (
    <div ref={wrapperRef} className="relative w-full max-w-md">
      <form onSubmit={handleSubmit}>
        <div
          className="flex items-center gap-3 pl-5 pr-4 py-3.5 rounded-2xl transition-all duration-400 bg-white"
          style={{
            border: `1px solid ${focused ? accent + "50" : "rgba(0,0,0,0.08)"}`,
            boxShadow: focused ? `0 0 0 3px ${accent}12, 0 8px 32px rgba(0,0,0,0.06)` : "0 2px 12px rgba(0,0,0,0.04)",
          }}
        >
          <Search className="w-[18px] h-[18px] shrink-0 transition-colors duration-300" style={{ color: focused ? accent : "rgba(0,0,0,0.3)" }} />
          <input
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setShowSuggestions(true); }}
            onFocus={() => { setShowSuggestions(true); setFocused(true); }}
            placeholder={searchPlaceholders[mode]}
            className="flex-1 bg-transparent text-stone-900 placeholder-stone-400 text-sm outline-none"
          />
          {query && (
            <button type="button" onClick={() => setQuery("")} className="text-stone-300 hover:text-stone-500 transition-colors text-xs">
              ✕
            </button>
          )}
        </div>
      </form>

      <AnimatePresence>
        {showSuggestions && query.length > 0 && filtered.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className="absolute z-50 mt-2 w-full rounded-xl overflow-hidden bg-white"
            style={{ border: "1px solid rgba(0,0,0,0.08)", boxShadow: "0 16px 48px rgba(0,0,0,0.1)" }}
          >
            {filtered.map((hub, i) => (
              <button
                key={hub.name}
                onClick={() => handleSelect(hub.name)}
                className="flex items-center gap-3 w-full px-5 py-3 text-left hover:bg-stone-50 transition-colors"
                style={{ borderTop: i > 0 ? "1px solid rgba(0,0,0,0.04)" : "none" }}
              >
                <MapPin className="w-4 h-4 shrink-0" style={{ color: accent }} />
                <div>
                  <p className="text-sm text-stone-900 font-medium">{hub.name}</p>
                  <p className="text-xs text-stone-400">{hub.tagline}</p>
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}