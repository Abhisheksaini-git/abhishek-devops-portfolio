import fs from 'fs';

// Read index.html
let html = fs.readFileSync('index.html', 'utf8');

// Read Tux.svg
let tux = fs.readFileSync('scratch/Tux.svg', 'utf8');
// Clean xml header
tux = tux.replace(/<\?xml[^>]*\?>/g, '').trim();

// Ensure width and height are set for the svg
tux = tux.replace('<svg version="1.1" viewBox="0 0 216 256"', '<svg width="48" height="48" viewBox="0 0 216 256"');

// Target replacement
const target = `<img src="/linux.svg" alt="Linux" width="48" height="48" style="max-width: 48px; max-height: 48px; object-fit: contain;" />`;

if (!html.includes(target)) {
  console.error('Target string not found in index.html');
  process.exit(1);
}

html = html.replace(target, tux);
fs.writeFileSync('index.html', html, 'utf8');
console.log('Successfully replaced linux img with inline Tux SVG in index.html');
