import React from "react";
export function Footer() {
  return (
    <footer className="w-full border-t border-slate-800 py-8 px-6 text-center text-sm text-slate-500 bg-slate-950">
      <p>© {new Date().getFullYear()} Slope Swell Stride. All rights reserved.</p>
    </footer>
  );
}
export default Footer;