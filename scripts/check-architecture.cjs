const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  fs.readdirSync(dir).forEach(file => {
    const full = path.join(dir, file);
    if (fs.statSync(full).isDirectory()) {
      if (file !== 'node_modules' && file !== '.next') {
        results = results.concat(walk(full));
      }
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      results.push(full.replace(/\\/g, '/'));
    }
  });
  return results;
}

const files = walk('src');
console.log('Total TypeScript files in src:', files.length);

const importsMap = {};
files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const lines = content.split('\n');
  importsMap[f] = [];
  lines.forEach(l => {
    const match = l.match(/from ['"](@\/[^'"]+)['"]/);
    if (match) {
      importsMap[f].push(match[1]);
    }
  });
});

let circularCount = 0;
files.forEach(f => {
  const shortF = f.replace('src/', '@/').replace(/\.tsx?$/, '');
  (importsMap[f] || []).forEach(imp => {
    const targetBase = imp.replace('@/', 'src/');
    const targetTs = targetBase + '.ts';
    const targetTsx = targetBase + '.tsx';
    const targetFile = fs.existsSync(targetTs) ? targetTs : fs.existsSync(targetTsx) ? targetTsx : null;
    if (targetFile) {
      const targetImports = importsMap[targetFile] || [];
      if (targetImports.includes(shortF)) {
        console.log(`⚠️ Circular import: ${f} <---> ${targetFile}`);
        circularCount++;
      }
    }
  });
});

console.log(`Circular dependencies detected: ${circularCount}`);

// Domain Analysis in lib/
console.log('\n--- LIB/ MODULES AUDIT ---');
const libFiles = fs.readdirSync('src/lib').filter(f => f.endsWith('.ts') || f.endsWith('.tsx'));
libFiles.forEach(f => {
  const content = fs.readFileSync(path.join('src/lib', f), 'utf8');
  const lines = content.split('\n').length;
  console.log(`📄 src/lib/${f} (${lines} lines)`);
});
