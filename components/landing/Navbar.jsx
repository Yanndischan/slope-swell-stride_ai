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