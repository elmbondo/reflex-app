const fs = require('fs');
const path = require('path');

const src = path.resolve(process.env.USERPROFILE, '.gemini/antigravity-ide/brain/9a629064-e5fd-4052-9a0d-182e875b2e7b/reflex_hero_delivery_1788041505182.jpg');
const destDir = path.resolve(__dirname, 'public/images');
const dest = path.join(destDir, 'reflex-hero-delivery.jpg');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

if (fs.existsSync(src)) {
  fs.copyFileSync(src, dest);
  console.log('Image copied to', dest);
} else {
  console.error('Source image not found:', src);
}
