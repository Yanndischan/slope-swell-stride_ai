import React, { useState } from "react";

export function SearchBar({ onSearch, placeholder = "Search slopes, swells, trails...", className = "" }) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className={`w-full max-w-2xl mx-auto flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-xl p-2 shadow-lg ${className}`}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent px-4 py-2 text-slate-100 placeholder:text-slate-500 focus:outline-none text-sm md:text-base"
      />
      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-lg text-sm transition shrink-0"
      >
        Search
      </button>
    </form>
  );
}

export default SearchBar;