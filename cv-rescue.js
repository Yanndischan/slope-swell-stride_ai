import fs from 'fs';

const appJsx = `import React, { Suspense, Component } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

// 1. Error Boundary specific to pages so the whole app never crashes
class PageBoundary extends Component {
  constructor(props) { super(props); this.state = { hasError: false, error: null }; }
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 p-8 text-center flex flex-col items-center justify-center">
          <h2 className="text-2xl text-red-400 font-bold mb-4">Module Under Construction</h2>
          <p className="text-slate-400 max-w-lg mb-6">This feature is currently being developed. Please explore other parts of the portfolio.</p>
          <div className="bg-slate-900 p-4 rounded-lg border border-red-900/30 text-left text-sm text-red-200 w-full max-w-2xl overflow-x-auto">
            {this.state.error?.toString()}
          </div>
          <Link to="/" className="mt-8 px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition">Return Home</Link>
        </div>
      );
    }
    return this.props.children;
  }
}

// 2. Safe Dynamic Imports (Isolates crashes so they don't break the whole app)
const safeImport = (importFn, name) => React.lazy(() => 
  importFn().catch(err => ({
    default: () => (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 p-6 text-center text-slate-300">
        <h1 className="text-3xl font-bold mb-4">{name} - WIP</h1>
        <p className="text-sm bg-slate-900 p-4 rounded-md border border-slate-800 max-w-xl">{err.message}</p>
        <Link to="/" className="mt-6 text-blue-400 hover:text-blue-300 transition">← Back to Portfolio Menu</Link>
      </div>
    )
  }))
);

// Map your pages
const Home = safeImport(() => import("./pages/Home.jsx"), "Home");
const Dashboard = safeImport(() => import("./pages/Dashboard.jsx"), "Dashboard");
const Register = safeImport(() => import("./pages/Register.jsx"), "Register");
const MyHorizon = safeImport(() => import("./pages/MyHorizon.jsx"), "MyHorizon");
const GearConcierge = safeImport(() => import("./pages/GearConcierge.jsx"), "GearConcierge");

// 3. A pristine, guaranteed-to-work landing page for your CV
const PortfolioLanding = () => (
  <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 text-center font-sans">
    <div className="max-w-3xl relative z-10">
      <h1 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent mb-6 pb-2 tracking-tight">
        Slope Swell Stride
      </h1>
      <p className="text-slate-400 mb-10 text-lg md:text-xl leading-relaxed">
        Welcome to my portfolio preview. This application is currently in active development. 
        Feel free to explore the functional modules below.
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        <Link to="/home" className="px-6 py-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-blue-500 hover:bg-slate-800 transition font-medium shadow-lg">View Main Site</Link>
        <Link to="/dashboard" className="px-6 py-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500 hover:bg-slate-800 transition font-medium shadow-lg">Dashboard</Link>
        <Link to="/horizon" className="px-6 py-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-purple-500 hover:bg-slate-800 transition font-medium shadow-lg">My Horizon</Link>
        <Link to="/gear" className="px-6 py-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-orange-500 hover:bg-slate-800 transition font-medium shadow-lg">Gear Concierge</Link>
      </div>
    </div>
  </div>
);

// 4. Loading State
const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-400">
    <div className="animate-pulse flex flex-col items-center">
      <div className="h-8 w-8 rounded-full border-4 border-t-blue-500 border-slate-800 animate-spin mb-4"></div>
      <p>Loading Module...</p>
    </div>
  </div>
);

// 5. Secure App Shell
export default function App() {
  return (
    <BrowserRouter>
      <PageBoundary>
        <Suspense fallback={<LoadingScreen />}>
          <Routes>
            <Route path="/" element={<PortfolioLanding />} />
            <Route path="/home" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/register" element={<Register />} />
            <Route path="/horizon" element={<MyHorizon />} />
            <Route path="/gear" element={<GearConcierge />} />
            <Route path="*" element={<PortfolioLanding />} />
          </Routes>
        </Suspense>
      </PageBoundary>
    </BrowserRouter>
  );
}
`;

fs.writeFileSync('App.jsx', appJsx);
console.log("✓ App.jsx rewritten with CV-safe dynamic routing.");