
import fs from 'fs';
import path from 'path';

const sizes = [16, 48, 128];
const assetsDir = path.join(process.cwd(), 'public', 'assets');

if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir, { recursive: true });
}

// Simple base64 for a transparent 1x1 PNG pixel, we will repeat it to make file valid-ish or just use a minimal valid PNG buffer.
// Actually, let's create a minimal valid PNG.
// 1x1 red pixel base64: iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==

const base64Png = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
const buffer = Buffer.from(base64Png, 'base64');

sizes.forEach(size => {
    fs.writeFileSync(path.join(assetsDir, `icon${size}.png`), buffer);
    console.log(`Created icon${size}.png`);
});
