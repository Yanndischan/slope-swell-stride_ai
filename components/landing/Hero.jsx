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