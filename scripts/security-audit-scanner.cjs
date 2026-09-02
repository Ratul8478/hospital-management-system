const fs = require('fs');
const path = require('path');

function walk(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) {
      walk(full, fileList);
    } else {
      fileList.push(full);
    }
  }
  return fileList;
}

const rootDir = process.cwd();
const apiDir = path.join(rootDir, 'src', 'app', 'api');
const libDir = path.join(rootDir, 'src', 'lib');
const srcDir = path.join(rootDir, 'src');

console.log('================================================================');
console.log('🔒 COMPREHENSIVE REPOSITORY SECURITY AUDIT');
console.log('================================================================\n');

// 1. API Route Coverage Audit
const apiFiles = walk(apiDir).filter(f => f.endsWith('route.ts') || f.endsWith('route.js'));
console.log('Total API Route Handlers Found:', apiFiles.length);

const unauthEndpoints = [];
const publicLegitRoutes = [
  'api/v1/auth/login',
  'api/v1/auth/signup',
  'api/v1/auth/send-phone-otp',
  'api/v1/auth/verify-phone-otp',
  'api/v1/auth/verify-email',
  'api/v1/auth/resend-verification',
  'api/auth/super-admin/send-otp',
  'api/auth/super-admin/verify-otp',
  'api/v1/locations',
  'api/v1'
];

apiFiles.forEach(file => {
  const rel = path.relative(rootDir, file).replace(/\\/g, '/');
  const code = fs.readFileSync(file, 'utf8');

  const hasAuth = code.includes('verifyApiRequest') || code.includes('verifySuperAdminSession') || code.includes('verifyBearerToken');
  const isExcluded = publicLegitRoutes.some(p => rel.includes(p));

  if (!hasAuth && !isExcluded) {
    unauthEndpoints.push({ file: rel, snippet: code.slice(0, 300) });
  }
});

console.log('Non-authenticated non-whitelisted routes count:', unauthEndpoints.length);
unauthEndpoints.forEach(u => console.log('  ⚠️ Potentially unprotected:', u.file));

// 2. Search for Hardcoded Secrets & Weak Fallbacks
console.log('\n--- SCANNING FOR HARDCODED SECRETS & BACKDOORS ---');
const allSrcFiles = walk(srcDir).filter(f => f.endsWith('.ts') || f.endsWith('.tsx') || f.endsWith('.js'));
const secretPatterns = [
  { name: 'Hardcoded admin password', regex: /password\s*===\s*['"][^'"]+['"]/i },
  { name: 'Hardcoded JWT Secret', regex: /JWT_SECRET\s*=\s*['"][^'"]+['"]/i },
  { name: 'Hardcoded private key', regex: /BEGIN\s+PRIVATE\s+KEY/i },
  { name: 'Hardcoded API Token', regex: /(?:apiKey|api_key|token)\s*:\s*['"][A-Za-z0-9_\-]{30,}['"]/i },
];

const secretHits = [];
allSrcFiles.forEach(file => {
  const rel = path.relative(rootDir, file).replace(/\\/g, '/');
  const code = fs.readFileSync(file, 'utf8');
  secretPatterns.forEach(pat => {
    if (pat.regex.test(code)) {
      secretHits.push({ file: rel, check: pat.name });
    }
  });
});
console.log('Secret check results:', secretHits.length === 0 ? '✅ Clean (No exposed secrets)' : secretHits);

// 3. Search for CORS Configuration
console.log('\n--- SCANNING CORS & SECURITY HEADERS ---');
const corsFiles = [];
allSrcFiles.forEach(file => {
  const rel = path.relative(rootDir, file).replace(/\\/g, '/');
  const code = fs.readFileSync(file, 'utf8');
  if (code.includes('Access-Control-Allow-Origin') || code.includes('cors')) {
    corsFiles.push(rel);
  }
});
console.log('Files defining or configuring CORS:', corsFiles);

// 4. Check Middleware Protection
console.log('\n--- CHECKING NEXT.JS ROOT MIDDLEWARE ---');
const middlewareFile = path.join(rootDir, 'src', 'middleware.ts');
if (fs.existsSync(middlewareFile)) {
  const mwCode = fs.readFileSync(middlewareFile, 'utf8');
  console.log('Middleware exists. Length:', mwCode.length, 'bytes');
  console.log('Middleware Matchers configured:', mwCode.includes('matcher'));
} else {
  console.log('⚠️ Warning: src/middleware.ts not found.');
}
