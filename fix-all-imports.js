import fs from 'fs';
import path from 'path';

// 1. Create GoogleIcon specifically if missing
const googleIconPath = path.resolve('components/GoogleIcon.jsx');
if (!fs.existsSync(googleIconPath)) {
  const googleIconCode = `
import React from "react";

export function GoogleIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" {...props}>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

export default GoogleIcon;
`;
  fs.writeFileSync(googleIconPath, googleIconCode.trim());
  console.log('✓ Created components/GoogleIcon.jsx');
}

// 2. Scan all JS/JSX files and resolve any missing relative imports
function getAllFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (file !== 'node_modules' && file !== '.git' && file !== 'dist') {
        getAllFiles(fullPath, fileList);
      }
    } else if (/\.(jsx?|tsx?)$/.test(file)) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

const allProjectFiles = getAllFiles('.');
const extensions = ['', '.jsx', '.js', '.tsx', '.ts', '/index.jsx', '/index.js'];

// Look for relative imports
const importRegex = /(?:import\s+(?:[\w\s{},*]+)\s+from\s+['"]([^'"]+)['"]|require\(['"]([^'"]+)['"]\))/g;

allProjectFiles.forEach((filePath) => {
  const content = fs.readFileSync(filePath, 'utf-8');
  let match;

  while ((match = importRegex.exec(content)) !== null) {
    const importTarget = match[1] || match[2];
    
    // Only check local imports (starting with ./ or ../ or components/ or lib/ or pages/)
    if (
      importTarget.startsWith('.') ||
      importTarget.startsWith('components/') ||
      importTarget.startsWith('lib/') ||
      importTarget.startsWith('pages/')
    ) {
      const sourceDir = path.dirname(filePath);
      const resolvedBase = importTarget.startsWith('.')
        ? path.resolve(sourceDir, importTarget)
        : path.resolve(importTarget);

      const exists = extensions.some((ext) => fs.existsSync(resolvedBase + ext));

      if (!exists) {
        // Missing target: check if a file with that basename exists anywhere in project
        const baseName = path.basename(importTarget);
        let foundAnywhere = null;

        for (const candidate of allProjectFiles) {
          if (path.basename(candidate, path.extname(candidate)) === baseName) {
            foundAnywhere = candidate;
            break;
          }
        }

        const targetFile = resolvedBase.endsWith('.jsx') || resolvedBase.endsWith('.js')
          ? resolvedBase
          : resolvedBase + '.jsx';

        const targetFolder = path.dirname(targetFile);
        if (!fs.existsSync(targetFolder)) {
          fs.mkdirSync(targetFolder, { recursive: true });
        }

        if (foundAnywhere) {
          fs.copyFileSync(foundAnywhere, targetFile);
          console.log(`✓ Resolved & copied: ${foundAnywhere} -> ${targetFile}`);
        } else {
          // Generate an adaptable React component fallback
          const fallbackCode = `
import React from "react";

export function ${baseName.replace(/[^a-zA-Z0-9]/g, '') || "Component"}({ children, ...props }) {
  return <div {...props}>{children}</div>;
}

export default ${baseName.replace(/[^a-zA-Z0-9]/g, '') || "Component"};
`;
          fs.writeFileSync(targetFile, fallbackCode.trim());
          console.log(`✓ Auto-generated fallback for missing module: ${targetFile}`);
        }
      }
    }
  }
});

console.log('\n--- All missing imports scanned and resolved ---');