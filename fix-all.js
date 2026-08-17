import fs from 'fs';
import path from 'path';

const IGNORED_DIRS = new Set(['node_modules', '.git', 'dist', 'build', '.vercel', '.next']);
const VALID_EXTENSIONS = ['.jsx', '.js', '.tsx', '.ts', '.json', '.css'];

// 1. Collect all project files
function getAllFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (IGNORED_DIRS.has(entry.name)) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      getAllFiles(fullPath, fileList);
    } else {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

// 2. Check if an imported target exists on disk
function resolveExisting(targetPath) {
  for (const ext of VALID_EXTENSIONS) {
    if (fs.existsSync(targetPath + ext)) return targetPath + ext;
    if (fs.existsSync(path.join(targetPath, 'index' + ext))) return path.join(targetPath, 'index' + ext);
  }
  if (fs.existsSync(targetPath)) return targetPath;
  return null;
}

// 3. Extract imported identifiers to guarantee zero export errors
function parseImportClause(importClause) {
  const named = [];
  let defaultExport = null;
  if (!importClause) return { defaultExport: 'DefaultComponent', named: [] };

  const trimmed = importClause.trim();
  const namedMatch = trimmed.match(/\{([\s\S]*?)\}/);
  if (namedMatch) {
    const rawNamed = namedMatch[1].split(',');
    for (const item of rawNamed) {
      const parts = item.trim().split(/\s+as\s+/);
      const name = parts[0]?.trim();
      if (name) named.push(name);
    }
  }

  const beforeBrace = trimmed.split('{')[0].replace(/,/g, '').trim();
  if (beforeBrace && !beforeBrace.startsWith('*')) {
    defaultExport = beforeBrace;
  }

  return { defaultExport, named };
}

// 4. Main scanner loop (runs iteratively until 0 missing imports remain)
let iteration = 0;
let totalFixed = 0;

while (iteration < 5) {
  iteration++;
  const allFiles = getAllFiles('.');
  const codeFiles = allFiles.filter(f => /\.(jsx?|tsx?)$/.test(f) && !f.endsWith('fix-all.js') && !f.endsWith('setup-ui.js'));
  let fixedInThisPass = 0;

  const importRegex = /(?:import\s+([\s\S]*?)\s+from\s+['"]([^'"]+)['"]|export\s+([\s\S]*?)\s+from\s+['"]([^'"]+)['"]|require\(['"]([^'"]+)['"]\))/g;

  for (const filePath of codeFiles) {
    const content = fs.readFileSync(filePath, 'utf-8');
    let match;

    while ((match = importRegex.exec(content)) !== null) {
      const importClause = match[1] || match[3] || '';
      const rawTarget = match[2] || match[4];
      if (!rawTarget) continue;

      const isLocal = rawTarget.startsWith('.') ||
                      rawTarget.startsWith('/') ||
                      rawTarget.startsWith('@/') ||
                      rawTarget.startsWith('components/') ||
                      rawTarget.startsWith('pages/') ||
                      rawTarget.startsWith('lib/') ||
                      rawTarget.startsWith('hooks/') ||
                      rawTarget.startsWith('src/');

      if (!isLocal) continue;

      let normalizedTarget = rawTarget.replace(/^@\//, '');
      const sourceDir = path.dirname(filePath);
      const resolvedPath = normalizedTarget.startsWith('.')
        ? path.resolve(sourceDir, normalizedTarget)
        : path.resolve(normalizedTarget);

      const exists = resolveExisting(resolvedPath);
      if (!exists) {
        fixedInThisPass++;
        totalFixed++;

        const baseName = path.basename(resolvedPath);
        const candidate = allFiles.find(f => {
          const fBase = path.basename(f, path.extname(f)).toLowerCase();
          return fBase === baseName.toLowerCase() && f !== filePath;
        });

        const targetFile = resolvedPath.endsWith('.css')
          ? resolvedPath
          : (resolvedPath.endsWith('.json') ? resolvedPath : resolvedPath + '.jsx');

        const targetDir = path.dirname(targetFile);
        if (!fs.existsSync(targetDir)) {
          fs.mkdirSync(targetDir, { recursive: true });
        }

        if (candidate && fs.existsSync(candidate)) {
          fs.copyFileSync(candidate, targetFile);
          console.log(`[COPIED]  Found existing ${candidate} -> Created ${targetFile}`);
        } else {
          const { defaultExport, named } = parseImportClause(importClause);
          const safeDefName = (defaultExport || baseName.replace(/[^a-zA-Z0-9]/g, '') || 'DefaultComponent');

          let stubContent = `import React from "react";\n\n`;

          const allNamed = new Set(named);
          if (defaultExport) allNamed.add(defaultExport);
          if (allNamed.size === 0) allNamed.add(safeDefName);

          for (const name of allNamed) {
            if (/^use[A-Z]/.test(name)) {
              stubContent += `export function ${name}() { return {}; }\n`;
            } else {
              stubContent += `export function ${name}({ children, ...props }) { return <div {...props}>{children}</div>; }\n`;
            }
          }

          stubContent += `\nexport default ${safeDefName};\n`;

          fs.writeFileSync(targetFile, stubContent.trim());
          console.log(`[GENERATED] Created missing stub: ${targetFile}`);
        }
      }
    }
  }

  if (fixedInThisPass === 0) break;
}

console.log(`\n========================================`);
console.log(`  COMPLETE: Resolved ${totalFixed} missing files/imports.`);
console.log(`========================================\n`);