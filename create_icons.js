
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Base64 for a 1x1 pixel transparent PNG
const pngBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
const buffer = Buffer.from(pngBase64, 'base64');

const assetsDir = path.join(__dirname, 'public', 'assets');
const icons = ['icon16.png', 'icon48.png', 'icon128.png'];

// Ensure directory exists
if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir, { recursive: true });
}

icons.forEach(icon => {
    fs.writeFileSync(path.join(assetsDir, icon), buffer);
    console.log(`Created ${icon} in ${assetsDir}`);
});
