import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.resolve(__dirname, '..');
const dirsToOptimize = [
  path.join(rootDir, 'src/assets'),
  path.join(rootDir, 'public')
];

const extensions = ['.png', '.jpg', '.jpeg'];

async function optimizeImages() {
  console.log('🚀 Starting image optimization...');

  for (const dir of dirsToOptimize) {
    if (!fs.existsSync(dir)) continue;

    const files = fs.readdirSync(dir, { recursive: true });

    for (const file of files) {
      if (typeof file !== 'string') continue;
      
      const filePath = path.join(dir, file);
      const ext = path.extname(file).toLowerCase();

      if (extensions.includes(ext)) {
        const webpPath = filePath.replace(ext, '.webp');

        try {
          // Convert to WebP
          await sharp(filePath)
            .webp({ quality: 80 })
            .toFile(webpPath);
          
          console.log(`✅ Converted: ${file} -> ${path.basename(webpPath)}`);

          // Also optimize the original if it's not already optimized (optional)
          // For now, we just ensure WebP exists
        } catch (error) {
          console.error(`❌ Error converting ${file}:`, error);
        }
      }
    }
  }

  console.log('✨ Image optimization complete!');
}

optimizeImages();
