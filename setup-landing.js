import fs from 'fs';
import path from 'path';

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

ensureDir('components/landing');

// Check if SearchBar exists in root or components/ and move it
const possibleLocations = ['SearchBar.jsx', 'components/SearchBar.jsx'];
let moved = false;

for (const loc of possibleLocations) {
  if (fs.existsSync(loc)) {
    fs.renameSync(loc, 'components/landing/SearchBar.jsx');
    console.log(`Moved ${loc} -> components/landing/SearchBar.jsx`);
    moved = true;
    break;
  }
}

// If SearchBar does not exist anywhere, create the fallback component
if (!moved && !fs.existsSync('components/landing/SearchBar.jsx')) {
  const searchBarContent = `
import React, { useState } from "react";

export function SearchBar({ onSearch, placeholder = "Search slopes, swells, trails...", className = "" }) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className={\`w-full max-w-2xl mx-auto flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-xl p-2 shadow-lg \${className}\`}>
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
`;
  fs.writeFileSync('components/landing/SearchBar.jsx', searchBarContent.trim());
  console.log('Created components/landing/SearchBar.jsx');
}

// Generate other standard landing fallbacks if Home.jsx needs them
const landingComponents = {
  'Hero.jsx': `
import React from "react";
export function Hero({ title = "Discover Your Next Adventure", subtitle = "Find slopes, swells, and strides near you.", children }) {
  return (
    <section className="py-16 md:py-24 text-center px-4">
      <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-4">{title}</h1>
      <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-8">{subtitle}</p>
      {children}
    </section>
  );
}
export default Hero;
`,
  'Navbar.jsx': `
import React from "react";
import { Link } from "react-router-dom";
export function Navbar() {
  return (
    <header className="w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur py-4 px-6 flex items-center justify-between">
      <Link to="/" className="text-xl font-bold text-white tracking-tight">Slope Swell Stride</Link>
    </header>
  );
}
export default Navbar;
`,
  'Footer.jsx': `
import React from "react";
export function Footer() {
  return (
    <footer className="w-full border-t border-slate-800 py-8 px-6 text-center text-sm text-slate-500 bg-slate-950">
      <p>© {new Date().getFullYear()} Slope Swell Stride. All rights reserved.</p>
    </footer>
  );
}
export default Footer;
`
};

for (const [name, code] of Object.entries(landingComponents)) {
  const target = path.join('components/landing', name);
  if (!fs.existsSync(target)) {
    // Check if it exists in root or components first
    const fromRoot = name;
    const fromComp = path.join('components', name);
    if (fs.existsSync(fromRoot)) {
      fs.renameSync(fromRoot, target);
      console.log(`Moved ${fromRoot} -> ${target}`);
    } else if (fs.existsSync(fromComp)) {
      fs.renameSync(fromComp, target);
      console.log(`Moved ${fromComp} -> ${target}`);
    } else {
      fs.writeFileSync(target, code.trim());
      console.log(`Created ${target}`);
    }
  }
}

console.log('✓ Landing components verified and ready.');