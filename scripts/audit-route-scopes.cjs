const fs = require('fs');
const path = require('path');

function walk(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) walk(full, fileList);
    else if (f.endsWith('.ts')) fileList.push(full);
  }
  return fileList;
}

const apiFiles = walk(path.join(process.cwd(), 'src', 'app', 'api'));
const routeScopes = [];

apiFiles.forEach(f => {
  const code = fs.readFileSync(f, 'utf8');
  const rel = path.relative(process.cwd(), f).replace(/\\/g, '/');
  const regex = /verifyApiRequest\s*\(\s*request\s*,\s*['"]([^'"]+)['"]\s*\)/g;
  let match;
  let found = false;
  while ((match = regex.exec(code)) !== null) {
    routeScopes.push({ file: rel, scope: match[1] });
    found = true;
  }
  if (!found) {
    if (rel.includes('auth/login') || rel.includes('auth/signup') || rel.includes('auth/verify') || rel.includes('auth/send-phone-otp') || rel.includes('locations')) {
      routeScopes.push({ file: rel, scope: 'PUBLIC' });
    } else if (code.includes('verifySuperAdminSession') || code.includes('lookupSuperAdminSession')) {
      routeScopes.push({ file: rel, scope: 'super_admin (session)' });
    } else {
      routeScopes.push({ file: rel, scope: 'UNPROTECTED / UNKNOWN' });
    }
  }
});

console.log('API Route Scope Table (' + routeScopes.length + ' entries):');
routeScopes.sort((a, b) => a.scope.localeCompare(b.scope)).forEach(r => {
  console.log(r.scope.padEnd(25) + ' -> ' + r.file);
});
