const fs = require('fs');
const path = require('path');

const srcApk = path.join(__dirname, 'doctor-android', 'app', 'build', 'outputs', 'apk', 'debug', 'app-debug.apk');
const destApk = path.join(__dirname, 'Medix_Doctor_App.apk');
const destApkVersioned = path.join(__dirname, 'Medix_Doctor_App_v2.0.0.apk');
const destApkCompat = path.join(__dirname, 'HMS_Doctor_App.apk');

if (fs.existsSync(srcApk)) {
  fs.copyFileSync(srcApk, destApk);
  fs.copyFileSync(srcApk, destApkVersioned);
  fs.copyFileSync(srcApk, destApkCompat);
  const stats = fs.statSync(destApk);
  console.log(`✅ Version 2.0.0 APK successfully generated & copied to root!`);
  console.log(`📁 Files:`);
  console.log(`   - Medix_Doctor_App_v2.0.0.apk (${(stats.size / (1024 * 1024)).toFixed(2)} MB)`);
  console.log(`   - Medix_Doctor_App.apk (${(stats.size / (1024 * 1024)).toFixed(2)} MB)`);
} else {
  console.error('Source APK not found at: ' + srcApk);
}
