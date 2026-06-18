/* global process */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Critters from 'critters';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, '../dist');

async function processHtmlFiles() {
  console.log('Starting Critters critical CSS inlining...');

  const critters = new Critters({
    path: distDir,
    publicPath: '/',
    preload: 'media',
    pruneSource: false, // Keep the full CSS stylesheet intact for dynamic/lazy elements
  });

  // Dynamically find all HTML files in dist
  const files = [];
  function findHtmlFiles(dir) {
    const list = fs.readdirSync(dir);
    for (const file of list) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        findHtmlFiles(fullPath);
      } else if (file.endsWith('.html')) {
        files.push(path.relative(distDir, fullPath));
      }
    }
  }
  findHtmlFiles(distDir);

  for (const file of files) {
    const filePath = path.join(distDir, file);
    if (fs.existsSync(filePath)) {
      console.log(`Processing: ${file}`);
      try {
        const html = fs.readFileSync(filePath, 'utf8');
        const inlined = await critters.process(html);
        fs.writeFileSync(filePath, inlined, 'utf8');
        console.log(`✓ Successfully inlined CSS for ${file}`);
      } catch (err) {
        console.error(`✗ Failed to inline CSS for ${file}:`, err);
      }
    } else {
      console.log(`Skipping (not found): ${file}`);
    }
  }

  console.log('Critters critical CSS inlining completed.');
}

processHtmlFiles().catch((err) => {
  console.error('Post-build script failed:', err);
  process.exit(1);
});
