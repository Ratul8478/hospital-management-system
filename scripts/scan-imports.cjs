const fs = require('fs');
const path = require('path');

const apiDir = path.join(__dirname, '..', 'src', 'app', 'api');

function scan(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      scan(p);
    } else if (e.name === 'route.ts') {
      const content = fs.readFileSync(p, 'utf8');
      // Find all imports from @/lib/backend-store
      const bsImports = [];
      const regex = /import\s*\{([^}]+)\}\s*from\s*['"]@\/lib\/backend-store['"]/g;
      let m;
      while ((m = regex.exec(content)) !== null) {
        bsImports.push(...m[1].split(',').map(s => s.trim()).filter(Boolean));
      }

      // Find all @/lib/* imports
      const allLibImports = [];
      const libRegex = /from\s*['"]@\/lib\/([^'"]+)['"]/g;
      while ((m = libRegex.exec(content)) !== null) {
        allLibImports.push(m[1]);
      }

      const rel = path.relative(path.join(__dirname, '..'), p).replace(/\\/g, '/');
      if (bsImports.length > 0 || allLibImports.length > 0) {
        console.log(`\n${rel}`);
        if (bsImports.length > 0) {
          console.log(`  backend-store imports: ${bsImports.join(', ')}`);
        }
        console.log(`  all lib imports: ${allLibImports.join(', ')}`);
      }
    }
  }
}

scan(apiDir);
