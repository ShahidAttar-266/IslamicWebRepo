const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function optimizeImages() {
  const assetsDir = path.join(__dirname, 'src', 'assets');
  const logoPath = path.join(assetsDir, 'logo.png');
  const logoWebpPath = path.join(assetsDir, 'logo.webp');

  if (fs.existsSync(logoPath)) {
    await sharp(logoPath)
      .resize(150, 150, { fit: 'inside' })
      .webp({ quality: 80 })
      .toFile(logoWebpPath);
    console.log('Logo optimized successfully.');
  } else {
    console.log('logo.png not found.');
  }
}

optimizeImages().catch(console.error);