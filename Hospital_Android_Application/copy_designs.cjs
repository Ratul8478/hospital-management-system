const fs = require('fs');
const path = require('path');

const brainDir = path.join('C:', 'Users', 'Mr.Ratul', '.gemini', 'antigravity', 'brain', '911d58f5-61a8-4644-b6ac-b9d131a04938');
const targetDir = path.join(__dirname, 'preview', 'designs');

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const images = [
  { id: 1, file: 'medix_ui_neoclinical_glass_1786993173069.jpg', title: 'Concept 1: Neo-Clinical Glassmorphism 3.0 (Dark Obsidian)' },
  { id: 2, file: 'medix_ui_swiss_minimalist_1786993234076.jpg', title: 'Concept 2: Swiss Medical Minimalist (Clean White)' },
  { id: 3, file: 'medix_ui_nordic_bento_1786993460383.jpg', title: 'Concept 3: Nordic Bio-Luminescence (Bento Grid Dark)' },
  { id: 4, file: 'medix_ui_deep_ocean_1786993903644.jpg', title: 'Concept 4: Deep Ocean Clinical & Dynamic Island' },
  { id: 5, file: 'medix_ui_cyber_titanium_1786994301013.jpg', title: 'Concept 5: Cyber-Clinic Dark Titanium (Neomorphic 3D)' },
  { id: 6, file: 'medix_ui_emerald_life_1786994564907.jpg', title: 'Concept 6: Emerald Life Clinical (Warm Organic Health)' },
  { id: 7, file: 'medix_ui_royal_amethyst_1786994587492.jpg', title: 'Concept 7: Royal Amethyst & Cobalt Fusion (Luxury Health)' },
  { id: 9, file: 'medix_ui_aurora_glass_1786994608411.jpg', title: 'Concept 9: Modern Aurora Glass & Vibrant Mesh' },
  { id: 11, file: 'medix_ui_cyber_pulse_1786994629207.jpg', title: 'Concept 11: Dark Cyber-Pulse Cardiogram Studio' }
];

images.forEach(img => {
  const src = path.join(brainDir, img.file);
  const dest = path.join(targetDir, img.file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
  }
});

// Generate HTML gallery
const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Medix — UI/UX Design Selection Gallery</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Plus Jakarta Sans', sans-serif; background: #070B11; color: #F1F5F9; padding: 30px 20px; }
    .gallery-header { text-align: center; margin-bottom: 40px; }
    .gallery-header h1 { font-size: 28px; font-weight: 800; color: #FFFFFF; }
    .gallery-header p { font-size: 14px; color: #94A3B8; margin-top: 6px; }
    .gallery-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 30px; max-width: 1300px; margin: 0 auto; }
    .design-card { background: #111A24; border: 1px solid rgba(255,255,255,0.12); border-radius: 20px; overflow: hidden; padding: 18px; transition: transform 0.25s, border-color 0.25s; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
    .design-card:hover { transform: translateY(-4px); border-color: #2563EB; box-shadow: 0 15px 40px rgba(37,99,235,0.3); }
    .card-title { font-size: 17px; font-weight: 700; color: #FFFFFF; margin-bottom: 12px; display: flex; align-items: center; justify-content: space-between; }
    .card-badge { font-size: 11px; padding: 3px 8px; border-radius: 6px; background: rgba(37,99,235,0.2); color: #38BDF8; font-weight: 700; }
    .design-img-box { width: 100%; border-radius: 14px; overflow: hidden; background: #000; }
    .design-img-box img { width: 100%; height: auto; display: block; border-radius: 14px; }
  </style>
</head>
<body>
  <div class="gallery-header">
    <h1>🏥 Medix UI/UX Design Selection Gallery</h1>
    <p>Apna pasandeeda concept select karein aur uska number batayein</p>
  </div>
  <div class="gallery-grid">
    ${images.map(img => `
      <div class="design-card">
        <div class="card-title">
          <span>${img.title}</span>
          <span class="card-badge">Concept ${img.id}</span>
        </div>
        <div class="design-img-box">
          <img src="designs/${img.file}" alt="${img.title}">
        </div>
      </div>
    `).join('')}
  </div>
</body>
</html>`;

fs.writeFileSync(path.join(__dirname, 'preview', 'design_gallery.html'), htmlContent);
console.log('Design gallery and images prepared successfully!');
