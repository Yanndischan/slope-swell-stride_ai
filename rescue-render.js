import fs from 'fs';

// 1. Repair index.html to guarantee the React root div exists
const indexHtml = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Slope Swell Stride</title>
  </head>
  <body class="bg-slate-950 text-slate-100 antialiased min-h-screen">
    <div id="root"></div>
    <script type="module" src="/main.jsx"></script>
  </body>
</html>`;
fs.writeFileSync('index.html', indexHtml);

// 2. Ensure CSS exists so the import doesn't crash Vite
if (!fs.existsSync('index.css')) {
  fs.writeFileSync('index.css', `@tailwind base;\n@tailwind components;\n@tailwind utilities;\n`);
}

// 3. Inject an indestructible Error Boundary into main.jsx
const mainJsx = `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

class GlobalErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error, info) {
    console.error("App crashed!", error, info);
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', backgroundColor: '#450a0a', color: '#fecaca', minHeight: '100vh', fontFamily: 'monospace' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#f87171', fontWeight: 'bold' }}>React Runtime Error!</h1>
          <p style={{ marginBottom: '1rem' }}>Your app crashed. Here is the exact error causing the blank screen:</p>
          <div style={{ background: '#270303', padding: '1.5rem', borderRadius: '8px', overflowX: 'auto', border: '1px solid #7f1d1d' }}>
            <p style={{ fontWeight: 'bold', fontSize: '1.2rem', marginBottom: '1rem' }}>{this.state.error?.toString()}</p>
            <pre style={{ fontSize: '0.85rem' }}>{this.state.error?.stack}</pre>
          </div>
          <p style={{ marginTop: '1.5rem', color: '#fca5a5' }}>To fix: Open the file mentioned in the stack trace above.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <GlobalErrorBoundary>
        <App />
      </GlobalErrorBoundary>
    </React.StrictMode>
  );
} else {
  console.error("Could not find <div id='root'></div> in index.html");
}`;
fs.writeFileSync('main.jsx', mainJsx);

console.log('✓ React mounting pipeline repaired and Error Boundary injected.');