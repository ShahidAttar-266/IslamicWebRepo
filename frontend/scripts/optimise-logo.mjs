import sharp from 'sharp';
import { existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const src = join(__dirname, '..', 'src', 'assets', 'logo.png');
const publicDir = join(__dirname, '..', 'public');

if (!existsSync(publicDir)) {
  mkdirSync(publicDir, { recursive: true });
}

const generate = async () => {
  try {
    console.log(`Optimising logo from: ${src}`);
    
    // WebP versions
    await sharp(src).resize(40, 40).webp({ quality: 90 }).toFile(join(publicDir, 'logo-40.webp'));
    await sharp(src).resize(80, 80).webp({ quality: 90 }).toFile(join(publicDir, 'logo-80.webp'));
    await sharp(src).resize(120, 120).webp({ quality: 90 }).toFile(join(publicDir, 'logo-120.webp'));

    // Fallback PNGs
    await sharp(src).resize(40, 40).png({ compressionLevel: 9 }).toFile(join(publicDir, 'logo-40.png'));
    await sharp(src).resize(80, 80).png({ compressionLevel: 9 }).toFile(join(publicDir, 'logo-80.png'));

    console.log('✅ Logo images generated in /public');
  } catch (err) {
    console.error('❌ Error generating logos:', err);
    process.exit(1);
  }
};

generate();
