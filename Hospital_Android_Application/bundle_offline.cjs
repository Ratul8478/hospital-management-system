const fs = require('fs');
const path = require('path');

const previewDir = path.join(__dirname, 'preview');

// Read source files
const srcHtmlPath = fs.existsSync(path.join(previewDir, 'src_index.html'))
  ? path.join(previewDir, 'src_index.html')
  : path.join(previewDir, 'index.html');

let html = fs.readFileSync(srcHtmlPath, 'utf8');

// Ensure src_index.html backup exists
if (!fs.existsSync(path.join(previewDir, 'src_index.html'))) {
  fs.writeFileSync(path.join(previewDir, 'src_index.html'), html, 'utf8');
}

const css = fs.readFileSync(path.join(previewDir, 'styles.css'), 'utf8');
const js = fs.readFileSync(path.join(previewDir, 'app.js'), 'utf8');

// Inline all CSS and JS directly into the HTML
let bundledHtml = html;
bundledHtml = bundledHtml.replace('<link rel="stylesheet" href="styles.css">', `<style>\n${css}\n</style>`);
bundledHtml = bundledHtml.replace('<script src="app.js"></script>', `<script>\n${js}\n</script>`);

// 1. Overwrite preview/index.html so the live link serves the 100% self-contained single file
fs.writeFileSync(path.join(previewDir, 'index.html'), bundledHtml, 'utf8');

// 2. Write preview/HMS_Doctor_Offline_App.html for in-app download button
fs.writeFileSync(path.join(previewDir, 'HMS_Doctor_Offline_App.html'), bundledHtml, 'utf8');

// 3. Write root HMS_Doctor_Offline_App.html for direct WhatsApp/Email sending
const rootOutputPath = path.join(__dirname, 'HMS_Doctor_Offline_App.html');
fs.writeFileSync(rootOutputPath, bundledHtml, 'utf8');

console.log('✅ Auto-Import Complete! All CSS & JavaScript are now embedded directly into the live HTML URL.');
console.log('📦 Standalone Size: ' + fs.statSync(rootOutputPath).size + ' bytes');
