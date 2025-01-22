// scripts/ensure-data-dirs.js
const fs = require('fs');
const path = require('path');

const dirs = [
  'data',
  'data/services',
  'data/services/web-development',
];

dirs.forEach(dir => {
  const fullPath = path.join(process.cwd(), dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
});