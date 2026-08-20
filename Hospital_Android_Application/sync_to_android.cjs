const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'preview');
const destDir = path.join(__dirname, 'doctor-android', 'app', 'src', 'main', 'assets', 'medix');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

// Copy all files from preview to android assets (excluding large APK files)
const files = fs.readdirSync(srcDir);
files.forEach(file => {
  if (file.endsWith('.apk')) return; // Never bundle APK inside APK assets!
  const srcPath = path.join(srcDir, file);
  const destPath = path.join(destDir, file);
  if (fs.lstatSync(srcPath).isFile()) {
    fs.copyFileSync(srcPath, destPath);
    console.log(`Copied ${file} -> Android assets/medix/`);
  }
});

// Also copy offline html as index.html fallback
const offlineHtmlSrc = path.join(__dirname, 'HMS_Doctor_Offline_App.html');
if (fs.existsSync(offlineHtmlSrc)) {
  fs.copyFileSync(offlineHtmlSrc, path.join(destDir, 'offline.html'));
  console.log('Copied HMS_Doctor_Offline_App.html -> Android assets/medix/offline.html');
}

console.log('All Medix web & offline assets deployed to Android project successfully!');
