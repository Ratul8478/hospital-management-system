const fs = require('fs');
const path = require('path');

const userUploadedDir = 'C:\\Users\\Mr.Ratul\\.gemini\\antigravity\\brain\\911d58f5-61a8-4644-b6ac-b9d131a04938\\.user_uploaded';

console.log("Checking user uploaded directory:", userUploadedDir);

if (!fs.existsSync(userUploadedDir)) {
  console.log("Directory does not exist, checking alternative locations...");
} else {
  const files = fs.readdirSync(userUploadedDir);
  console.log("Found files:", files);

  // Find most recent image file
  const imgFiles = files.filter(f => f.match(/\.(png|jpg|jpeg|webp)$/i))
    .map(f => ({
      name: f,
      fullPath: path.join(userUploadedDir, f),
      mtime: fs.statSync(path.join(userUploadedDir, f)).mtimeMs
    }))
    .sort((a, b) => b.mtime - a.mtime);

  if (imgFiles.length > 0) {
    const latestLogo = imgFiles[0];
    console.log("Latest user logo found:", latestLogo);

    const logoBuffer = fs.readFileSync(latestLogo.fullPath);

    // Save as primary logo in root and preview
    fs.writeFileSync(path.join(__dirname, '../app_logo_custom.png'), logoBuffer);
    fs.writeFileSync(path.join(__dirname, '../preview/medix_logo.png'), logoBuffer);
    fs.writeFileSync(path.join(__dirname, '../preview/icon.png'), logoBuffer);
    fs.writeFileSync(path.join(__dirname, '../preview/icon-192.png'), logoBuffer);
    fs.writeFileSync(path.join(__dirname, '../preview/icon-512.png'), logoBuffer);

    // Copy to Android assets
    const androidAssets = path.join(__dirname, '../doctor-android/app/src/main/assets/medix');
    if (!fs.existsSync(androidAssets)) fs.mkdirSync(androidAssets, { recursive: true });
    fs.writeFileSync(path.join(androidAssets, 'medix_logo.png'), logoBuffer);
    fs.writeFileSync(path.join(androidAssets, 'icon.png'), logoBuffer);
    fs.writeFileSync(path.join(androidAssets, 'icon-192.png'), logoBuffer);
    fs.writeFileSync(path.join(androidAssets, 'icon-512.png'), logoBuffer);

    // Copy to Android drawable and mipmaps
    const resDir = path.join(__dirname, '../doctor-android/app/src/main/res');
    const drawables = ['drawable', 'mipmap-mdpi', 'mipmap-hdpi', 'mipmap-xhdpi', 'mipmap-xxhdpi', 'mipmap-xxxhdpi'];
    
    drawables.forEach(d => {
      const targetDir = path.join(resDir, d);
      if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });
      fs.writeFileSync(path.join(targetDir, 'ic_launcher.png'), logoBuffer);
      fs.writeFileSync(path.join(targetDir, 'ic_launcher_round.png'), logoBuffer);
      fs.writeFileSync(path.join(targetDir, 'ic_launcher_foreground.png'), logoBuffer);
      fs.writeFileSync(path.join(targetDir, 'app_logo.png'), logoBuffer);
    });

    console.log("✅ All Android app icons and web logos updated successfully with the custom brand logo!");
  } else {
    console.log("No image files found in .user_uploaded");
  }
}
