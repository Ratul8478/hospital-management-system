const fs = require('fs');
const path = require('path');

const previewDir = path.join(__dirname, 'preview');
let html = fs.readFileSync(path.join(previewDir, 'index.html'), 'utf8');
const css = fs.readFileSync(path.join(previewDir, 'styles.css'), 'utf8');
const js = fs.readFileSync(path.join(previewDir, 'app.js'), 'utf8');

// Inline CSS and JS
html = html.replace('<link rel="stylesheet" href="styles.css">', `<style>\n${css}\n</style>`);
html = html.replace('<script src="app.js"></script>', `<script>\n${js}\n</script>`);

const outputPath = path.join(__dirname, 'HMS_Doctor_Offline_App.html');
fs.writeFileSync(outputPath, html, 'utf8');

const outputPreviewPath = path.join(previewDir, 'HMS_Doctor_Offline_App.html');
fs.writeFileSync(outputPreviewPath, html, 'utf8');

console.log('Successfully generated standalone offline package: ' + outputPath + ' (' + fs.statSync(outputPath).size + ' bytes)');
