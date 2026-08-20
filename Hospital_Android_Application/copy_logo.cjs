const fs = require('fs');
const path = require('path');

const logoSrc = path.join('C:', 'Users', 'Mr.Ratul', '.gemini', 'antigravity', 'brain', '911d58f5-61a8-4644-b6ac-b9d131a04938', '.user_uploaded', 'media_1786992197675.png');

if (fs.existsSync(logoSrc)) {
  const logoBuffer = fs.readFileSync(logoSrc);
  
  // 1. Write to preview folder
  fs.writeFileSync(path.join(__dirname, 'preview', 'medix_logo.png'), logoBuffer);
  fs.writeFileSync(path.join(__dirname, 'preview', 'icon-192.png'), logoBuffer);
  fs.writeFileSync(path.join(__dirname, 'preview', 'icon-512.png'), logoBuffer);
  fs.writeFileSync(path.join(__dirname, 'preview', 'icon.png'), logoBuffer);
  
  // 2. Write to Android mipmap icons
  const mipmaps = ['mipmap-hdpi', 'mipmap-mdpi', 'mipmap-xhdpi', 'mipmap-xxhdpi', 'mipmap-xxxhdpi'];
  mipmaps.forEach(m => {
    const dir = path.join(__dirname, 'doctor-android', 'app', 'src', 'main', 'res', m);
    if (fs.existsSync(dir)) {
      fs.writeFileSync(path.join(dir, 'ic_launcher.png'), logoBuffer);
      fs.writeFileSync(path.join(dir, 'ic_launcher_round.png'), logoBuffer);
    }
  });

  console.log('Medix logo deployed successfully to all locations!');
} else {
  console.log('Source logo not found at: ' + logoSrc);
}
